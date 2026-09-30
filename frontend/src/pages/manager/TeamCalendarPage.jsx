import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { RefreshCw } from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../hooks/useToast';

const TeamCalendarPage = () => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const fetchTeamSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const params = { status: 'APPROVED' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const res = await leaveService.getTeamLeaves(params);
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || Array.isArray(data))) {
        setTeamLeaves(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load team leave schedule');
    } finally {
      setLoading(false);
    }
  }, [filterStartDate, filterEndDate, showError]);

  useEffect(() => {
    fetchTeamSchedule();
  }, [fetchTeamSchedule]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (row) => <span className="font-semibold text-slate-900">{row.employeeName}</span>,
    },
    { header: 'Leave Type', accessor: 'leaveTypeName' },
    {
      header: 'Start Date',
      accessor: 'startDate',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.startDate}</span>,
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.endDate}</span>,
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
      header: 'Manager Comment',
      accessor: 'managerComment',
      render: (row) => (
        <span className="text-xs text-slate-500 italic">
          {row.managerComment || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team Leave Calendar & Schedule</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track team availability, approved absences, and avoid project delivery conflicts.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={fetchTeamSchedule}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Date Filters Card */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Start Date From"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <Input
            label="End Date To"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="w-full"
              size="md"
              disabled={!filterStartDate && !filterEndDate}
              onClick={() => {
                setFilterStartDate('');
                setFilterEndDate('');
              }}
            >
              Reset Date Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Schedule Table */}
      <Card
        title="Approved Team Absences"
        subtitle={`Showing ${teamLeaves.length} scheduled leave entries`}
      >
        <Table
          columns={columns}
          data={teamLeaves}
          emptyTitle="No absences recorded"
          emptyDescription="No approved leaves match the selected date parameters."
        />
      </Card>
    </div>
  );
};

export default TeamCalendarPage;
