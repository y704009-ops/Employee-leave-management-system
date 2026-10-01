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
  Play,
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
    statusBadge: 'bg-amber-950/80 text-amber-300 border-amber-800',
    notes: 'Pre-scheduled annual entitlement leave. Secondary on-call coverage assigned.',
  },
  {
    id: 'emp-act-2',
    type: 'Statutory Sick Leave',
    dates: 'Oct 14',
    duration: '1.0 Day',
    status: '● Approved',
    statusBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    notes: 'Medical consultation certificate submitted and validated.',
  },
  {
    id: 'emp-act-3',
    type: 'Casual Floating Leave',
    dates: 'Aug 18',
    duration: '1.0 Day',
    status: '● Approved',
    statusBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    notes: 'Personal administrative appointment.',
  },
];

const INITIAL_WORKFORCE_OVERVIEW = [
  { dept: 'Platform Engineering', headcount: '72 (Demo)', status: '● Normal', statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
  { dept: 'DevOps & Infrastructure', headcount: '54 (Demo)', status: '● Normal', statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
  { dept: 'Frontend Core', headcount: '48 (Demo)', status: '● Moderate', statusColor: 'text-amber-300 bg-amber-950/80 border-amber-800' },
  { dept: 'Operations & HR', headcount: '12 (Demo)', status: '● Normal', statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' },
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
  const [isEmployeeFlowModalOpen, setIsEmployeeFlowModalOpen] = useState(false);

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
        setIsEmployeeFlowModalOpen(false);
      }
    };
    if (selectedRequest || isAdminReportsOpen || isEmployeeFlowModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRequest, isAdminReportsOpen, isEmployeeFlowModalOpen]);

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
    setIsEmployeeFlowModalOpen(false);
  };

  return (
    <section
      id="product-experience"
      ref={sectionRef}
      className="w-full py-20 sm:py-24 bg-[#030712] relative border-b border-slate-800/80 overflow-hidden text-slate-100"
    >
      {/* Anchor for backward compatibility with #roles */}
      <div id="roles" className="absolute -top-20 pointer-events-none" aria-hidden="true" />

      {/* 1. Subtle Architectural Grid Texture */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" />

      {/* 2. Ambient Atmospheric Lighting Glow */}
      <div className="absolute top-1/4 left-10 w-[35rem] h-[35rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[35rem] h-[35rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Responsive Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* ================================================================ */}
        {/* SECTION HEADER                                                   */}
        {/* ================================================================ */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xs mb-3.5 backdrop-blur-md">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                PRODUCT EXPERIENCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-[-0.03em] leading-[1.12]">
              One workforce. Three connected perspectives.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-normal">
              See how employees, managers, and HR teams interact with the same connected leave management system. Give employees, managers, and HR teams the tools they need to manage workforce operations from one connected workspace.
            </p>
          </div>

          {/* Badges: READ-ONLY DEMO PREVIEW • DEMO DATA • NO REAL EMPLOYEE INFORMATION */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sky-300 font-bold shadow-xs backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              INTERACTIVE PRODUCT PREVIEW
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 font-bold shadow-xs backdrop-blur-md">
              READ-ONLY DEMO PREVIEW
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-300 font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              DEMO DATA • NO REAL EMPLOYEE INFORMATION
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ROLE SWITCHER SEGMENTED CONTROL                                  */}
        {/* ================================================================ */}
        <div
          className={`flex justify-center mb-8 sm:mb-10 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div
            role="tablist"
            aria-label="Workforce Role Switcher"
            className="inline-flex w-full sm:w-auto p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800/90 shadow-xl backdrop-blur-xl gap-1.5"
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
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-900/40 border border-sky-400/40 ring-1 ring-sky-400/30 -translate-y-0.5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
          className={`rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out overflow-hidden relative ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Decorative Window Controls & Top Frame Bar */}
          <div className="px-5 sm:px-7 py-3.5 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/90">
            <div className="flex items-center gap-3">
              {/* Decorative Window Control Dots */}
              <div className="flex items-center gap-1.5 mr-1 pointer-events-none" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="w-7 h-7 rounded-lg bg-sky-600 border border-sky-400/50 flex items-center justify-center font-mono font-bold text-xs text-white shadow-xs">
                ELMS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    ELMS WORKSPACE
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 border border-slate-800 bg-slate-900 px-1.5 py-0.2 rounded">
                    ● PRODUCT PREVIEW
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 block">
                  {currentRole.badge}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-[10px]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/70 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">SYSTEM OPERATIONAL</span>
              </div>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-sky-300 font-semibold hidden md:inline">SIMULATED DATA</span>
            </div>
          </div>

          {/* Subheader Bar */}
          <div className="px-5 sm:px-7 py-2.5 bg-slate-950/60 border-b border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                {currentRole.viewTitle}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>DEMO DATA • READ-ONLY PREVIEW</span>
              </span>
            </div>

            <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
              <span>DEMO WORKSPACE</span>
              <span>•</span>
              <span className="text-sky-400 font-semibold">Row-Level Isolated</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MAIN WORKSPACE CONTENT AREA                                    */}
          {/* ============================================================== */}
          <div className="p-5 sm:p-7 space-y-6">

            {/* ============================================================ */}
            {/* 1. EMPLOYEE VIEW                                             */}
            {/* ============================================================ */}
            {selectedRoleId === 'employee' && (
              <div className="space-y-6 animate-fadeIn duration-200">
                {/* Greeting & Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider block">
                        EMPLOYEE WORKSPACE • DEMO DATA
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                        DEMO USER
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      Employee Self-Service (Demo Preview)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Illustrative employee leave balance tracking and scheduled absence timeline. (Read-only demo)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsEmployeeFlowModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-sky-300 text-xs font-semibold border border-slate-700 shadow-xs transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                      <span>PREVIEW REQUEST FLOW</span>
                    </button>

                    <Link
                      to="/login"
                      aria-label="Sign In to Apply"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-sky-200" />
                      <span>SIGN IN TO APPLY</span>
                    </Link>
                  </div>
                </div>

                {/* Employee Key KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Card 1: LEAVE BALANCE */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                        LEAVE BALANCE
                      </span>
                      <span className="font-mono text-[9px] text-sky-300 bg-sky-950/80 border border-sky-800 px-1.5 py-0.2 rounded font-semibold">
                        Available Annual
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      {employeeBalance} days
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-1">
                      18 days • 1.67d / mo accrual
                    </span>
                  </div>

                  {/* Card 2: PENDING REQUESTS */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                        Pending Requests
                      </span>
                      <span className="font-mono text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-1.5 py-0.2 rounded">
                        DEMO
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-400 font-mono tracking-tight">
                      02
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-1">
                      Pending Requests ({employeePendingCount})
                    </span>
                  </div>

                  {/* Card 3: UPCOMING LEAVE */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      UPCOMING LEAVE
                    </span>
                    <div className="text-lg font-bold text-white font-mono tracking-tight">
                      DEC 24 → DEC 29
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 block mt-1">
                      Annual Leave • 5.0 Days
                    </span>
                  </div>

                  {/* Card 4: WORKFLOW STATUS */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      WORKFLOW STATUS
                    </span>
                    <div className="text-sm font-bold text-sky-400 font-mono tracking-tight mt-1">
                      1 REQUEST IN REVIEW
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-1">
                      Under manager review
                    </span>
                  </div>
                </div>

                {/* Read-Only Mini Timeline & Leave Activity */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800/80">
                    <span className="uppercase font-bold text-slate-200 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <span>WORKFLOW TIMELINE (READ-ONLY)</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">SIMULATED TIMELINE</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-semibold py-2">
                    <div className="flex items-center gap-2 text-sky-300">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>REQUEST SUBMITTED</span>
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-2 text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>MANAGER REVIEW</span>
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>RECORD & SYNC</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="rounded-xl border border-slate-800/90 overflow-hidden bg-slate-950/90 shadow-2xs">
                  <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    <span>Recent Activity (Demo)</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-800/80">
                    {employeeActivities.map((act) => (
                      <div
                        key={act.id}
                        className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {act.type}
                            </span>
                            <span className="font-mono text-[10px] text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {act.dates}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {act.duration} • {act.notes}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase ${act.statusBadge}`}>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-800/80">
                  <div>
                    <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider block">
                      MANAGER TEAM GOVERNANCE
                    </span>
                    <span className="text-xs text-slate-300 font-medium block mt-0.5">
                      Team Absence Ledger & Approval Queue • Real-time staffing quorum validation
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    DEMO WORKSPACE
                  </span>
                </div>

                {/* 3 Interactive KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Card 1: TEAM QUORUM */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide font-semibold block">
                        CURRENT TEAM QUORUM
                      </span>
                      <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
                        SAFE
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      94% Safe
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                      <span>17 of 18 staff active</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${quorum}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 2: REQUESTS IN REVIEW & PENDING APPROVALS */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide font-semibold block">
                        PENDING APPROVALS
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-sky-300 bg-sky-950/80 border border-sky-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>QUEUE ACTIVE</span>
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-sky-400 font-mono tracking-tight">
                      {pendingApprovalsCount} {pendingApprovalsCount === 1 ? 'Request' : 'Requests'}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-1">
                      Under manager review
                    </span>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800">
                      <div
                        className="h-full bg-sky-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, pendingApprovalsCount * 50)}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 3: ACTIVE LEAVE */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide font-semibold block">
                        TEAM ACTIVE ON LEAVE
                      </span>
                      <span className="font-mono text-[9px] font-bold text-sky-300 bg-sky-950/80 border border-sky-800 px-1.5 py-0.2 rounded">
                        NOMINAL
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      {onLeaveCount} {onLeaveCount === 1 ? 'Member' : 'Members'}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-1">
                      On approved leave
                    </span>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800">
                      <div
                        className="h-full bg-sky-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.round((onLeaveCount / totalStaff) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 4: ACTIVE STAFF */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide font-semibold block mb-1">
                      ACTIVE STAFF
                    </span>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      17 / 18
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 block mt-1">
                      17 / 18 active • 94% Coverage
                    </span>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800">
                      <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                {/* Team Coverage Segmented Bar */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                        TEAM COVERAGE
                      </span>
                      <span className="font-mono text-[10px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-2xs">
                        17 / 18 active
                      </span>
                      <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        AVAILABLE 94%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Active ({activeStaff})</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span>On Leave ({onLeaveCount})</span>
                      </span>
                      {pendingApprovalsCount > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>Pending ({pendingApprovalsCount})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 h-3.5 w-full">
                    {Array.from({ length: totalStaff }).map((_, i) => {
                      const isActive = i < activeStaff;
                      const isOnLeave = !isActive && i < activeStaff + onLeaveCount;
                      return (
                        <div
                          key={i}
                          title={`Staff #${i + 1}: ${isActive ? 'Active on Duty' : isOnLeave ? 'On Approved Leave' : 'Pending Request'}`}
                          className={`flex-1 h-full rounded-xs transition-colors duration-300 ${
                            isActive
                              ? 'bg-emerald-400'
                              : isOnLeave
                              ? 'bg-sky-400'
                              : 'bg-amber-400'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Coverage preview • Minimum operational quorum threshold: 75%</span>
                    <span className="text-sky-300 font-semibold">SIMULATED DATA</span>
                  </div>
                </div>

                {/* Centerpiece Approval Queue Table (Read-Only Preview) */}
                <div className="rounded-xl border border-slate-800/90 overflow-hidden bg-slate-950/90 shadow-2xs">
                  <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    <span>APPROVAL QUEUE (READ-ONLY DEMO)</span>
                    <span className="text-amber-400">MANAGER REVIEW REQUIRED</span>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {managerRequests.map((req) => {
                      const isActionRequired = req.status === 'ACTION REQUIRED';
                      const isApproved = req.status === 'APPROVED';

                      return (
                        <div
                          key={req.id}
                          className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {req.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                                {req.dept}
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                              {req.dates} • {req.duration} • {req.type}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                            {isActionRequired && (
                              <span className="font-mono text-[10px] font-bold text-sky-300 bg-sky-950/80 border border-sky-800/80 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                ACTION REQUIRED
                              </span>
                            )}
                            {isApproved && (
                              <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>APPROVED</span>
                              </span>
                            )}

                            {isActionRequired && (
                              <button
                                type="button"
                                aria-label="Inspect Protocol"
                                onClick={() => setSelectedRequest(req)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5 text-sky-400" />
                                <span>Inspect Protocol →</span>
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
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider block">
                        ADMINISTRATION & HR CONSOLE
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                        DEMO ORGANIZATION
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      Organization Overview (Demo Data)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Global Statutory Policy & Audit Management across all tenant departments.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAdminReportsOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>VIEW REPORTS →</span>
                  </button>
                </div>

                {/* Organization Overview 5 Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                      ACTIVE EMPLOYEES
                    </span>
                    <div className="text-xl font-bold text-white font-mono">250+ (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-400">Global Headcount</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                      DEPARTMENTS
                    </span>
                    <div className="text-xl font-bold text-white font-mono">12 (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-400">Active Units</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                      POLICY REVIEWS
                    </span>
                    <div className="text-xl font-bold text-sky-400 font-mono">7 (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-400">Across 4 divisions</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                      POLICY STATUS
                    </span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1">
                      <span>● COMPLIANT</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400">Statutory Policies</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 shadow-2xs col-span-2 sm:col-span-1">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                      AUDIT EVENTS
                    </span>
                    <div className="text-xl font-bold text-emerald-400 font-mono">1,800+ (DEMO)</div>
                    <span className="font-mono text-[9px] text-slate-400">Illustrative Demo</span>
                  </div>
                </div>

                {/* 3 Compact Admin Panels: Workforce Overview / Policy Overview / Operational Visibility */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Panel A: Workforce Overview */}
                  <div className="lg:col-span-6 rounded-xl border border-slate-800/90 overflow-hidden bg-slate-950/90 shadow-2xs">
                    <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
                      <span>WORKFORCE OVERVIEW (DEMO DATA)</span>
                      <span>Staffing Balance</span>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/60 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800/60">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Department</th>
                          <th className="px-4 py-2 font-semibold">Headcount</th>
                          <th className="px-4 py-2 font-semibold text-right">Leave Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                        {INITIAL_WORKFORCE_OVERVIEW.map((item) => (
                          <tr key={item.dept} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3 font-bold text-white">{item.dept}</td>
                            <td className="px-4 py-3 text-slate-300">{item.headcount}</td>
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

                  {/* Panel B: Policy Overview */}
                  <div className="lg:col-span-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3 text-[10px] font-mono font-bold">
                        <span className="text-slate-300 uppercase tracking-wider">POLICY OVERVIEW</span>
                        <span className="text-sky-400">ILLUSTRATIVE POLICY DATA</span>
                      </div>
                      <div className="space-y-2.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-200">Annual Leave</span>
                          <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded text-[9px]">
                            ACTIVE
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-200">Sick Leave</span>
                          <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded text-[9px]">
                            ACTIVE
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-200">Optional Leave</span>
                          <span className="text-amber-300 font-bold bg-amber-950/80 border border-amber-800 px-1.5 py-0.2 rounded text-[9px]">
                            REVIEW
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 mt-3 border-t border-slate-800/80 font-mono text-[9px] text-slate-400">
                      Illustrative Policy Data • Demo Rules
                    </div>
                  </div>

                  {/* Panel C: Operational Visibility */}
                  <div className="lg:col-span-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3 text-[10px] font-mono font-bold">
                        <span className="text-slate-300 uppercase tracking-wider">OPERATIONAL VISIBILITY</span>
                        <span className="text-emerald-400">SIMULATED ACTIVITY</span>
                      </div>
                      <div className="space-y-2 font-mono text-[10px]">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex justify-between">
                          <span>09:42 Policy config viewed</span>
                          <span className="text-slate-500">Audit Log</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex justify-between">
                          <span>09:38 Leave report generated</span>
                          <span className="text-slate-500">CSV Export</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex justify-between">
                          <span>09:31 Employee record reviewed</span>
                          <span className="text-slate-500">Directory</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 mt-3 border-t border-slate-800/80 font-mono text-[9px] text-slate-400">
                      Simulated Activity • Non-persistent Audit Demo
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SHARED BOTTOM ACTIVITY STRIP                                 */}
            {/* ============================================================ */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/70">
                  <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span>SIMULATED ACTIVITY (DEMO)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPreview}
                    className="font-mono text-[9px] text-slate-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Reset interactive demo state"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Preview</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] text-slate-300">
                  {activityFeed.slice(0, 3).map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-2xs">
                      <span className="truncate text-white font-medium">{act.text}</span>
                      <span className="text-slate-400 shrink-0 ml-2">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Sign-In Prompt */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs text-slate-400">
              <span className="font-mono text-[10px] text-slate-400">
                Simulated interactive experience • No database records created or modified
              </span>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 h-8 px-4 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-all shadow-xs self-start sm:self-auto border border-sky-400/30"
              >
                <Lock className="w-3 h-3 text-sky-200" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn duration-200"
            onClick={() => setSelectedRequest(null)}
          >
            <div
              className="bg-[#090e1a] border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-sky-400 uppercase tracking-wider font-bold block">
                      REQUEST GOVERNANCE PROTOCOL PREVIEW
                    </span>
                    <h4 id="approval-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                      Leave Approval Protocol Inspection (Read-Only Demo)
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    EMPLOYEE
                  </span>
                  <span className="font-bold text-white block">{selectedRequest.name}</span>
                  <span className="text-[10px] text-slate-400">{selectedRequest.dept}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    REQUEST TYPE
                  </span>
                  <span className="font-bold text-white block">{selectedRequest.type}</span>
                  <span className="text-[10px] text-slate-400">{selectedRequest.duration}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    DATES
                  </span>
                  <span className="font-bold text-white block">{selectedRequest.dates}</span>
                  <span className="text-[10px] text-slate-400">2025 Ledger Cycle</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    TEAM COVERAGE
                  </span>
                  <span className="font-bold text-emerald-400 block">{activeStaff} / {totalStaff} active</span>
                  <span className="text-[10px] text-slate-400">Quorum {quorum}% Safe</span>
                </div>
              </div>

              {/* Impact Card */}
              <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-800/80 text-xs mb-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-sky-300 font-bold mb-1">
                  <span>IMPACT ANALYSIS</span>
                  <span className="text-emerald-400">LOW IMPACT</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  {selectedRequest.coverageInfo}. Impact: {selectedRequest.impact}.
                </p>
              </div>

              {/* Read-Only Notice Box */}
              <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-800/80 text-xs mb-4 font-mono">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>READ-ONLY DEMO • DECISION CONTROLS RESTRICTED</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Approval and rejection authority is restricted to authenticated Line Managers inside the protected workspace. Visitors cannot perform operational actions on this demo preview.
                </p>
              </div>

              {/* Action Buttons: CLOSE ONLY */}
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-400">
                  DEMO DATA • NO REAL EMPLOYEE INFORMATION
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn duration-200"
            onClick={() => setIsAdminReportsOpen(false)}
          >
            <div
              className="bg-[#090e1a] border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-sky-400 uppercase tracking-wider font-bold block">
                      SIMULATED REPORT
                    </span>
                    <h4 id="reports-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                      Executive Workforce Analytics Digest (Demo)
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminReportsOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Report Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Leave Utilization
                  </span>
                  <div className="text-xl font-bold text-white">72%</div>
                  <span className="text-[9px] text-slate-400">Within optimal threshold</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Policy Compliance
                  </span>
                  <div className="text-xl font-bold text-emerald-400">98%</div>
                  <span className="text-[9px] text-slate-400">Zero audit penalties</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Pending Reviews
                  </span>
                  <div className="text-xl font-bold text-sky-400">7 (DEMO)</div>
                  <span className="text-[9px] text-slate-400">Avg resolution 3.8 hrs</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Audit Events
                  </span>
                  <div className="text-xl font-bold text-emerald-400">1,800+ (DEMO)</div>
                  <span className="text-[9px] text-slate-400">SHA-256 ledger valid</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-800/80 text-[11px] text-amber-300 font-mono mb-5">
                Clearly labeled: SIMULATED REPORT • No backend or database requests are dispatched.
              </div>

              <div className="flex items-center justify-end pt-3.5 border-t border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsAdminReportsOpen(false)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL 3: EMPLOYEE PREVIEW REQUEST FLOW MODAL                    */}
        {/* ================================================================ */}
        {isEmployeeFlowModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="flow-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn duration-200"
            onClick={() => setIsEmployeeFlowModalOpen(false)}
          >
            <div
              className="bg-[#090e1a] border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                    <Play className="w-4 h-4 fill-sky-400" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-sky-400 uppercase tracking-wider font-bold block">
                      SIMULATED WORKFLOW
                    </span>
                    <h4 id="flow-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                      REQUEST FLOW PREVIEW
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmployeeFlowModalOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Step Workflow Steps */}
              <div className="space-y-3 font-mono text-xs mb-5">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-sky-950 border border-sky-800 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    01
                  </span>
                  <div>
                    <span className="font-bold text-white block">Step 01: Leave request created</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Employee selects leave type, date range, and duration in self-service workspace.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    02
                  </span>
                  <div>
                    <span className="font-bold text-white block">Step 02: Manager review required</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Request is routed to the designated line manager with automated team coverage pre-checks.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    03
                  </span>
                  <div>
                    <span className="font-bold text-white block">Step 03: Decision recorded</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Approved request transactionally adjusts balances and updates team calendar.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-800/80 text-[11px] text-amber-300 font-mono mb-5">
                Clearly labeled: SIMULATED WORKFLOW • No API requests, database mutations, or backend data writes are dispatched.
              </div>

              <div className="flex items-center justify-end pt-3.5 border-t border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsEmployeeFlowModalOpen(false)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700"
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
