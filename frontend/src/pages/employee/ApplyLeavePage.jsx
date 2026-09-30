import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useToast } from '../../hooks/useToast';
import {
  Send,
  AlertTriangle,
  FileCheck,
  Upload,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { leaveTypeService } from '../../services/leaveTypeService';
import { balanceService } from '../../services/balanceService';
import { leaveService } from '../../services/leaveService';

const today = new Date().toISOString().split('T')[0];

const ApplyLeavePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Form Fields
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const [typesRes, balRes] = await Promise.all([
          leaveTypeService.getActive(),
          balanceService.getByEmployeeId(user.id),
        ]);
        setLeaveTypes(typesRes.data || []);
        setBalances(balRes.data || []);
      } catch (err) {
        setServerError(err.response?.data?.message || 'Failed to load leave types or quota balance.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [user?.id]);

  // Find selected leave type details & corresponding balance
  const selectedLeaveType = useMemo(() => {
    return leaveTypes.find((t) => String(t.id) === String(leaveTypeId));
  }, [leaveTypes, leaveTypeId]);

  const selectedBalance = useMemo(() => {
    return balances.find((b) => String(b.leaveTypeId) === String(leaveTypeId));
  }, [balances, leaveTypeId]);

  // Calculate requested days
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }, [startDate, endDate]);

  const remainingDays = selectedBalance ? selectedBalance.remainingDays : 0;
  const isBalanceExceeded = calculatedDays > 0 && selectedBalance && calculatedDays > remainingDays;

  const validate = () => {
    const errs = {};

    if (!leaveTypeId) {
      errs.leaveTypeId = 'Please select a leave category';
    }
    if (!startDate) {
      errs.startDate = 'Start date is required';
    }
    if (!endDate) {
      errs.endDate = 'End date is required';
    }
    if (startDate && endDate) {
      if (startDate > endDate) {
        errs.endDate = 'End date cannot be earlier than start date';
      } else if (calculatedDays <= 0) {
        errs.endDate = 'Leave duration must be at least 1 day';
      }
    }
    if (isBalanceExceeded) {
      errs.endDate = `Insufficient balance. You requested ${calculatedDays} days but only have ${remainingDays} days available.`;
    }
    if (!reason?.trim()) {
      errs.reason = 'Reason for leave is required';
    } else if (reason.trim().length < 5) {
      errs.reason = 'Reason must be at least 5 characters';
    } else if (reason.trim().length > 1000) {
      errs.reason = 'Reason cannot exceed 1000 characters';
    }
    if (selectedLeaveType?.requiresAttachment) {
      if (!attachmentName?.trim()) {
        errs.attachment = `An attachment or supporting document is required for ${selectedLeaveType.name}`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      if (errors.attachment) {
        setErrors((prev) => ({ ...prev, attachment: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await leaveService.applyLeave({
        leaveTypeId: Number(leaveTypeId),
        startDate,
        endDate,
        reason: reason.trim(),
        attachmentName: attachmentName?.trim() || undefined,
      });

      showSuccess('Leave application submitted successfully! Status is PENDING review.');
      navigate('/employee/my-leaves');
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err.message || 'Failed to submit leave application.';
      setServerError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const leaveOptions = leaveTypes.map((t) => {
    const bal = balances.find((b) => b.leaveTypeId === t.id);
    const rem = bal ? bal.remainingDays : t.annualAllocation;
    return {
      value: String(t.id),
      label: `${t.name} (${rem} days available${t.requiresAttachment ? ' • Document Required' : ''})`,
    };
  });

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner text="Loading application form..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apply for Leave</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit a new time-off request with automated quota reservation.
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/employee/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {serverError && <ErrorAlert message={serverError} onClose={() => setServerError(null)} />}

      <Card>
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {/* Leave Type Select */}
          <Select
            label="Leave Category"
            value={leaveTypeId}
            onChange={(e) => {
              setLeaveTypeId(e.target.value);
              if (errors.leaveTypeId) setErrors((prev) => ({ ...prev, leaveTypeId: undefined }));
            }}
            options={leaveOptions}
            placeholder="Select leave category..."
            error={errors.leaveTypeId}
            required
          />

          {/* Selected Category Policy Hint */}
          {selectedLeaveType && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{selectedLeaveType.name} Policy</span>
                <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60 font-mono">
                  {remainingDays} days available
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedLeaveType.description || 'Standard corporate leave policy applies.'}
              </p>
              {selectedLeaveType.requiresAttachment && (
                <div className="flex items-center space-x-1.5 text-amber-800 font-medium pt-0.5">
                  <FileCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Official supporting documentation is strictly required for this leave category.</span>
                </div>
              )}
            </div>
          )}

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && e.target.value > endDate) {
                  setEndDate(e.target.value);
                }
                if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: undefined }));
              }}
              error={errors.startDate}
              required
            />

            <Input
              label="End Date"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: undefined }));
              }}
              error={errors.endDate}
              required
            />
          </div>

          {/* Live Duration Calculation Card */}
          {calculatedDays > 0 && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${
                isBalanceExceeded
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isBalanceExceeded ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                )}
                <div>
                  <span className="font-semibold block text-xs uppercase tracking-wider">
                    Requested Duration: <span className="font-mono font-bold text-sm normal-case">{calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}</span>
                  </span>
                  <span className="text-xs opacity-90 block mt-0.5">
                    {isBalanceExceeded
                      ? `Exceeds available quota (${remainingDays} days remaining)`
                      : `Within quota (${remainingDays - calculatedDays} days remaining after approval)`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reason Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Reason for Leave <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">{reason.length} / 1000</span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              className={`w-full text-sm rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 placeholder:text-slate-400 transition-colors ${
                errors.reason ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300 bg-white'
              }`}
              placeholder="Explain the context of your leave request (e.g. personal appointment, planned family travel, medical consultation)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
              }}
            />
            {errors.reason && <p className="text-xs text-rose-600 font-medium">{errors.reason}</p>}
          </div>

          {/* Attachment Input (Only if configured leave type requires it) */}
          {selectedLeaveType?.requiresAttachment && (
            <div className="space-y-2 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <label className="block text-xs font-semibold text-amber-950 tracking-wide uppercase">
                Supporting Attachment <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-600">
                Please attach or specify a doctor note, certificate, or official document name.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="inline-flex items-center px-3.5 py-2 border border-slate-300 rounded-lg shadow-xs text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <span>Choose Document</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                </label>
                <input
                  type="text"
                  placeholder="Or enter document filename / reference"
                  value={attachmentName}
                  onChange={(e) => {
                    setAttachmentName(e.target.value);
                    if (errors.attachment) setErrors((prev) => ({ ...prev, attachment: undefined }));
                  }}
                  className="flex-1 text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              {errors.attachment && (
                <p className="text-xs text-rose-600 font-medium">{errors.attachment}</p>
              )}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employee/dashboard')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={Send}
              disabled={submitting || isBalanceExceeded}
            >
              {submitting ? 'Submitting Application...' : 'Submit Leave Application'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplyLeavePage;
