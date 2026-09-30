import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Modal from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import {
  ArrowLeft,
  Clock,
  FileCheck,
  XCircle,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { leaveService } from '../../services/leaveService';

const LeaveDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchLeaveDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await leaveService.getById(id);
      setLeave(res.data);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load leave details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLeaveDetails();
  }, [fetchLeaveDetails]);

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await leaveService.cancelLeave(id);
      showSuccess('Leave application cancelled successfully.');
      setIsCancelModalOpen(false);
      fetchLeaveDetails();
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Failed to cancel leave request.';
      showError(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !leave) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/employee/my-leaves')}>
          Back to My Leaves
        </Button>
        <ErrorAlert message={error || 'Leave request not found.'} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/employee/my-leaves')}>
          Back to My Leaves
        </Button>
        <div className="flex items-center space-x-3">
          <StatusBadge status={leave.status} />
          {leave.status === 'PENDING' && (
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              icon={XCircle}
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Request
            </Button>
          )}
        </div>
      </div>

      <Card
        title={`Leave Application #${leave.id}`}
        subtitle={`Submitted on ${leave.createdAt ? new Date(leave.createdAt).toLocaleString() : 'N/A'}`}
      >
        <div className="space-y-6">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-sm">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Leave Type
              </span>
              <p className="font-semibold text-slate-900 mt-1">{leave.leaveTypeName}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Duration
              </span>
              <p className="font-semibold text-slate-900 mt-1 font-mono">
                {leave.requestedDays} {leave.requestedDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Start Date
              </span>
              <p className="font-medium text-slate-800 mt-1 font-mono text-xs">{leave.startDate}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                End Date
              </span>
              <p className="font-medium text-slate-800 mt-1 font-mono text-xs">{leave.endDate}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Applicant Reason
            </h4>
            <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
              {leave.reason}
            </div>
          </div>

          {/* Attachment */}
          {leave.attachmentName && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Supporting Documentation
              </h4>
              <div className="p-3 bg-brand-50/60 rounded-lg border border-brand-100 flex items-center space-x-2.5 text-sm text-brand-900">
                <FileCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="font-medium">{leave.attachmentName}</span>
              </div>
            </div>
          )}

          {/* Manager Comment & Review Status */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Review Status & Notes
            </h4>
            <div
              className={`p-4 rounded-xl border text-sm space-y-2.5 ${
                leave.status === 'APPROVED'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : leave.status === 'REJECTED'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : leave.status === 'CANCELLED'
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center space-x-2 font-semibold">
                {leave.status === 'APPROVED' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                {leave.status === 'REJECTED' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                {leave.status === 'CANCELLED' && <XCircle className="w-4 h-4 text-slate-500" />}
                {leave.status === 'PENDING' && <Clock className="w-4 h-4 text-amber-600" />}
                <span>Status: {leave.status}</span>
              </div>

              {leave.managerComment ? (
                <p className="text-xs bg-white/80 p-3 rounded-lg border border-current/10">
                  <span className="font-semibold block mb-1">Manager Note:</span>
                  {leave.managerComment}
                </p>
              ) : leave.status === 'PENDING' ? (
                <p className="text-xs opacity-80">
                  This request is queued for review by your designated reporting manager.
                </p>
              ) : null}

              {leave.approvedByName && (
                <p className="text-xs opacity-80">
                  Reviewed by: <strong>{leave.approvedByName}</strong>
                  {leave.approvedAt && ` on ${new Date(leave.approvedAt).toLocaleString()}`}
                </p>
              )}
            </div>
          </div>

          {/* Timestamps audit */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
            <span>Created: {leave.createdAt ? new Date(leave.createdAt).toLocaleString() : 'N/A'}</span>
            <span>Last Updated: {leave.updatedAt ? new Date(leave.updatedAt).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      </Card>

      {/* CANCELLATION MODAL */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Confirm Cancellation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)} disabled={cancelling}>
              Keep Request
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Are you sure you want to cancel this leave application?
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            The status will be updated to <strong>CANCELLED</strong> and all{' '}
            <strong className="font-mono">{leave.requestedDays} reserved days</strong> will be returned to your leave quota balance.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveDetailsPage;
