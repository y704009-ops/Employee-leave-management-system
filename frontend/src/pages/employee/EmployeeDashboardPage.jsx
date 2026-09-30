import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  XCircle,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { balanceService } from '../../services/balanceService';
import { leaveService } from '../../services/leaveService';

const currentYear = new Date().getFullYear();
const todayDateStr = new Date().toISOString().split('T')[0];

const EmployeeDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [balances, setBalances] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Cancellation modal
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const [balRes, leavesRes] = await Promise.all([
        balanceService.getByEmployeeId(user.id),
        leaveService.getMyLeaves(),
      ]);
      setBalances(balRes.data || []);
      setRecentLeaves(leavesRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCancel = (leave) => {
    setCancelTarget(leave);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      setError(null);
      await leaveService.cancelLeave(cancelTarget.id);
      setFeedback('Leave request cancelled successfully. Reserved days have been released.');
      setCancelTarget(null);
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to cancel leave request.');
    } finally {
      setCancelling(false);
    }
  };

  // Find any upcoming approved leave (starts on or after today)
  const upcomingLeave = useMemo(() => {
    return recentLeaves.find(
      (l) => l.status === 'APPROVED' && l.startDate >= todayDateStr
    );
  }, [recentLeaves]);

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveTypeName',
      render: (row) => (
        <span className="font-semibold text-slate-900">{row.leaveTypeName}</span>
      ),
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      render: (row) => <span className="text-sm text-slate-700 font-mono text-xs">{row.startDate}</span>,
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (row) => <span className="text-sm text-slate-700 font-mono text-xs">{row.endDate}</span>,
    },
    {
      header: 'Duration',
      accessor: 'requestedDays',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
          {row.requestedDays} {row.requestedDays === 1 ? 'day' : 'days'}
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
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Employee'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200/60">
              {user?.departmentName || 'General Staff'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track your leave entitlements, check application progress, and manage scheduled time off.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-emerald-600 hover:text-emerald-800 text-base leading-none p-1"
          >
            ×
          </button>
        </div>
      )}

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Upcoming Approved Leave Notice Banner */}
      {upcomingLeave && (
        <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-600 text-white rounded-lg shadow-xs flex-shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brand-950 flex items-center gap-1.5">
                <span>Upcoming Approved Leave: {upcomingLeave.leaveTypeName}</span>
              </h4>
              <p className="text-xs text-brand-700/90 mt-0.5">
                Scheduled from {upcomingLeave.startDate} to {upcomingLeave.endDate} ({upcomingLeave.requestedDays} {upcomingLeave.requestedDays === 1 ? 'day' : 'days'})
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/employee/leave/${upcomingLeave.id}`)}
          >
            View Details
          </Button>
        </div>
      )}

      {/* Leave Balance Quotas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Leave Entitlements & Balances
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available = Allocated − Used − Reserved (Pending)
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            CY {currentYear}
          </span>
        </div>

        {loading && balances.length === 0 ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : balances.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-500 text-center py-6">
              No leave quotas found. Contact your administrator to initialize your annual leave allocation.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((b) => {
              const allocated = b.allocatedDays;
              const used = b.usedDays;
              const pending = b.pendingDays || 0;
              const remaining = b.remainingDays;

              const remainingPercent = allocated > 0 ? Math.round((remaining / allocated) * 100) : 0;

              return (
                <div
                  key={b.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                        {b.leaveTypeName}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">CY {b.year}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                        {remaining}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-medium uppercase tracking-wider">
                        Days Available
                      </span>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3.5">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, remainingPercent)}%` }}
                    />
                  </div>

                  {/* Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[11px] text-slate-500 block font-medium">Allocated</span>
                      <span className="font-semibold text-slate-800 font-mono mt-0.5 block">{allocated}d</span>
                    </div>
                    <div className="p-2 bg-amber-50/60 border border-amber-100/80 rounded-lg">
                      <span className="text-[11px] text-amber-700 block font-medium">Used</span>
                      <span className="font-semibold text-amber-900 font-mono mt-0.5 block">{used}d</span>
                    </div>
                    <div className="p-2 bg-indigo-50/60 border border-indigo-100/80 rounded-lg">
                      <span className="text-[11px] text-indigo-700 block font-medium">Pending</span>
                      <span className="font-semibold text-indigo-900 font-mono mt-0.5 block">{pending}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Leave Requests */}
      <Card
        title="Recent Leave Requests"
        subtitle="Your submitted leave applications and current approval statuses"
      >
        {loading && recentLeaves.length === 0 ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={recentLeaves.slice(0, 5)}
            emptyTitle="No leave applications yet"
            emptyDescription="You haven't submitted any leave requests yet. Click 'Apply for Leave' to get started."
          />
        )}
        {recentLeaves.length > 5 && (
          <div className="pt-3.5 border-t border-slate-100 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/employee/my-leaves')}
            >
              View Full History ({recentLeaves.length} total)
            </Button>
          </div>
        )}
      </Card>

      {/* CANCELLATION CONFIRMATION MODAL */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Leave Request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelTarget(null)} disabled={cancelling}>
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
        {cancelTarget && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Are you sure you want to cancel your <strong>{cancelTarget.leaveTypeName}</strong> request from{' '}
              <strong className="font-mono text-slate-800">{cancelTarget.startDate}</strong> to{' '}
              <strong className="font-mono text-slate-800">{cancelTarget.endDate}</strong> ({cancelTarget.requestedDays} days)?
            </p>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
              This request will be marked as <strong>CANCELLED</strong> and the{' '}
              <strong>{cancelTarget.requestedDays} reserved days</strong> will be returned to your available leave balance immediately.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeDashboardPage;
