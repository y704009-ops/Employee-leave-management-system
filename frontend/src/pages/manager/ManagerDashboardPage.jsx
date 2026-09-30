import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { Users, CheckCircle2, Clock, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../hooks/useToast';

const ManagerDashboardPage = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingApprovalsCount: 0,
    teamMembersCount: 0,
    teamMembers: [],
    currentlyOnLeave: [],
    upcomingLeave: [],
    recentDecisions: [],
  });

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leaveService.getTeamDashboardStats();
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || typeof data === 'object')) {
        setStats(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load manager dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const metrics = [
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovalsCount,
      unit: 'Requests',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border border-amber-200/60',
      action: () => navigate('/manager/approval-queue'),
      actionText: 'Review Queue',
      alert: stats.pendingApprovalsCount > 0,
    },
    {
      title: 'Direct Reports',
      value: stats.teamMembersCount,
      unit: 'Members',
      icon: Users,
      color: 'text-brand-700 bg-brand-50 border border-brand-200/60',
      action: () => navigate('/manager/team-calendar'),
      actionText: 'View Schedule',
    },
    {
      title: 'Away Today',
      value: stats.currentlyOnLeave?.length || 0,
      unit: 'Members',
      icon: Calendar,
      color: 'text-sky-700 bg-sky-50 border border-sky-200/60',
    },
    {
      title: 'Upcoming Leaves',
      value: stats.upcomingLeave?.length || 0,
      unit: 'Scheduled',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60',
    },
  ];

  const onLeaveColumns = [
    { header: 'Employee', accessor: 'employeeName', render: (row) => <span className="font-semibold text-slate-900">{row.employeeName}</span> },
    { header: 'Leave Type', accessor: 'leaveTypeName' },
    {
      header: 'Dates',
      accessor: 'dates',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.startDate} to {row.endDate}</span>,
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
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const decisionColumns = [
    { header: 'Employee', accessor: 'employeeName', render: (row) => <span className="font-semibold text-slate-900">{row.employeeName}</span> },
    { header: 'Leave Type', accessor: 'leaveTypeName' },
    {
      header: 'Period',
      accessor: 'dates',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.startDate} ~ {row.endDate}</span>,
    },
    {
      header: 'Decision',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Manager Comment',
      accessor: 'managerComment',
      render: (row) => (
        <span className="text-xs text-slate-600 italic">
          {row.managerComment || 'No comment provided'}
        </span>
      ),
    },
    {
      header: 'Decided At',
      accessor: 'approvedAt',
      render: (row) => (
        <span className="text-xs font-mono text-slate-500">
          {row.approvedAt ? new Date(row.approvedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manager Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor assigned team members, time-off schedules, and review pending approval workflows.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchDashboardStats}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/manager/approval-queue')}
          >
            Approval Queue ({stats.pendingApprovalsCount})
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.title}</p>
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline space-x-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  {loading ? '—' : item.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
              </div>
              {item.action && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={item.action}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pending Banner CTA if pending requests exist */}
      {stats.pendingApprovalsCount > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 text-white rounded-lg shadow-xs flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-950">
                Action Required: {stats.pendingApprovalsCount} Pending Request{stats.pendingApprovalsCount > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Team members are waiting for your review and approval decision.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/manager/approval-queue')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Review Now
          </Button>
        </div>
      )}

      {/* Grid: On Leave Today & Upcoming Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Team Members On Leave Today"
          subtitle="Direct reports currently away"
        >
          <Table
            columns={onLeaveColumns}
            data={stats.currentlyOnLeave || []}
            emptyTitle="All team members active"
            emptyDescription="No team members are currently on leave today."
          />
        </Card>

        <Card
          title="Upcoming Team Leaves"
          subtitle="Scheduled absences in the coming days"
        >
          <Table
            columns={onLeaveColumns}
            data={stats.upcomingLeave || []}
            emptyTitle="No upcoming leaves scheduled"
            emptyDescription="Your team has full availability scheduled ahead."
          />
        </Card>
      </div>

      {/* Recent Decisions Audit */}
      <Card
        title="Recent Decision History"
        subtitle="Last approval decisions logged for your team"
      >
        <Table
          columns={decisionColumns}
          data={stats.recentDecisions || []}
          emptyTitle="No recent decisions"
          emptyDescription="Approval and rejection decisions made will appear here with audit timestamps."
        />
      </Card>
    </div>
  );
};

export default ManagerDashboardPage;
