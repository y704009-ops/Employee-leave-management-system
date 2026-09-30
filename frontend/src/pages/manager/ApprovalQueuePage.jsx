import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { Check, X, Eye, FileText, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { leaveService } from '../../services/leaveService';

const ApprovalQueuePage = () => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);

  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReviewDetails, setSelectedReviewDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedForApprove, setSelectedForApprove] = useState(null);
  const [approveComment, setApproveComment] = useState('');
  const [submittingApprove, setSubmittingApprove] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedForReject, setSelectedForReject] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leaveService.getPendingLeaves();
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || Array.isArray(data))) {
        setQueue(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || err?.message || 'Failed to fetch pending approval queue');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleOpenReview = async (leave) => {
    try {
      setLoadingDetails(true);
      setDetailsModalOpen(true);
      setSelectedReviewDetails(null);
      const res = await leaveService.getReviewDetails(leave.id);
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || typeof data === 'object')) {
        setSelectedReviewDetails(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to retrieve detailed review context');
      setDetailsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenApproveModal = (leave) => {
    setSelectedForApprove(leave);
    setApproveComment('');
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedForApprove) return;
    try {
      setSubmittingApprove(true);
      const res = await leaveService.approveLeave(selectedForApprove.id, approveComment);
      if (res?.success || res?.data?.success) {
        showSuccess(`Approved leave request for ${selectedForApprove.employeeName}`);
        setApproveModalOpen(false);
        if (detailsModalOpen) setDetailsModalOpen(false);
        fetchQueue();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        showError(err.response?.data?.message || 'Request was already modified or resolved');
        fetchQueue();
        setApproveModalOpen(false);
      } else {
        showError(err.response?.data?.message || 'Failed to approve leave request');
      }
    } finally {
      setSubmittingApprove(false);
    }
  };

  const handleOpenRejectModal = (leave) => {
    setSelectedForReject(leave);
    setRejectComment('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedForReject) return;
    if (!rejectComment.trim() || rejectComment.trim().length < 3) {
      showError('A manager comment (min 3 characters) is strictly mandatory when rejecting');
      return;
    }
    try {
      setSubmittingReject(true);
      const res = await leaveService.rejectLeave(selectedForReject.id, rejectComment.trim());
      if (res?.success || res?.data?.success) {
        showSuccess(`Rejected request for ${selectedForReject.employeeName}`);
        setRejectModalOpen(false);
        if (detailsModalOpen) setDetailsModalOpen(false);
        fetchQueue();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        showError(err.response?.data?.message || 'Request state was already changed');
        fetchQueue();
        setRejectModalOpen(false);
      } else {
        showError(err.response?.data?.message || 'Failed to reject leave request');
      }
    } finally {
      setSubmittingReject(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (row) => <span className="font-semibold text-slate-900">{row.employeeName}</span>,
    },
    { header: 'Leave Type', accessor: 'leaveTypeName' },
    {
      header: 'Dates',
      accessor: 'dates',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.startDate} ~ {row.endDate}</span>,
    },
    {
      header: 'Duration',
      accessor: 'requestedDays',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 font-mono">
          {row.requestedDays} {row.requestedDays > 1 ? 'days' : 'day'}
        </span>
      ),
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs block" title={row.reason}>
          {row.reason}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <Button
            size="xs"
            variant="ghost"
            icon={Eye}
            onClick={() => handleOpenReview(row)}
            title="Inspect balance and previous leave history"
          >
            Review
          </Button>
          <Button
            size="xs"
            variant="primary"
            icon={Check}
            onClick={() => handleOpenApproveModal(row)}
          >
            Approve
          </Button>
          <Button
            size="xs"
            variant="danger"
            icon={X}
            onClick={() => handleOpenRejectModal(row)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manager Approval Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review and act on pending leave applications submitted by your direct team members.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={fetchQueue}
          disabled={loading}
        >
          Refresh Queue
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={queue}
          emptyTitle="Queue is clear"
          emptyDescription="There are currently no pending leave requests requiring manager review."
        />
      </Card>

      {/* 1. Review Details Context Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={
          selectedReviewDetails
            ? `Review Leave: ${selectedReviewDetails.leaveRequest.employeeName} (${selectedReviewDetails.leaveRequest.leaveTypeName})`
            : 'Loading Review Context...'
        }
        size="lg"
        footer={
          selectedReviewDetails && (
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" size="sm" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon={X}
                  onClick={() => {
                    handleOpenRejectModal(selectedReviewDetails.leaveRequest);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  onClick={() => {
                    handleOpenApproveModal(selectedReviewDetails.leaveRequest);
                  }}
                >
                  Approve
                </Button>
              </div>
            </div>
          )
        }
      >
        {loadingDetails ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Fetching employee quota and history details...
          </div>
        ) : selectedReviewDetails ? (
          <div className="space-y-5">
            {/* Request Summary Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Employee</p>
                <p className="text-slate-900 font-bold mt-1 text-sm">
                  {selectedReviewDetails.leaveRequest.employeeName}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Leave Type</p>
                <p className="text-slate-900 font-bold mt-1 text-sm">
                  {selectedReviewDetails.leaveRequest.leaveTypeName}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Dates</p>
                <p className="text-slate-900 font-mono mt-1 text-xs">
                  {selectedReviewDetails.leaveRequest.startDate} ~ {selectedReviewDetails.leaveRequest.endDate}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Duration</p>
                <p className="text-slate-900 font-bold mt-1 text-sm font-mono">
                  {selectedReviewDetails.leaveRequest.requestedDays} Days
                </p>
              </div>
            </div>

            {/* Applicant Reason & Attachment */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Applicant Reason
              </h4>
              <p className="text-sm bg-white p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                {selectedReviewDetails.leaveRequest.reason}
              </p>
              {selectedReviewDetails.leaveRequest.attachmentName && (
                <div className="flex items-center space-x-2 text-xs text-brand-700 bg-brand-50/70 p-2.5 rounded-lg border border-brand-100">
                  <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="font-medium">
                    Supporting Document: {selectedReviewDetails.leaveRequest.attachmentName}
                  </span>
                </div>
              )}
            </div>

            {/* Live Balance Breakdown */}
            {selectedReviewDetails.currentBalance && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Live Quota Balance (CY {selectedReviewDetails.currentBalance.year})
                </h4>
                <div className="grid grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-medium">Allocated</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                      {selectedReviewDetails.currentBalance.allocatedDays}d
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                    <p className="text-[11px] text-emerald-800 font-medium">Used</p>
                    <p className="text-base font-bold text-emerald-900 mt-0.5 font-mono">
                      {selectedReviewDetails.currentBalance.usedDays}d
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <p className="text-[11px] text-amber-800 font-medium">Reserved</p>
                    <p className="text-base font-bold text-amber-900 mt-0.5 font-mono">
                      {selectedReviewDetails.currentBalance.pendingDays}d
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                    <p className="text-[11px] text-blue-800 font-medium">Remaining</p>
                    <p className="text-base font-bold text-blue-900 mt-0.5 font-mono">
                      {selectedReviewDetails.currentBalance.remainingDays}d
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Requests Log */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Prior Leave History
              </h4>
              {selectedReviewDetails.employeeLeaveHistory?.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  No previous leave applications on record for this employee.
                </p>
              ) : (
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {selectedReviewDetails.employeeLeaveHistory.map((hist) => (
                    <div key={hist.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="font-semibold text-slate-800">{hist.leaveTypeName}</span>
                        <span className="text-slate-400 font-mono ml-2">
                          ({hist.startDate} ~ {hist.endDate}, {hist.requestedDays}d)
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {hist.reason}
                        </p>
                      </div>
                      <StatusBadge status={hist.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* 2. Approve Modal with Optional Comment */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title={`Approve Leave — ${selectedForApprove?.employeeName}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmApprove}
              disabled={submittingApprove}
            >
              {submittingApprove ? 'Approving...' : 'Confirm Approval'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>
              Approving will consume <strong className="font-mono">{selectedForApprove?.requestedDays} day(s)</strong> from{' '}
              <strong>{selectedForApprove?.employeeName}</strong>'s allocated quota transactionally.
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Manager Comment (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Approved. Please ensure all handover tasks are completed prior to departure."
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* 3. Reject Modal with Mandatory Comment */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Reject Leave — ${selectedForReject?.employeeName}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmReject}
              disabled={submittingReject}
            >
              {submittingReject ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>
              PRD Requirement: A manager comment explaining the rejection rationale is strictly mandatory.
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Rejection Reason / Comment <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Inadequate team coverage during scheduled release window. Please coordinate with alternate dates."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <p className="text-[11px] text-slate-400">Minimum 3 characters required.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalQueuePage;
