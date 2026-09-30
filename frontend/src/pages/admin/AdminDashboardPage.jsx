import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  TrendingUp,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Scale,
  FileSpreadsheet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { useToast } from '../../hooks/useToast';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalActiveEmployees: 0,
    totalDepartments: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    cancelledRequests: 0,
    totalAllocatedDays: 0,
    totalUsedDays: 0,
    utilizationPercentage: 0,
    leaveByType: [],
    leaveByDepartment: [],
    monthlyTrends: [],
  });

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportService.getAdminDashboard();
      const payload = res?.data?.data !== undefined ? res.data.data : res?.data;
      if (payload && (res?.success || res?.data?.success || typeof payload === 'object')) {
        setData(payload);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load admin dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const kpis = [
    {
      title: 'Active Employees',
      value: data.totalActiveEmployees,
      subtext: 'Registered workforce',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      path: '/admin/employees',
    },
    {
      title: 'Departments',
      value: data.totalDepartments,
      subtext: 'Operating teams',
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
      path: '/admin/departments',
    },
    {
      title: 'Leave Utilization',
      value: `${data.utilizationPercentage}%`,
      subtext: `${data.totalUsedDays} used of ${data.totalAllocatedDays} allocated`,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      path: '/admin/reports',
    },
    {
      title: 'Pending Requests',
      value: data.pendingRequests,
      subtext: 'Awaiting manager action',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      path: '/admin/reports',
    },
    {
      title: 'Approved Leaves',
      value: data.approvedRequests,
      subtext: 'Successfully granted',
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      path: '/admin/reports',
    },
    {
      title: 'Rejected Requests',
      value: data.rejectedRequests,
      subtext: 'Declined with rationale',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      path: '/admin/reports',
    },
    {
      title: 'Cancelled Leaves',
      value: data.cancelledRequests,
      subtext: 'Revoked by applicants',
      icon: Ban,
      color: 'bg-slate-50 text-slate-700 border border-slate-200/60',
      path: '/admin/reports',
    },
  ];

  // Maximum days for progress scaling
  const maxDeptDays = Math.max(...data.leaveByDepartment.map((d) => d.days), 1);
  const maxTypeDays = Math.max(...data.leaveByType.map((t) => t.days), 1);
  const maxTrendDays = Math.max(
    ...data.monthlyTrends.map((m) => Math.max(m.approvedDays, m.pendingDays, m.totalRequests)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organization-wide leave management overview, utilization metrics, and departmental trends.
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
          <Button size="sm" icon={FileSpreadsheet} onClick={() => navigate('/admin/reports')}>
            View Reports & Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" text="Loading organizational metrics..." />
        </div>
      ) : (
        <>
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.title}
                  className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                    <div className={`p-2 rounded-lg ${kpi.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{kpi.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{kpi.subtext}</p>
                  </div>
                  {kpi.path && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => navigate(kpi.path)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Utilization & Monthly Trends Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Utilization Card */}
            <Card title="Company Leave Utilization" subtitle="Current calendar year quota consumption">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Quota Consumed:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {data.totalUsedDays} / {data.totalAllocatedDays} Days
                  </span>
                </div>

                {/* Main Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(data.utilizationPercentage, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Used Days</p>
                    <p className="text-xl font-bold text-emerald-950 font-mono mt-0.5">{data.totalUsedDays}</p>
                  </div>
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                    <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Remaining Pool</p>
                    <p className="text-xl font-bold text-blue-950 font-mono mt-0.5">
                      {Math.max(data.totalAllocatedDays - data.totalUsedDays, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly Leave Activity Chart */}
            <Card
              title="Monthly Trends"
              subtitle="Absences and request volume across months"
              className="lg:col-span-2"
            >
              {data.monthlyTrends.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No monthly activity on record yet.
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

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {data.monthlyTrends.map((trend) => (
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
                            title={`Approved: ${trend.approvedDays} days`}
                          />
                          <div
                            className="bg-amber-400 h-full"
                            style={{
                              width: `${(trend.pendingDays / maxTrendDays) * 100}%`,
                            }}
                            title={`Pending: ${trend.pendingDays} days`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Department and Leave Type Breakdown Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Department */}
            <Card
              title="Leave by Department"
              subtitle="Requested days and application volume by team"
            >
              {data.leaveByDepartment.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No departmental records available.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.leaveByDepartment.map((dept) => {
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

            {/* By Leave Type */}
            <Card
              title="Leave by Policy Type"
              subtitle="Utilization distribution across leave categories"
            >
              {data.leaveByType.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No policy usage recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.leaveByType.map((type) => {
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

          {/* Quick Admin Actions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Administration Shortlinks
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/admin/employees')}
                className="p-3.5 text-left bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/70"
              >
                <Users className="w-4 h-4 text-blue-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-900">Employees</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Manage workforce</p>
              </button>

              <button
                onClick={() => navigate('/admin/departments')}
                className="p-3.5 text-left bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/70"
              >
                <Building2 className="w-4 h-4 text-indigo-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-900">Departments</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Configure divisions</p>
              </button>

              <button
                onClick={() => navigate('/admin/leave-types')}
                className="p-3.5 text-left bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/70"
              >
                <Sliders className="w-4 h-4 text-purple-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-900">Leave Policies</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Quota rules</p>
              </button>

              <button
                onClick={() => navigate('/admin/leave-balances')}
                className="p-3.5 text-left bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/70"
              >
                <Scale className="w-4 h-4 text-amber-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-900">Balance Adjust</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Manual overrides</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
