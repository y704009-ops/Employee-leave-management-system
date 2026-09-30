import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  RefreshCw,
  Search,
  Edit3,
  CheckCircle,
  X,
} from 'lucide-react';
import { balanceService } from '../../services/balanceService';
import { leaveTypeService } from '../../services/leaveTypeService';

const currentYear = new Date().getFullYear();

const BalanceManagementPage = () => {
  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Adjust modal state
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [targetBalance, setTargetBalance] = useState(null);
  const [adjustData, setAdjustData] = useState({
    allocatedDays: 0,
    usedDays: 0,
    reason: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [balRes, typeRes] = await Promise.all([
        balanceService.getAll(selectedYear),
        leaveTypeService.getAll(),
      ]);
      setBalances(balRes.data || []);
      setLeaveTypes(typeRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load leave balances.');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredBalances = useMemo(() => {
    return balances.filter((b) => {
      const matchesSearch =
        !searchQuery ||
        (b.employeeName && b.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.employeeId && String(b.employeeId).includes(searchQuery));
      const matchesType = !selectedLeaveType || String(b.leaveTypeId) === String(selectedLeaveType);
      return matchesSearch && matchesType;
    });
  }, [balances, searchQuery, selectedLeaveType]);

  const handleOpenAdjust = (balance) => {
    setTargetBalance(balance);
    setAdjustData({
      allocatedDays: balance.allocatedDays,
      usedDays: balance.usedDays,
      reason: '',
    });
    setFormErrors({});
    setIsAdjustOpen(true);
  };

  const validateAdjust = () => {
    const errs = {};
    const alloc = Number(adjustData.allocatedDays);
    const used = Number(adjustData.usedDays);

    if (alloc < 0) {
      errs.allocatedDays = 'Allocated days cannot be negative';
    }
    if (used < 0) {
      errs.usedDays = 'Used days cannot be negative';
    }
    if (used > alloc) {
      errs.usedDays = 'Used days cannot exceed allocated days';
    }
    if (!adjustData.reason?.trim()) {
      errs.reason = 'An adjustment reason is required for audit history';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!validateAdjust()) return;

    try {
      setSubmitting(true);
      setError(null);
      await balanceService.adjust(targetBalance.id, {
        allocatedDays: Number(adjustData.allocatedDays),
        usedDays: Number(adjustData.usedDays),
        reason: adjustData.reason.trim(),
      });
      setIsAdjustOpen(false);
      setFeedback(
        `Leave balance for ${targetBalance.employeeName} (${targetBalance.leaveTypeName}) updated successfully.`
      );
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to adjust balance.');
    } finally {
      setSubmitting(false);
    }
  };

  const computedRemaining = Math.max(
    0,
    Number(adjustData.allocatedDays || 0) - Number(adjustData.usedDays || 0)
  );

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.employeeName}</div>
          <div className="text-xs text-slate-400 font-mono">EMP-{row.employeeId}</div>
        </div>
      ),
    },
    {
      header: 'Leave Type',
      accessor: 'leaveTypeName',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
          {row.leaveTypeName}
        </span>
      ),
    },
    {
      header: 'Allocated',
      accessor: 'allocatedDays',
      render: (row) => <span className="font-medium text-slate-700 font-mono text-xs">{row.allocatedDays}d</span>,
    },
    {
      header: 'Used',
      accessor: 'usedDays',
      render: (row) => (
        <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 font-mono text-xs">
          {row.usedDays}d
        </span>
      ),
    },
    {
      header: 'Remaining',
      accessor: 'remainingDays',
      render: (row) => {
        const remaining = row.remainingDays;
        const color =
          remaining === 0
            ? 'bg-rose-50 text-rose-800 border-rose-200/80'
            : remaining <= 3
            ? 'bg-amber-50 text-amber-800 border-amber-200/80'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border font-mono ${color}`}>
            {remaining}d
          </span>
        );
      },
    },
    {
      header: 'Year',
      accessor: 'year',
      render: (row) => <span className="text-xs font-semibold text-slate-400 font-mono">{row.year}</span>,
    },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <Button
          variant="outline"
          size="xs"
          icon={Edit3}
          onClick={() => handleOpenAdjust(row)}
        >
          Adjust
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leave Balance Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View allocated and consumed quotas across all employees and manually adjust balances with audit tracking.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Filter Toolbar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search employee by name or ID..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            placeholder="All Leave Types"
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            options={[
              { value: '', label: 'All Leave Types' },
              ...leaveTypes.map((t) => ({ value: String(t.id), label: t.name })),
            ]}
          />

          <Select
            placeholder="Filter by Year"
            value={String(selectedYear)}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            options={[
              { value: String(currentYear + 1), label: `Year ${currentYear + 1}` },
              { value: String(currentYear), label: `Year ${currentYear} (Current)` },
              { value: String(currentYear - 1), label: `Year ${currentYear - 1}` },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading && balances.length === 0 ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredBalances}
            emptyTitle="No leave balances found"
            emptyDescription="No employee balance records found for the selected year and criteria."
          />
        )}
      </Card>

      {/* ADJUST BALANCE MODAL */}
      <Modal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        title={`Adjust Leave Balance: ${targetBalance?.employeeName || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAdjustOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAdjustSubmit} disabled={submitting}>
              {submitting ? 'Saving Adjustment...' : 'Confirm Adjustment'}
            </Button>
          </>
        }
      >
        {targetBalance && (
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Category & Year</span>
                <span className="font-semibold text-slate-800">
                  {targetBalance.leaveTypeName} ({targetBalance.year})
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Current Remaining</span>
                <span className="font-bold text-slate-900 font-mono">{targetBalance.remainingDays} days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Allocated Days"
                name="allocatedDays"
                type="number"
                min="0"
                required
                value={adjustData.allocatedDays}
                onChange={(e) => setAdjustData({ ...adjustData, allocatedDays: e.target.value })}
                error={formErrors.allocatedDays}
              />

              <Input
                label="Used Days"
                name="usedDays"
                type="number"
                min="0"
                required
                value={adjustData.usedDays}
                onChange={(e) => setAdjustData({ ...adjustData, usedDays: e.target.value })}
                error={formErrors.usedDays}
              />
            </div>

            {/* Calculated Preview */}
            <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-900 uppercase tracking-wide">
                New Remaining Balance
              </span>
              <span className="text-base font-bold text-brand-800 font-mono">
                {computedRemaining} Days
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Adjustment Reason / Audit Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="reason"
                rows={3}
                placeholder="Explain why this quota adjustment was made (e.g. Approved overtime compensation, HR error correction)"
                value={adjustData.reason}
                onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
              />
              {formErrors.reason && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.reason}</p>
              )}
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BalanceManagementPage;
