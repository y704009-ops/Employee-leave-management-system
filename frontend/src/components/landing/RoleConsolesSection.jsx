import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Users,
  Shield,
  ArrowRight,
  Lock,
  Check,
  X,
  Clock,
  Activity,
  RotateCcw,
  FileText,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

// ============================================================================
// INITIAL SIMULATED DATA DEFINITIONS (GENERIC DEMO DATA ONLY — NO PII)
// ============================================================================

const ROLES = [
  {
    id: 'employee',
    roleTag: 'EMPLOYEE',
    shortLabel: 'EMPLOYEE',
    fullLabel: 'EMPLOYEE',
    badge: 'EMPLOYEE WORKSPACE',
    viewTitle: 'Employee Personal Leave & Quota Console',
    icon: User,
  },
  {
    id: 'manager',
    roleTag: 'MANAGER',
    shortLabel: 'MANAGER',
    fullLabel: 'MANAGER',
    badge: 'MANAGER TEAM GOVERNANCE CONSOLE',
    viewTitle: 'Team Absence Ledger & Approval Queue',
    icon: Users,
  },
  {
    id: 'admin',
    roleTag: 'ADMIN',
    shortLabel: 'ADMIN',
    fullLabel: 'ADMIN / HR',
    badge: 'ADMINISTRATION & HR CONSOLE',
    viewTitle: 'Global Statutory Policy & Audit Management',
    icon: Shield,
  },
];

const INITIAL_MANAGER_REQUESTS = [
  {
    id: 'req-emp-a',
    name: 'Employee A',
    role: 'Platform Eng',
    dept: 'Platform Engineering',
    dates: 'Dec 24 → Dec 29',
    duration: '5 days',
    type: 'Annual Leave',
    status: 'ACTION REQUIRED',
    coverageInfo: 'Platform Eng: 3 of 4 remaining active (75% coverage)',
    impact: 'Low',
    notes: 'Pre-scheduled annual entitlement leave. Secondary on-call coverage assigned.',
    quotaAvailable: '18.5 Days',
    quotaRemaining: '13.5 Days',
  },
  {
    id: 'req-emp-b',
    name: 'Employee B',
    role: 'DevOps',
    dept: 'DevOps & Infrastructure',
    dates: 'Nov 12 → Nov 14',
    duration: '3 days',
    type: 'Annual Leave',
    status: 'ACTION REQUIRED',
    coverageInfo: 'DevOps: 2 of 2 covered by secondary on-call rotation',
    impact: 'Low',
    notes: 'Mid-quarter personal leave. Automated CI/CD alerts routed to on-call secondary.',
    quotaAvailable: '14.0 Days',
    quotaRemaining: '11.0 Days',
  },
  {
    id: 'req-emp-c',
    name: 'Employee C',
    role: 'Frontend',
    dept: 'Frontend Core',
    dates: 'Nov 04',
    duration: '1 day',
    type: 'Sick Leave',
    status: 'APPROVED',
    coverageInfo: 'Frontend Core: 4 of 5 active',
    impact: 'Negligible',
    notes: 'Statutory sick leave with registered medical consultation receipt.',
    quotaAvailable: '10.0 Days',
    quotaRemaining: '9.0 Days',
  },
];

const INITIAL_EMPLOYEE_ACTIVITIES = [
  {
    id: 'emp-act-1',
    type: 'Annual Leave',
    dates: 'Dec 24 → Dec 29',
    duration: '5.0 Days',
    status: '● Pending Manager Review',
    statusBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    notes: 'Pre-scheduled annual entitlement leave. Secondary on-call coverage assigned.',
  },
  {
    id: 'emp-act-2',
    type: 'Statutory Sick Leave',
    dates: 'Oct 14',
    duration: '1.0 Day',
    status: '● Approved',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    notes: 'Medical consultation certificate submitted and validated.',
  },
  {
    id: 'emp-act-3',
    type: 'Casual Floating Leave',
    dates: 'Aug 18',
    duration: '1.0 Day',
    status: '● Approved',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    notes: 'Personal administrative appointment.',
  },
];

const INITIAL_WORKFORCE_OVERVIEW = [
  { dept: 'Platform Engineering', headcount: '72 (Demo)', status: '● Normal', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { dept: 'DevOps & Infrastructure', headcount: '54 (Demo)', status: '● Normal', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { dept: 'Frontend Core', headcount: '48 (Demo)', status: '● Moderate', statusColor: 'text-amber-700 bg-amber-50 border-amber-200' },
  { dept: 'Operations & HR', headcount: '12 (Demo)', status: '● Normal', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

const INITIAL_ACTIVITY_STREAM = [
  { id: 'act-1', time: '09:42', text: 'Leave policy check evaluated (Demo)' },
  { id: 'act-2', time: '09:37', text: 'Manager review protocol logged' },
  { id: 'act-3', time: '09:21', text: 'Team quorum recalculated' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RoleConsolesSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Role Switcher: Default to MANAGER
  const [selectedRoleId, setSelectedRoleId] = useState('manager');

  // Manager state (Read-Only Demo)
  const [managerRequests, setManagerRequests] = useState(INITIAL_MANAGER_REQUESTS);
  const [activeStaff] = useState(17);
  const [totalStaff] = useState(18);
  const [onLeaveCount] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Employee state (Read-Only Demo)
  const [employeeActivities, setEmployeeActivities] = useState(INITIAL_EMPLOYEE_ACTIVITIES);
  const [employeeBalance] = useState(18);
  const [employeePendingCount] = useState(1);

  // Admin / HR interactive state (Read-Only Demo)
  const [isAdminReportsOpen, setIsAdminReportsOpen] = useState(false);

  // Global activity strip
  const [activityFeed, setActivityFeed] = useState(INITIAL_ACTIVITY_STREAM);

  // Derived Manager Calculations
  const pendingApprovalsCount = managerRequests.filter((r) => r.status === 'ACTION REQUIRED').length;
  const quorum = Math.round((activeStaff / totalStaff) * 100);

  // Selected role object
  const currentRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[1];

  // Keyboard accessibility: Escape key closes any active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRequest(null);
        setIsAdminReportsOpen(false);
      }
    };
    if (selectedRequest || isAdminReportsOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRequest, isAdminReportsOpen]);

  // Command Center Role Preview listener
  useEffect(() => {
    const handleSwitchRoleEvent = (e) => {
      if (e.detail?.roleId) {
        setSelectedRoleId(e.detail.roleId);
      }
    };
    window.addEventListener('elms:switch-role', handleSwitchRoleEvent);
    return () => window.removeEventListener('elms:switch-role', handleSwitchRoleEvent);
  }, []);

  // Reset demo state back to default
  const handleResetPreview = () => {
    setManagerRequests(INITIAL_MANAGER_REQUESTS);
    setEmployeeActivities(INITIAL_EMPLOYEE_ACTIVITIES);
    setActivityFeed(INITIAL_ACTIVITY_STREAM);
    setSelectedRequest(null);
    setIsAdminReportsOpen(false);
  };

  return (
    <section
      id="product-experience"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-slate-50/70 relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Anchor for backward compatibility with #roles */}
      <div id="roles" className="absolute -top-20 pointer-events-none" aria-hidden="true" />

      {/* Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_65%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* ================================================================ */}
        {/* SECTION HEADER                                                   */}
        {/* ================================================================ */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12 transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
              <Layers className="w-4 h-4 text-brand-700" />
              <span>PRODUCT EXPERIENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              One workforce. Three connected perspectives.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Give employees, managers, and HR teams the tools they need to manage workforce operations from one connected workspace.
            </p>
          </div>

          {/* Badges: READ-ONLY DEMO PREVIEW • DEMO DATA • NO REAL EMPLOYEE INFORMATION */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              READ-ONLY DEMO PREVIEW
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              DEMO DATA • NO REAL EMPLOYEE INFORMATION
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ROLE SWITCHER SEGMENTED CONTROL                                  */}
        {/* ================================================================ */}
        <div
          className={`flex justify-center mb-6 sm:mb-8 transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div
            role="tablist"
            aria-label="Workforce Role Switcher"
            className="inline-flex w-full sm:w-auto p-1.5 bg-slate-200/70 rounded-xl border border-slate-300/70 shadow-2xs gap-1"
          >
            {ROLES.map((r) => {
              const isActive = selectedRoleId === r.id;
              const Icon = r.icon;

              return (
                <button
                  key={r.id}
                  role="button"
                  aria-label={r.shortLabel}
                  aria-pressed={isActive}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-brand-800 shadow-xs border border-slate-200/80 ring-2 ring-brand-500/15 translate-y-[-1px]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{r.fullLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* PRODUCT WORKSPACE FRAME                                          */}
        {/* ================================================================ */}
        <div
          className={`rounded-2xl bg-white border border-slate-200/90 shadow-md transition-all duration-500 ease-out overflow-hidden ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Top Frame Bar: ELMS Workspace & Live Operational Status */}
          <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 border border-brand-400 flex items-center justify-center font-mono font-bold text-xs text-white shadow-2xs">
                ELMS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    ELMS WORKSPACE
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 border border-slate-700 bg-slate-800/80 px-1.5 py-0.2 rounded">
                    v2.4
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 block">
                  {currentRole.badge}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-[10px]">
              {/* Live Operational Status */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/70 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">SYSTEM OPERATIONAL</span>
              </div>
              <span className="text-slate-500 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">DEMO MODE</span>
            </div>
          </div>

          {/* Subheader: Role Subtitle & Synchronized Indicator */}
          <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                {currentRole.viewTitle}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>DEMO DATA • READ-ONLY PREVIEW</span>
              </span>
            </div>

            <div className="font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span>Tenant: Example Organization (Demo)</span>
              <span>•</span>
              <span className="text-brand-700 font-semibold">Row-Level Isolated</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MAIN WORKSPACE CONTENT AREA                                    */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-6 lg:p-7 space-y-6">

            {/* ============================================================ */}
            {/* 1. EMPLOYEE VIEW                                             */}
            {/* ============================================================ */}
            {selectedRoleId === 'employee' && (
              <div className="space-y-6 animate-fadeIn duration-200">
                {/* Greeting & Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider block">
                      EMPLOYEE WORKSPACE • DEMO DATA
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Employee Self-Service (Demo Preview)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Illustrative employee leave balance tracking and scheduled absence timeline. (Read-only demo)
                    </p>
                  </div>

                  <Link
                    to="/login"
                    aria-label="Sign In to Apply"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-200" />
                    <span>SIGN IN TO APPLY</span>
                  </Link>
                </div>

                {/* Employee Key KPI Cards: Leave Balance / Pending Requests / Upcoming Leave */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Leave Balance */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                        Leave Balance
                      </span>
                      <span className="font-mono text-[9px] text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded font-semibold">
                        Available Annual
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                      {employeeBalance} days
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      18 days • 1.67d / mo accrual
                    </span>
                  </div>

                  {/* Card 2: Pending Requests */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                        Pending Requests
                      </span>
                      <span className="font-mono text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        DEMO
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-700 font-mono tracking-tight">
                      {employeePendingCount}
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      Under manager review
                    </span>
                  </div>

                  {/* Card 3: Upcoming Leave */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Upcoming Leave
                    </span>
                    <div className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                      Dec 24 → Dec 29
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600 block mt-1">
                      Annual Leave • 5.0 Days
                    </span>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                    <span>Recent Activity (Demo)</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {employeeActivities.map((act) => (
                      <div
                        key={act.id}
                        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {act.type}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {act.dates}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                            {act.duration} • {act.notes}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${act.statusBadge}`}>
                            {act.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 2. MANAGER VIEW (Default Active)                            */}
            {/* ============================================================ */}
            {selectedRoleId === 'manager' && (
              <div className="space-y-6 animate-fadeIn duration-200">
                {/* Header Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider block">
                      MANAGER TEAM GOVERNANCE
                    </span>
                    <span className="text-xs text-slate-500">
                      Team Absence Ledger & Approval Queue • Real-time staffing quorum validation
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    Department: Platform Engineering (Demo)
                  </span>
                </div>

                {/* 3 Interactive KPI Cards: Team Quorum / Pending Approvals / Team Active On Leave */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Team Quorum */}
                  <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs cursor-default">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                        CURRENT TEAM QUORUM
                      </span>
                      <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        {quorum >= 80 ? 'SAFE' : 'ATTENTION'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                      {quorum}% Safe
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                      <span>{activeStaff} of {totalStaff} staff active</span>
                      <span>•</span>
                      <span>{activeStaff} / {totalStaff} staff active</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-3">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${quorum}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 2: Pending Approvals */}
                  <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                        PENDING APPROVALS
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>QUEUE ACTIVE</span>
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-brand-700 font-mono tracking-tight">
                      {pendingApprovalsCount} {pendingApprovalsCount === 1 ? 'Request' : 'Requests'}
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      Pending Approvals: {pendingApprovalsCount}
                    </span>
                    <div className="w-full h-1.5 bg-brand-100/70 rounded-full overflow-hidden mt-3">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, pendingApprovalsCount * 50)}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 3: Team Active On Leave */}
                  <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                        TEAM ACTIVE ON LEAVE
                      </span>
                      <span className="font-mono text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded">
                        NOMINAL
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                      {onLeaveCount} {onLeaveCount === 1 ? 'Member' : 'Members'}
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      Team Active On Leave: {onLeaveCount}
                    </span>
                    <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-3">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.round((onLeaveCount / totalStaff) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Team Coverage Segmented Bar */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        TEAM COVERAGE
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {activeStaff} / {totalStaff} active
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Active ({activeStaff})</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span>On Leave ({onLeaveCount})</span>
                      </span>
                      {pendingApprovalsCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>Pending ({pendingApprovalsCount})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 h-3 sm:h-3.5 w-full">
                    {Array.from({ length: totalStaff }).map((_, i) => {
                      const isActive = i < activeStaff;
                      const isOnLeave = !isActive && i < activeStaff + onLeaveCount;
                      return (
                        <div
                          key={i}
                          title={`Staff #${i + 1}: ${isActive ? 'Active on Duty' : isOnLeave ? 'On Approved Leave' : 'Pending Request'}`}
                          className={`flex-1 h-full rounded-xs transition-colors duration-300 ${
                            isActive
                              ? 'bg-emerald-500'
                              : isOnLeave
                              ? 'bg-sky-500'
                              : 'bg-amber-400'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Centerpiece Approval Queue Table (Read-Only Preview) */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                    <span>APPROVAL QUEUE (READ-ONLY DEMO)</span>
                    <span>Status & Protocol</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {managerRequests.map((req) => {
                      const isActionRequired = req.status === 'ACTION REQUIRED';
                      const isApproved = req.status === 'APPROVED';

                      return (
                        <div
                          key={req.id}
                          className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {req.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                {req.dept}
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                              {req.dates} • {req.duration} • {req.type}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            {isActionRequired && (
                              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/90 px-2 py-0.5 rounded uppercase tracking-wider">
                                ACTION REQUIRED
                              </span>
                            )}
                            {isApproved && (
                              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>APPROVED</span>
                              </span>
                            )}

                            {isActionRequired && (
                              <button
                                type="button"
                                aria-label="Inspect Protocol"
                                onClick={() => setSelectedRequest(req)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                              >
                                <FileText className="w-3 h-3 text-brand-600" />
                                <span>INSPECT PROTOCOL →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 3. ADMIN / HR VIEW                                           */}
            {/* ============================================================ */}
            {selectedRoleId === 'admin' && (
              <div className="space-y-6 animate-fadeIn duration-200">
                {/* Header & Simulated Action Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider block">
                      ADMINISTRATION & HR CONSOLE
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Organization Overview (Demo Data)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Global Statutory Policy & Audit Management across all tenant departments.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAdminReportsOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>VIEW REPORTS →</span>
                  </button>
                </div>

                {/* Organization Overview 5 Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                      Active Employees
                    </span>
                    <div className="text-xl font-bold text-slate-900 font-mono">250+ (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-500">Global Headcount</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                      Departments
                    </span>
                    <div className="text-xl font-bold text-slate-900 font-mono">12 (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-500">Active Units</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                      Pending Reviews
                    </span>
                    <div className="text-xl font-bold text-brand-700 font-mono">7 (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-500">Across 4 divisions</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                      Policy Status
                    </span>
                    <div className="text-sm font-bold text-emerald-700 font-mono mt-1 flex items-center gap-1">
                      <span>● COMPLIANT</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">Statutory Policies</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                      Audit Events
                    </span>
                    <div className="text-xl font-bold text-emerald-700 font-mono">1,800+ (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-500">100% Sealed</span>
                  </div>
                </div>

                {/* Workforce Overview Table */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                    <span>WORKFORCE OVERVIEW (DEMO DATA)</span>
                    <span>Staffing Balance</span>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200/60">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Department</th>
                        <th className="px-4 py-2 font-semibold">Headcount</th>
                        <th className="px-4 py-2 font-semibold text-right">Leave Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {INITIAL_WORKFORCE_OVERVIEW.map((item) => (
                        <tr key={item.dept} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">{item.dept}</td>
                          <td className="px-4 py-3 text-slate-600">{item.headcount}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SHARED BOTTOM ACTIVITY STRIP                                 */}
            {/* ============================================================ */}
            <div className="pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-600" />
                    <span>SIMULATED ACTIVITY (DEMO)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPreview}
                    className="font-mono text-[9px] text-slate-500 hover:text-brand-700 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Reset interactive demo state"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Preview</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] text-slate-600">
                  {activityFeed.slice(0, 3).map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                      <span className="truncate text-slate-800 font-medium">{act.text}</span>
                      <span className="text-slate-400 shrink-0 ml-2">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Sign-In Prompt */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs text-slate-600">
              <span className="font-mono text-[10px] text-slate-500">
                Simulated interactive experience • No database records created or modified
              </span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 h-8 px-4 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs self-start sm:self-auto"
              >
                <Lock className="w-3 h-3 text-blue-200" />
                <span>Sign In to {currentRole.fullLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

        {/* ================================================================ */}
        {/* MODAL 1: MANAGER APPROVAL PROTOCOL INSPECTION (READ-ONLY DEMO)    */}
        {/* ================================================================ */}
        {selectedRequest && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn duration-200"
            onClick={() => setSelectedRequest(null)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-brand-700 uppercase tracking-wider font-semibold block">
                      REQUEST GOVERNANCE PROTOCOL PREVIEW
                    </span>
                    <h4 id="approval-modal-title" className="text-sm font-bold text-slate-900 leading-tight">
                      Leave Approval Protocol Inspection (Read-Only Demo)
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    EMPLOYEE
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.name}</span>
                  <span className="text-[10px] text-slate-500">{selectedRequest.dept}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    REQUEST TYPE
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.type}</span>
                  <span className="text-[10px] text-slate-500">{selectedRequest.duration}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    DATES
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.dates}</span>
                  <span className="text-[10px] text-slate-500">2025 Ledger Cycle</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    TEAM COVERAGE
                  </span>
                  <span className="font-bold text-emerald-700 block">{activeStaff} / {totalStaff} active</span>
                  <span className="text-[10px] text-slate-500">Quorum {quorum}% Safe</span>
                </div>
              </div>

              {/* Impact Card */}
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs mb-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-blue-900 font-bold mb-1">
                  <span>IMPACT ANALYSIS</span>
                  <span className="text-emerald-700">LOW IMPACT</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
                  {selectedRequest.coverageInfo}. Impact: {selectedRequest.impact}.
                </p>
              </div>

              {/* Read-Only Notice Box (Strictly no approve/reject decision controls) */}
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs mb-4 font-mono">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>READ-ONLY DEMO • DECISION CONTROLS RESTRICTED</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Approval and rejection authority is restricted to authenticated Line Managers inside the protected workspace. Visitors cannot perform operational actions on this demo preview.
                </p>
              </div>

              {/* Action Buttons: CLOSE ONLY */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-mono text-xs">
                <span className="text-[10px] text-slate-400">
                  DEMO DATA • NO REAL EMPLOYEE INFORMATION
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL 2: ADMIN / HR SIMULATED REPORTS MODAL                      */}
        {/* ================================================================ */}
        {isAdminReportsOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reports-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn duration-200"
            onClick={() => setIsAdminReportsOpen(false)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-brand-700 uppercase tracking-wider font-semibold block">
                      SIMULATED REPORT
                    </span>
                    <h4 id="reports-modal-title" className="text-sm font-bold text-slate-900 leading-tight">
                      Executive Workforce Analytics Digest (Demo)
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminReportsOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Report Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5 font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Leave Utilization
                  </span>
                  <div className="text-xl font-bold text-slate-900">72%</div>
                  <span className="text-[9px] text-slate-400">Within optimal threshold</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Policy Compliance
                  </span>
                  <div className="text-xl font-bold text-emerald-700">98%</div>
                  <span className="text-[9px] text-slate-400">Zero audit penalties</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Pending Reviews
                  </span>
                  <div className="text-xl font-bold text-brand-700">7 (DEMO)</div>
                  <span className="text-[9px] text-slate-400">Avg resolution 3.8 hrs</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Audit Events
                  </span>
                  <div className="text-xl font-bold text-emerald-700">1,800+ (DEMO)</div>
                  <span className="text-[9px] text-slate-400">SHA-256 ledger valid</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-mono mb-5">
                Clearly labeled: SIMULATED REPORT • No backend or database requests are dispatched.
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsAdminReportsOpen(false)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default RoleConsolesSection;
