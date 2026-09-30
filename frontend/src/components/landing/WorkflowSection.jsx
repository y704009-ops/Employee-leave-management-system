import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
  UserCheck,
  ArrowLeftRight,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Play,
  Check,
  Activity,
  Layers,
  User,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

// ============================================================================
// STAGE SPECIFICATIONS & METADATA
// ============================================================================

const STAGE_SPECS = {
  1: {
    num: '01',
    name: 'Plan & Apply (Employee Ingress)',
    protocol: 'STATUTORY_QUOTA_VALIDATION',
    auditTag: 'INGRESS_SEALED',
    detail: 'Calculates active entitlements in real-time, validates blackout windows, and verifies zero overlapping leaves across peer staff.',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200/80',
    meta: ['Quota Pool: 18.5 Days Available', 'Blackout Check: Compliant', 'Handover: Assigned'],
  },
  2: {
    num: '02',
    name: 'Multi-Tier Review (Manager Quorum)',
    protocol: 'QUORUM_QUASI_CONSENSUS',
    auditTag: 'QUORUM_VERIFIED',
    detail: 'Evaluates departmental team staffing to guarantee minimum 75% capacity retention before line manager single-click approval.',
    badgeColor: 'text-sky-700 bg-sky-50 border-sky-200/80',
    meta: ['Coverage: 94% Quorum', 'Line Manager: MGR-001 Assigned', 'Escalation SLA: 48h Guard'],
  },
  3: {
    num: '03',
    name: 'Record & Reconcile (ACID Settlement)',
    protocol: 'TRANSACTIONAL_LEDGER_SYNC',
    auditTag: 'PAYROLL_COMMITTED',
    detail: 'Applies row-level DB lock, updates personal ledger, and automatically pushes event webhooks to enterprise payroll with zero manual entry.',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    meta: ['Persistence: MySQL ACID Bound', 'Audit Log: SHA-256 Committed', 'Webhook: Dispatched'],
  },
};

const AUDIT_TRAIL_ITEMS = [
  { time: '09:14', text: 'Request submitted' },
  { time: '09:37', text: 'Manager review completed' },
  { time: '09:42', text: 'Decision recorded' },
];

const WorkflowSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  // Active interactive stage: default to Stage 01
  const [activeStage, setActiveStage] = useState(1);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);

  const demoTimeoutsRef = useRef([]);

  const clearDemoTimeouts = () => {
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
  };

  // Initial gentle scroll reveal: illuminate Stage 1 -> 2 -> 3 once when entering viewport
  useEffect(() => {
    if (!isInView) return;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setActiveStage(1);
      return;
    }

    const t1 = setTimeout(() => setActiveStage(2), 1200);
    const t2 = setTimeout(() => setActiveStage(3), 2400);
    const t3 = setTimeout(() => setActiveStage(1), 3600); // Return to default Stage 01

    demoTimeoutsRef.current = [t1, t2, t3];

    return () => clearDemoTimeouts();
  }, [isInView]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => clearDemoTimeouts();
  }, []);

  // Handler for RUN DEMO →
  const handleRunDemo = (e) => {
    e?.stopPropagation?.();
    clearDemoTimeouts();
    setIsRunningDemo(true);
    setDemoComplete(false);
    setActiveStage(1);

    const t1 = setTimeout(() => {
      setActiveStage(2);
    }, 1100);

    const t2 = setTimeout(() => {
      setActiveStage(3);
    }, 2200);

    const t3 = setTimeout(() => {
      setIsRunningDemo(false);
      setDemoComplete(true);
    }, 3300);

    demoTimeoutsRef.current = [t1, t2, t3];
  };

  // Command Center Run Demo listener
  useEffect(() => {
    const handleRunDemoEvent = () => {
      handleRunDemo();
    };
    window.addEventListener('elms:run-workflow-demo', handleRunDemoEvent);
    return () => window.removeEventListener('elms:run-workflow-demo', handleRunDemoEvent);
  }, []);

  const handleStageSelect = (stageNum) => {
    clearDemoTimeouts();
    setIsRunningDemo(false);
    setDemoComplete(false);
    setActiveStage(stageNum);
  };

  const activeSpec = STAGE_SPECS[activeStage] || STAGE_SPECS[1];

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-white relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Background Architectural Accent */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-35" />

      {/* Centered Responsive Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* ================================================================ */}
        {/* SECTION HEADER                                                   */}
        {/* ================================================================ */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
              <Layers className="w-4 h-4 text-brand-700" />
              <span>03 / 06 • WORKFORCE WORKFLOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              From request to record, every step stays connected.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Standardized workflows keep leave decisions visible, reviewable, and easy to reconcile.
            </p>
          </div>

          {/* Workflow Progress Indicator & RUN DEMO Action */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0 font-mono text-xs">
            {/* Progress Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                WORKFLOW PROGRESS
              </span>
              <span className="font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-slate-200/70 shadow-2xs">
                0{activeStage} / 03
              </span>
            </div>

            {/* Run Demo Button */}
            <button
              type="button"
              onClick={handleRunDemo}
              disabled={isRunningDemo}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                isRunningDemo
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 cursor-wait'
                  : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white'
              }`}
            >
              {isRunningDemo ? (
                <>
                  <RotateCcw className="w-3 h-3 animate-spin text-brand-600" />
                  <span>RUNNING DEMO...</span>
                </>
              ) : demoComplete ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>✓ WORKFLOW COMPLETE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-sky-300" />
                  <span>RUN DEMO →</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div
          className={`mb-8 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="text-[10px] text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60 font-bold">
              SIMULATED PRODUCT FLOW
            </span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              {demoComplete
                ? '✓ Execution pipeline reconciled and sealed'
                : isRunningDemo
                ? 'Automating multi-tier process step...'
                : 'Click any stage or Run Demo to preview operations'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-36 sm:w-44 h-2 bg-slate-200/80 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStage / 3) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 shrink-0">
              {Math.round((activeStage / 3) * 100)}%
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3-STAGE WORKFLOW GRID (Desktop Horizontal / Mobile Vertical)     */}
        {/* ================================================================ */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">

          {/* ============================================================ */}
          {/* STAGE 01 — PLAN & APPLY                                      */}
          {/* ============================================================ */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeStage === 1}
            aria-label="Stage 01: Plan & Apply"
            onClick={() => handleStageSelect(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStageSelect(1);
              }
            }}
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between ${
              activeStage === 1
                ? 'bg-white border-2 border-brand-500 shadow-md ring-2 ring-brand-500/15 -translate-y-1'
                : 'bg-white/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-slate-600 transition-colors">
                    01
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 1
                        ? 'bg-brand-50 text-brand-700 border-brand-200'
                        : activeStage > 1
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {activeStage > 1 ? '✓ COMPLETE' : activeStage === 1 ? '● ACTIVE STAGE' : 'PENDING'}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-200/70 flex items-center justify-center text-blue-600 shadow-2xs">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                PLAN & APPLY
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-5 font-normal">
                Employees submit leave requests with dates, leave type, and optional context.
              </p>
            </div>

            {/* Stage 01 Mini UI Component */}
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                activeStage === 1
                  ? 'bg-blue-50/50 border-blue-200/90 shadow-2xs ring-1 ring-blue-500/10'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
                    <User className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    LEAVE REQUEST
                  </span>
                </div>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                  ● REQUEST READY
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-900">Annual Leave</span>
                <span className="font-mono text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs font-medium">
                  Dec 24 → Dec 29
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Employee Ingress</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pre-check Passed
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Connector (01 ─── 02) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-200">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500 ease-out ${
                      activeStage >= 2 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    activeStage >= 2 ? 'border-sky-400 text-sky-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Mobile Vertical Connector (01 ↓ 02) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 h-6 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-200">
                  <div
                    className={`w-full bg-gradient-to-b from-blue-500 to-sky-500 transition-all duration-500 ease-out ${
                      activeStage >= 2 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    activeStage >= 2 ? 'border-sky-400 text-sky-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowDown className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STAGE 02 — MULTI-TIER REVIEW                                 */}
          {/* ============================================================ */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeStage === 2}
            aria-label="Stage 02: Multi-Tier Review"
            onClick={() => handleStageSelect(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStageSelect(2);
              }
            }}
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between ${
              activeStage === 2
                ? 'bg-white border-2 border-brand-500 shadow-md ring-2 ring-brand-500/15 -translate-y-1'
                : 'bg-white/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-sky-600 transition-colors">
                    02
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 2
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : activeStage > 2
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {activeStage > 2 ? '✓ COMPLETE' : activeStage === 2 ? '● ACTIVE STAGE' : 'PENDING'}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-sky-50/80 border border-sky-200/70 flex items-center justify-center text-sky-600 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                MULTI-TIER REVIEW
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-5 font-normal">
                Managers review requests against team coverage, policy rules, and operational requirements.
              </p>
            </div>

            {/* Stage 02 Mini UI Component */}
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                activeStage === 2
                  ? 'bg-sky-50/50 border-sky-200/90 shadow-2xs ring-1 ring-sky-500/10'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  MANAGER REVIEW
                </span>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 uppercase">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-900">Employee A</span>
                <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                  5 days
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <div className="flex items-center gap-1">
                  <span>TEAM QUORUM</span>
                  <span className="font-bold text-emerald-700">94%</span>
                </div>
                <span className="font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded shadow-2xs">
                  [ REVIEW ]
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Connector (02 ─── 03) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-200">
                  <div
                    className={`h-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-500 ease-out ${
                      activeStage >= 3 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    activeStage >= 3 ? 'border-violet-400 text-violet-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Mobile Vertical Connector (02 ↓ 03) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 h-6 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-200">
                  <div
                    className={`w-full bg-gradient-to-b from-sky-500 to-violet-500 transition-all duration-500 ease-out ${
                      activeStage >= 3 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    activeStage >= 3 ? 'border-violet-400 text-violet-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowDown className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STAGE 03 — RECORD & RECONCILE                                */}
          {/* ============================================================ */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeStage === 3}
            aria-label="Stage 03: Record & Reconcile"
            onClick={() => handleStageSelect(3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStageSelect(3);
              }
            }}
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between ${
              activeStage === 3
                ? 'bg-white border-2 border-brand-500 shadow-md ring-2 ring-brand-500/15 -translate-y-1'
                : 'bg-white/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-violet-600 transition-colors">
                    03
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 3
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {activeStage === 3 ? '● ACTIVE STAGE' : 'PENDING'}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-violet-50/80 border border-violet-200/70 flex items-center justify-center text-violet-600 shadow-2xs">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                RECORD & RECONCILE
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-5 font-normal">
                Approved decisions become part of the workforce record and downstream operational reporting.
              </p>
            </div>

            {/* Stage 03 Mini UI Component */}
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                activeStage === 3
                  ? 'bg-violet-50/50 border-violet-200/90 shadow-2xs ring-1 ring-violet-500/10'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  REQUEST APPROVED
                </span>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                  ● RECORDED
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-900">Employee A</span>
                <span className="font-mono text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                  Dec 24 → Dec 29
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span className="text-violet-700 font-semibold">AUDIT EVENT CREATED</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Synced
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================ */}
        {/* INTERACTIVE STAGE PROTOCOL INSPECTOR                             */}
        {/* ================================================================ */}
        <div
          style={{ transitionDelay: isInView ? '450ms' : '0ms' }}
          className={`mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs font-mono transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                STAGE {activeSpec.num} PROTOCOL • {activeSpec.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${activeSpec.badgeColor}`}>
                {activeSpec.protocol}
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeSpec.auditTag}
              </span>
            </div>
          </div>
          <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-sans">
            <p className="text-slate-600 text-xs leading-relaxed max-w-2xl font-normal">
              {activeSpec.detail}
            </p>
            <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono">
              {activeSpec.meta.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg text-[10px] text-slate-700 font-semibold shadow-2xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* COMPACT AUDIT TRAIL STRIP                                        */}
        {/* ================================================================ */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50">
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-600" />
              <span>AUDIT TRAIL</span>
            </span>
            <span className="font-mono text-[9px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              SIMULATED DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] text-slate-600">
            {AUDIT_TRAIL_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs"
              >
                <span className="text-slate-800 font-medium">{item.text}</span>
                <span className="text-slate-400 ml-2">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkflowSection;
