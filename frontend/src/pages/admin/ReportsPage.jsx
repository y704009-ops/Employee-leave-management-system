import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Download,
  Filter,
  BarChart3,
  Layers,
  Building2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { departmentService } from '../../services/departmentService';
import { leaveTypeService } from '../../services/leaveTypeService';
import { useToast } from '../../hooks/useToast';

const ReportsPage = () => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filter option lists
  const [departments, setDepartments] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Active filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [status, setStatus] = useState('');

  // Report response data
  const [report, setReport] = useState({
    countsByStatus: { TOTAL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 },
    totalAllocatedDays: 0,
    totalUsedDays: 0,
    utilizationPercentage: 0,
    leaveByDepartment: [],
    leaveByType: [],
    monthlyTrends: [],
    records: [],
  });

  // Load dropdown filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [deptRes, typeRes] = await Promise.all([
          departmentService.getAll(),
          leaveTypeService.getAll(),
        ]);
        const deptList = deptRes?.data?.data !== undefined ? deptRes.data.data : (deptRes?.data !== undefined ? deptRes.data : deptRes);
        if (Array.isArray(deptList)) setDepartments(deptList);
        
        const typeList = typeRes?.data?.data !== undefined ? typeRes.data.data : (typeRes?.data !== undefined ? typeRes.data : typeRes);
        if (Array.isArray(typeList)) setLeaveTypes(typeList);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch report data
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (departmentId) params.departmentId = departmentId;
      if (leaveTypeId) params.leaveTypeId = leaveTypeId;
      if (status) params.status = status;

      const res = await reportService.getSummary(params);
      const data = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (data && (res?.success || res?.data?.success || typeof data === 'object')) {
        setReport(data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch leave report summary');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, departmentId, leaveTypeId, status, showError]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setDepartmentId('');
    setLeaveTypeId('');
    setStatus('');
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (departmentId) params.departmentId = departmentId;
      if (leaveTypeId) params.leaveTypeId = leaveTypeId;
      if (status) params.status = status;

      const res = await reportService.exportCsv(params);
      const csvPayload = (res instanceof Blob) ? res : (res?.data !== undefined ? res.data : res);
      const blob = csvPayload instanceof Blob ? csvPayload : new Blob([csvPayload], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leave_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSuccess('CSV report downloaded successfully');
    } catch (err) {
      console.error('Failed to generate CSV export', err);
      showError('Failed to generate CSV export');
    } finally {
      setExporting(false);
    }
  };

  const statusCards = [
    {
      title: 'Total Requests',
      value: report.countsByStatus?.TOTAL || 0,
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    {
      title: 'Pending',
      value: report.countsByStatus?.PENDING || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    {
      title: 'Approved',
      value: report.countsByStatus?.APPROVED || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    },
    {
      title: 'Rejected',
      value: report.countsByStatus?.REJECTED || 0,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    },
    {
      title: 'Cancelled',
      value: report.countsByStatus?.CANCELLED || 0,
      icon: Ban,
      color: 'bg-slate-50 text-slate-700 border border-slate-200/60',
    },
  ];

  const maxDeptDays = Math.max(...(report.leaveByDepartment?.map((d) => d.days) || [1]), 1);
  const maxTypeDays = Math.max(...(report.leaveByType?.map((t) => t.days) || [1]), 1);
  const maxTrendDays = Math.max(
    ...(report.monthlyTrends?.map((m) => Math.max(m.approvedDays, m.pendingDays, m.totalRequests)) || [1]),
    1
  );

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
      header: 'Days',
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
      header: 'Applicant Reason',
      accessor: 'reason',
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs block" title={row.reason}>
          {row.reason}
        </span>
      ),
    },
    {
      header: 'Approver / Comment',
      accessor: 'managerComment',
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{row.approvedByName || '—'}</p>
          {row.managerComment && (
            <p className="text-slate-500 italic truncate max-w-xs mt-0.5">{row.managerComment}</p>
          )}
        </div>
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leave Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Generate filtered organizational leave summaries, track quota utilization, and export records.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchReport} disabled={loading}>
            Refresh
          </Button>
          <Button
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
            disabled={exporting || report.records?.length === 0}
          >
            {exporting ? 'Exporting...' : 'Export CSV Report'}
          </Button>
        </div>
      </div>

      {/* Filter Controls Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span>Filter Report Scope</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Department</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Leave Policy Type</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                value={leaveTypeId}
                onChange={(e) => setLeaveTypeId(e.target.value)}
              >
                <option value="">All Leave Types</option>
                {leaveTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Approval Status</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button size="xs" variant="ghost" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button size="xs" onClick={fetchReport} disabled={loading}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" text="Calculating report aggregations..." />
        </div>
      ) : (
        <>
          {/* Status Breakdown KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center space-x-3"
                >
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
                    <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Utilization Card & Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Leave Utilization" subtitle="Allocated vs used days for selected scope">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Utilization Rate:</span>
                  <span className="font-bold text-slate-900 font-mono">{report.utilizationPercentage}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(report.utilizationPercentage, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <p className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">Used Days</p>
                    <p className="text-xl font-bold text-emerald-950 font-mono mt-0.5">{report.totalUsedDays}</p>
                  </div>
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                    <p className="text-[11px] text-blue-800 font-semibold uppercase tracking-wider">Allocated Days</p>
                    <p className="text-xl font-bold text-blue-950 font-mono mt-0.5">{report.totalAllocatedDays}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Monthly Leave Volume"
              subtitle="Absences and request distribution over time"
              className="lg:col-span-2"
            >
              {report.monthlyTrends?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No monthly activity found for the selected filter parameters.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-end space-x-4 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm inline-block" />
                      <span>Approved Days</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm inline-block" />
                      <span>Pending Days</span>
                    </span>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {report.monthlyTrends.map((trend) => (
                      <div key={trend.month} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-700">
                          <span className="font-semibold">{trend.monthName}</span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {trend.approvedDays} approved / {trend.pendingDays} pending ({trend.totalRequests} reqs)
                          </span>
                        </div>
                        <div className="flex h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full"
                            style={{
                              width: `${(trend.approvedDays / maxTrendDays) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-amber-400 h-full"
                            style={{
                              width: `${(trend.pendingDays / maxTrendDays) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Department and Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Leave by Department"
              subtitle="Departmental request counts and day consumption"
            >
              {report.leaveByDepartment?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No departmental data in current filter scope.
                </div>
              ) : (
                <div className="space-y-3">
                  {report.leaveByDepartment.map((dept) => {
                    const pct = Math.round((dept.days / maxDeptDays) * 100);
                    return (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-700">
                          <span className="font-semibold flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dept.name}</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            <strong className="text-slate-900">{dept.days}</strong> days ({dept.count} reqs)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card
              title="Leave by Policy Type"
              subtitle="Breakdown of leave categories requested"
            >
              {report.leaveByType?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No policy categories found in current filter scope.
                </div>
              ) : (
                <div className="space-y-3">
                  {report.leaveByType.map((type) => {
                    const pct = Math.round((type.days / maxTypeDays) * 100);
                    return (
                      <div key={type.name} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-700">
                          <span className="font-semibold flex items-center space-x-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>{type.name}</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            <strong className="text-slate-900">{type.days}</strong> days ({type.count} reqs)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Granular Records Table */}
          <Card
            title="Matching Leave Application Records"
            subtitle={`Displaying ${report.records?.length || 0} application records`}
          >
            <Table
              columns={columns}
              data={report.records || []}
              emptyTitle="No matching leave requests"
              emptyDescription="No leave applications match the selected filter criteria."
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
