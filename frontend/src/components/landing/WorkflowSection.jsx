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
    name: 'Plan & Apply',
    statusLabel: 'REQUEST PREPARED',
    protocol: 'STATUTORY_QUOTA_VALIDATION',
    auditTag: 'INGRESS_SEALED',
    detail: 'Prepare a leave request with the relevant leave type and requested dates. Calculates active entitlements in real-time, validates blackout windows, and verifies zero overlapping leaves across peer staff.',
    badgeColor: 'text-sky-300 bg-sky-950/80 border-sky-800',
    meta: ['Quota Pool: 18.5 Days Available', 'Blackout Check: Compliant', 'Handover: Assigned'],
  },
  2: {
    num: '02',
    name: 'Multi-Tier Review',
    statusLabel: 'REVIEW REQUIRED',
    protocol: 'QUORUM_QUASI_CONSENSUS',
    auditTag: 'QUORUM_VERIFIED',
    detail: 'Requests move through the appropriate review process before a decision is recorded. Evaluates departmental team staffing to guarantee minimum 75% capacity retention.',
    badgeColor: 'text-amber-300 bg-amber-950/80 border-amber-800',
    meta: ['Coverage: 94% Quorum', 'Line Manager: MGR-001 Assigned', 'Escalation SLA: 48h Guard'],
  },
  3: {
    num: '03',
    name: 'Record & Reconcile',
    statusLabel: 'RECORD UPDATED',
    protocol: 'TRANSACTIONAL_LEDGER_SYNC',
    auditTag: 'PAYROLL_COMMITTED',
    detail: 'Once processed, the leave event becomes part of the workforce record and reporting flow. Applies row-level DB lock and updates personal ledger with zero manual entry.',
    badgeColor: 'text-emerald-300 bg-emerald-950/80 border-emerald-800',
    meta: ['Persistence: MySQL ACID Bound', 'Audit Log: SHA-256 Committed', 'Webhook: Dispatched'],
  },
};

const PROCESS_TRACE_ITEMS = [
  { id: 1, time: '09:14', title: 'Request submitted', detail: 'REQUEST PREPARED', stage: 1 },
  { id: 2, time: '09:37', title: 'Manager review completed', detail: 'REVIEW ROUTE CREATED', stage: 2 },
  { id: 3, time: '09:42', title: 'Decision recorded', detail: 'WORKFLOW RECORD UPDATED', stage: 3 },
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

    const t1 = setTimeout(() => setActiveStage(2), 900);
    const t2 = setTimeout(() => setActiveStage(3), 1800);
    const t3 = setTimeout(() => setActiveStage(1), 2700); // Return to default Stage 01

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

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setActiveStage(3);
      setIsRunningDemo(false);
      setDemoComplete(true);
      return;
    }

    const t1 = setTimeout(() => {
      setActiveStage(2);
    }, 900);

    const t2 = setTimeout(() => {
      setActiveStage(3);
    }, 1800);

    const t3 = setTimeout(() => {
      setIsRunningDemo(false);
      setDemoComplete(true);
    }, 2700);

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
      className="w-full py-20 sm:py-24 bg-[#030712] relative border-b border-slate-800/80 overflow-hidden text-slate-100"
    >
      {/* 1. Subtle Architectural Grid Texture */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" />

      {/* 2. Ambient Atmospheric Lighting Glow */}
      <div className="absolute top-1/3 left-1/3 w-[36rem] h-[36rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Responsive Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* ================================================================ */}
        {/* SECTION HEADER                                                   */}
        {/* ================================================================ */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xs mb-3.5 backdrop-blur-md">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                WORKFORCE WORKFLOW
              </span>
              <span className="text-slate-600 font-mono text-xs">•</span>
              <span className="font-mono text-[11px] text-slate-300 font-semibold tracking-wider uppercase">
                03 / 06 • WORKFLOW STAGE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-[-0.03em] leading-[1.12]">
              From request to record, every step stays connected.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-normal">
              Follow the structured journey from leave planning through review and final record keeping. Standardized workflows keep leave decisions visible, reviewable, and easy to reconcile.
            </p>
          </div>

          {/* Workflow Progress Indicator & RUN WORKFLOW DEMO Action */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                WORKFLOW PROGRESS
              </span>
              <span className="font-bold text-sky-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shadow-2xs">
                0{activeStage} / 03
              </span>
            </div>

            {/* Status Badges */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold shadow-xs">
              WORKFLOW PREVIEW
            </span>

            {/* Run Demo Button */}
            <button
              type="button"
              onClick={handleRunDemo}
              disabled={isRunningDemo}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer border ${
                isRunningDemo
                  ? 'bg-sky-950/80 text-sky-300 border-sky-800 cursor-wait'
                  : 'bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white shadow-sky-950/50 border-sky-400/30'
              }`}
            >
              {isRunningDemo ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>RUNNING DEMO...</span>
                </>
              ) : demoComplete ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>✓ WORKFLOW COMPLETE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-sky-200 fill-sky-200" />
                  <span>RUN DEMO →</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div
          className={`mb-10 p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2.5 text-slate-200 font-semibold">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800 font-bold">
              SIMULATED PRODUCT FLOW
            </span>
            <span className="text-[10px] text-amber-300 uppercase tracking-wider bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 font-bold">
              SIMULATED PROCESS
            </span>
            <span className="text-slate-400 text-xs hidden md:inline">
              {demoComplete
                ? '✓ Execution pipeline reconciled and sealed'
                : isRunningDemo
                ? 'Automating multi-tier process step...'
                : 'Click any stage or Run Demo to preview operations'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Stage Chips: PLAN | REVIEW | RECORD */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className={`px-2 py-0.5 rounded border ${activeStage === 1 ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                PLAN
              </span>
              <span className="text-slate-600">•</span>
              <span className={`px-2 py-0.5 rounded border ${activeStage === 2 ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                REVIEW
              </span>
              <span className="text-slate-600">•</span>
              <span className={`px-2 py-0.5 rounded border ${activeStage === 3 ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                RECORD
              </span>
            </div>

            <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStage / 3) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white shrink-0">
              0{activeStage} / 03
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
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between overflow-hidden ${
              activeStage === 1
                ? 'bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070e24] border-2 border-sky-500/80 shadow-xl shadow-sky-950/50 ring-1 ring-sky-400/20 -translate-y-1'
                : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1324] shadow-md hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-2xl font-black text-slate-400 group-hover:text-white transition-colors">
                    01
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 1
                        ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                        : activeStage > 1
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {activeStage > 1 ? '✓ COMPLETE' : activeStage === 1 ? '● STEP 01 / 03' : 'STEP 01 / 03'}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 shadow-xs">
                  <CalendarDays className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                PLAN & APPLY
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                Employees submit leave requests with dates, leave type, and optional context.
              </p>
            </div>

            {/* Stage 01 Mini UI Component */}
            <div
              className={`p-4 rounded-xl border transition-all duration-200 ${
                activeStage === 1
                  ? 'bg-slate-950/95 border-sky-500/40 shadow-inner'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                    <User className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                    LEAVE REQUEST
                  </span>
                </div>
                <span className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-800 uppercase">
                  ● REQUEST READY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2.5 font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Leave Type</span>
                  <span className="font-bold text-white">Annual Leave</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Date Range</span>
                  <span className="font-bold text-sky-300">Dec 24 → Dec 29</span>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-sky-300 font-semibold">Status: REQUEST PREPARED</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SELECTED
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Connector (01 ─── 02) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-500 ease-out ${
                      activeStage >= 2 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                    activeStage >= 2 ? 'border-sky-400 text-sky-300' : 'border-slate-800 text-slate-600'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Mobile Vertical Connector (01 ↓ 02) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 h-6 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-800">
                  <div
                    className={`w-full bg-gradient-to-b from-sky-400 to-amber-400 transition-all duration-500 ease-out ${
                      activeStage >= 2 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-5 h-5 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                    activeStage >= 2 ? 'border-sky-400 text-sky-300' : 'border-slate-800 text-slate-600'
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
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between overflow-hidden ${
              activeStage === 2
                ? 'bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070e24] border-2 border-sky-500/80 shadow-xl shadow-sky-950/50 ring-1 ring-sky-400/20 -translate-y-1'
                : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1324] shadow-md hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-2xl font-black text-slate-400 group-hover:text-white transition-colors">
                    02
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 2
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : activeStage > 2
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {activeStage > 2 ? '✓ COMPLETE' : activeStage === 2 ? '● STEP 02 / 03' : 'STEP 02 / 03'}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shadow-xs">
                  <UserCheck className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                MULTI-TIER REVIEW
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                Managers review requests against team coverage, policy rules, and operational requirements.
              </p>
            </div>

            {/* Stage 02 Mini UI Component */}
            <div
              className={`p-4 rounded-xl border transition-all duration-200 ${
                activeStage === 2
                  ? 'bg-slate-950/95 border-amber-500/40 shadow-inner'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
                <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                  MANAGER REVIEW
                </span>
                <span className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-800 uppercase">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-white">Employee A</span>
                <span className="font-mono text-[11px] font-bold text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  5 days
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span>TEAM QUORUM</span>
                  <span className="font-bold text-emerald-400">94%</span>
                </div>
                <span className="font-bold text-amber-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shadow-2xs">
                  [ REVIEW ]
                </span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1.5">
                Status: REVIEW REQUIRED
              </div>
            </div>

            {/* Desktop Horizontal Connector (02 ─── 03) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 ease-out ${
                      activeStage >= 3 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                    activeStage >= 3 ? 'border-emerald-400 text-emerald-300' : 'border-slate-800 text-slate-600'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Mobile Vertical Connector (02 ↓ 03) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 h-6 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-800">
                  <div
                    className={`w-full bg-gradient-to-b from-amber-400 to-emerald-400 transition-all duration-500 ease-out ${
                      activeStage >= 3 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-5 h-5 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                    activeStage >= 3 ? 'border-emerald-400 text-emerald-300' : 'border-slate-800 text-slate-600'
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
            className={`p-6 sm:p-7 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between overflow-hidden ${
              activeStage === 3
                ? 'bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070e24] border-2 border-sky-500/80 shadow-xl shadow-sky-950/50 ring-1 ring-sky-400/20 -translate-y-1'
                : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1324] shadow-md hover:-translate-y-0.5 opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              {/* Header: Number & Stage Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-2xl font-black text-slate-400 group-hover:text-white transition-colors">
                    03
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase transition-colors ${
                      activeStage === 3
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {activeStage === 3 ? '● STEP 03 / 03' : 'STEP 03 / 03'}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shadow-xs">
                  <ArrowLeftRight className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                RECORD & RECONCILE
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                Approved decisions become part of the workforce record and downstream operational reporting.
              </p>
            </div>

            {/* Stage 03 Mini UI Component */}
            <div
              className={`p-4 rounded-xl border transition-all duration-200 ${
                activeStage === 3
                  ? 'bg-slate-950/95 border-emerald-500/40 shadow-inner'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
                <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                  REQUEST APPROVED
                </span>
                <span className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-800 uppercase">
                  ● RECORDED
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2.5 font-mono">
                <span className="font-bold text-white">Employee A</span>
                <span className="font-mono text-[11px] text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Dec 24 → Dec 29
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-emerald-400 font-semibold">AUDIT EVENT CREATED</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RECORD UPDATED
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================ */}
        {/* ACTIVE STAGE DETAIL PANEL (Protocol Inspector)                    */}
        {/* ================================================================ */}
        <div
          style={{ transitionDelay: isInView ? '450ms' : '0ms' }}
          className={`mt-10 p-5 sm:p-6 rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl font-mono transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                STAGE {activeSpec.num} PROTOCOL • {activeSpec.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${activeSpec.badgeColor}`}>
                STATUS: {activeSpec.statusLabel}
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded">
                SIMULATED PROCESS
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans">
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-mono">
                STAGE {activeSpec.num}: {activeSpec.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-normal">
                {activeSpec.detail}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[10px]">
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-semibold shadow-xs">
                REQUEST DETAILS → REVIEW QUEUE → WORKFORCE RECORD
              </span>
              {activeSpec.meta.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300 font-semibold shadow-xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PROCESS TRACE (Audit-Style Timeline)                             */}
        {/* ================================================================ */}
        <div className="mt-5 p-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 font-mono">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>AUDIT TRAIL</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                SIMULATED TIMELINE
              </span>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                SIMULATED DATA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-[10px]">
            {PROCESS_TRACE_ITEMS.map((item) => {
              const isCurrent = activeStage === item.stage;
              return (
                <div
                  key={item.id}
                  onClick={() => handleStageSelect(item.stage)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-950/80 border-sky-400/80 text-sky-200 shadow-md ring-1 ring-sky-400/20'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">{item.title}</span>
                    <span className="text-[9px] text-sky-300 font-semibold block">{item.detail}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 ml-2 font-bold">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkflowSection;
