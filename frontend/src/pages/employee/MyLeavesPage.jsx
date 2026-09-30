import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  XCircle,
  PlusCircle,
  RefreshCw,
  FileCheck,
  CheckCircle,
  X,
} from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { LEAVE_STATUS } from '../../utils/constants';

const MyLeavesPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Cancel modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await leaveService.getMyLeaves({
        status: statusFilter || undefined,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
      });
      setLeaves(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load your leave history.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleResetFilters = () => {
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const handleOpenCancel = (leave) => {
    setSelectedLeave(leave);
  };

  const handleConfirmCancel = async () => {
    if (!selectedLeave) return;
    try {
      setCancelling(true);
      setError(null);
      await leaveService.cancelLeave(selectedLeave.id);
      showSuccess(`Leave request for ${selectedLeave.leaveTypeName} cancelled successfully.`);
      setFeedback(`Leave request #${selectedLeave.id} has been cancelled.`);
      setSelectedLeave(null);
      fetchLeaves();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Failed to cancel leave request.';
      showError(msg);
      setError(msg);
    } finally {
      setCancelling(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveTypeName',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.leaveTypeName}</span>
          {row.attachmentName && (
            <span className="inline-flex items-center text-[11px] text-brand-700 mt-0.5">
              <FileCheck className="w-3 h-3 mr-1" />
              Attached
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      render: (row) => <span className="text-xs text-slate-700 font-mono">{row.startDate}</span>,
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (row) => <span className="text-xs text-slate-700 font-mono">{row.endDate}</span>,
    },
    {
      header: 'Duration',
      accessor: 'requestedDays',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 font-mono">
          {row.requestedDays} {row.requestedDays === 1 ? 'day' : 'days'}
        </span>
      ),
    },
    {
      header: 'Submitted On',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
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
      key: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <Button
            size="xs"
            variant="ghost"
            icon={Eye}
            onClick={() => navigate(`/employee/leave/${row.id}`)}
          >
            View
          </Button>
          {row.status === 'PENDING' && (
            <Button
              size="xs"
              variant="ghost"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              icon={XCircle}
              onClick={() => handleOpenCancel(row)}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Leave Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track past and active leave submissions, monitor review status, or cancel pending requests.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchLeaves}>
            Refresh
          </Button>
          <Button size="sm" icon={PlusCircle} onClick={() => navigate('/employee/apply-leave')}>
            Apply for Leave
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <Select
            label="Status Filter"
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: LEAVE_STATUS.PENDING, label: 'Pending Review' },
              { value: LEAVE_STATUS.APPROVED, label: 'Approved' },
              { value: LEAVE_STATUS.REJECTED, label: 'Rejected' },
              { value: LEAVE_STATUS.CANCELLED, label: 'Cancelled' },
            ]}
          />

          <Input
            label="Start Date From"
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />

          <Input
            label="End Date To"
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="w-full"
              size="md"
              onClick={handleResetFilters}
              disabled={!statusFilter && !startDateFilter && !endDateFilter}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Leaves History Table */}
      <Card>
        {loading && leaves.length === 0 ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={leaves}
            emptyTitle="No leave applications found"
            emptyDescription="You haven't submitted any leave requests matching the current criteria."
          />
        )}
      </Card>

      {/* CANCELLATION MODAL */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Confirm Leave Cancellation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedLeave(null)} disabled={cancelling}>
              Keep Request
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Application'}
            </Button>
          </>
        }
      >
        {selectedLeave && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700">
              Are you sure you want to cancel your <strong>{selectedLeave.leaveTypeName}</strong> application
              scheduled from <strong className="font-mono text-slate-800">{selectedLeave.startDate}</strong> to{' '}
              <strong className="font-mono text-slate-800">{selectedLeave.endDate}</strong>?
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-slate-800 font-mono">{selectedLeave.requestedDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-semibold text-amber-700">{selectedLeave.status}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Upon cancellation, the reserved days will immediately be returned to your active annual leave quota.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyLeavesPage;
