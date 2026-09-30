import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { RefreshCw, Search } from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../hooks/useToast';

const TeamHistoryPage = () => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTeamHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await leaveService.getTeamLeaves(params);
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || Array.isArray(data))) {
        setLeaves(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch team leave history');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showError]);

  useEffect(() => {
    fetchTeamHistory();
  }, [fetchTeamHistory]);

  const filteredLeaves = leaves.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.employeeName?.toLowerCase().includes(q) ||
      item.leaveTypeName?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q) ||
      item.managerComment?.toLowerCase().includes(q)
    );
  });

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
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Manager Comment / Note',
      accessor: 'managerComment',
      render: (row) => (
        <span className="text-xs text-slate-600 italic">
          {row.managerComment || '—'}
        </span>
      ),
    },
    {
      header: 'Approver',
      accessor: 'approvedByName',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.approvedByName || '—'}
        </span>
      ),
    },
    {
      header: 'Decision Date',
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team Leave History & Audit</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit log of all team leave applications, approval comments, and rejection rationales.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={fetchTeamHistory}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search by employee, leave type, reason, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </Card>

      <Card
        title="Leave Records"
        subtitle={`Showing ${filteredLeaves.length} matching entries`}
      >
        <Table
          columns={columns}
          data={filteredLeaves}
          emptyTitle="No records found"
          emptyDescription="No leave request records match the specified filters."
        />
      </Card>
    </div>
  );
};

export default TeamHistoryPage;
