import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  UserCheck,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const STEP_SPECS = {
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
    meta: ['Coverage: 94% Quorum', 'Line Manager: M#308 Assigned', 'Escalation SLA: 48h Guard'],
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

const WorkflowSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
  
  // Progression phase:
  // 0: 01 ●, 02 ○, 03 ○ (Stage 1 active)
  // 1: 01 ✓, 02 ●, 03 ○ (Stage 1 done, Stage 2 active)
  // 2: 01 ✓, 02 ✓, 03 ● (Stage 1 & 2 done, Stage 3 active)
  // 3: 01 ✓, 02 ✓, 03 ✓ (All complete, then STOP)
  const [progressPhase, setProgressPhase] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);

  // Controlled 3–4 second one-shot progression when section enters viewport
  useEffect(() => {
    if (!isInView) return;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setProgressPhase(3);
      return;
    }

    const t1 = setTimeout(() => setProgressPhase(1), 1100);
    const t2 = setTimeout(() => setProgressPhase(2), 2200);
    const t3 = setTimeout(() => setProgressPhase(3), 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isInView]);

  // Helper to determine status for a step (1, 2, 3)
  const getStepStatus = (stepNum) => {
    if (progressPhase >= stepNum) {
      return { state: 'done', label: '✓ COMPLETE', badge: '✓' };
    }
    if (progressPhase === stepNum - 1) {
      return { state: 'active', label: '● IN PROGRESS', badge: '●' };
    }
    return { state: 'pending', label: '○ PENDING', badge: '○' };
  };

  const status1 = getStepStatus(1);
  const status2 = getStepStatus(2);
  const status3 = getStepStatus(3);

  const handleReplay = (e) => {
    e?.stopPropagation?.();
    setSelectedStep(null);
    setProgressPhase(0);
    setTimeout(() => setProgressPhase(1), 1000);
    setTimeout(() => setProgressPhase(2), 2000);
    setTimeout(() => setProgressPhase(3), 3000);
  };

  const activeStepNum = selectedStep || (progressPhase >= 3 ? 3 : progressPhase === 2 ? 2 : 1);
  const activeSpec = STEP_SPECS[activeStepNum] || STEP_SPECS[1];

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-white relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header (Storytelling 03 / 06) */}
        <div
          className={`max-w-2xl mb-8 sm:mb-10 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
            03 / 06 • MULTI-TIER REVIEW PIPELINE
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Clear, audited process from application to payroll sync.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
            Eliminate ambiguity and undocumented leaves with automated, immutable ledger transitions.
          </p>
        </div>

        {/* Dynamic Process Progress Bar Tracker */}
        <div
          className={`mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="text-[10px] text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              PIPELINE EXECUTION
            </span>
            <span className="hidden sm:inline text-slate-500">
              {progressPhase === 3 ? 'Settlement Pipeline Reconciled' : 'Evaluating Live Ingress...'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Step 1 button */}
            <button
              type="button"
              onClick={() => setSelectedStep(1)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all duration-300 cursor-pointer ${
                status1.state === 'done' || selectedStep === 1
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shadow-2xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
              }`}
              title="Inspect Step 01: Plan & Apply"
            >
              01 {status1.badge}
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 2 button */}
            <button
              type="button"
              onClick={() => setSelectedStep(2)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all duration-300 cursor-pointer ${
                status2.state === 'done' || selectedStep === 2
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shadow-2xs'
                  : status2.state === 'active'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold animate-pulse'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
              title="Inspect Step 02: Multi-Tier Review"
            >
              02 {status2.badge}
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 3 button */}
            <button
              type="button"
              onClick={() => setSelectedStep(3)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all duration-300 cursor-pointer ${
                status3.state === 'done' || selectedStep === 3
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shadow-2xs'
                  : status3.state === 'active'
                  ? 'bg-violet-50 text-violet-700 border border-violet-200 font-bold animate-pulse'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
              title="Inspect Step 03: Record & Reconcile"
            >
              03 {status3.badge}
            </button>

            {/* Replay Button */}
            <button
              type="button"
              onClick={handleReplay}
              className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Replay workflow execution pipeline"
            >
              <RotateCcw className="w-2.5 h-2.5 text-slate-500" />
              <span>REPLAY</span>
            </button>
          </div>
        </div>

        {/* 3-Step Process Flow with Dynamic Responsive Connectors */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 w-full">
          
          {/* ================= STEP 01: PLAN & APPLY ================= */}
          <div
            onClick={() => setSelectedStep(1)}
            style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
            className={`p-6 sm:p-7 rounded-2xl bg-slate-50/80 border ${
              status1.state === 'active' || selectedStep === 1
                ? 'border-brand-500/80 ring-2 ring-brand-500/15 shadow-sm'
                : status1.state === 'done'
                ? 'border-emerald-200/80 shadow-2xs'
                : 'border-slate-200/80 shadow-2xs'
            } hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 ease-out relative z-10 flex flex-col justify-between group cursor-pointer ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              {/* Step Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-slate-600 transition-colors">
                    01
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                      status1.state === 'done'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {status1.label}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs group-hover:border-blue-300/80 group-hover:bg-blue-50 transition-colors duration-200">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Plan & Apply
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Employee selects dates on interactive balance visualizer. The system checks statutory quota,
                minimum blackout windows, and automatic handover assignments.
              </p>
            </div>

            {/* Bottom Status Strip */}
            <div className="h-10 px-3.5 rounded-xl bg-white border border-slate-200/80 font-mono text-[11px] text-slate-700 flex items-center justify-between shadow-2xs group-hover:border-slate-300/80 transition-colors">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-600 font-medium">Pre-validation passed</span>
              </div>
              <span className="font-mono text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                &lt;100ms
              </span>
            </div>

            {/* Desktop Horizontal Connector (01 -> 02) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-200">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-700 ease-out ${
                      progressPhase >= 1 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    progressPhase >= 1 ? 'border-sky-400 text-sky-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Tablet/Mobile Vertical Connector (01 ↓ 02) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-8 z-20 h-8 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-200">
                  <div
                    className={`w-full bg-gradient-to-b from-blue-500 to-sky-500 transition-all duration-700 ease-out ${
                      progressPhase >= 1 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    progressPhase >= 1 ? 'border-sky-400 text-sky-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 02: MULTI-TIER REVIEW ================= */}
          <div
            onClick={() => setSelectedStep(2)}
            style={{ transitionDelay: isInView ? '250ms' : '0ms' }}
            className={`p-6 sm:p-7 rounded-2xl bg-slate-50/90 border ${
              status2.state === 'active' || selectedStep === 2
                ? 'border-sky-400 ring-2 ring-sky-500/20 shadow-sm'
                : status2.state === 'done'
                ? 'border-emerald-200/80 shadow-2xs'
                : 'border-slate-200/80 shadow-2xs'
            } hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 ease-out relative z-10 flex flex-col justify-between group cursor-pointer ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              {/* Step Header with Active Gateway Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-sky-600 transition-colors">
                    02
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                      status2.state === 'done'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : status2.state === 'active'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {status2.label}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50/70 border border-sky-200/60 flex items-center justify-center text-sky-600 shadow-2xs group-hover:border-sky-300/80 group-hover:bg-sky-50 transition-colors duration-200">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Multi-Tier Review
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Assigned line manager reviews the request alongside concurrent team heatmaps. Escalate
                automatically if not reviewed within 48 operational hours.
              </p>
            </div>

            {/* Bottom Status Strip */}
            <div className="h-10 px-3.5 rounded-xl bg-white border border-slate-200/80 font-mono text-[11px] text-slate-700 flex items-center justify-between shadow-2xs group-hover:border-sky-200 transition-colors">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="text-slate-600 font-medium">Avg approval turnaround</span>
              </div>
              <span className="font-mono text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/60">
                4.2 Hours
              </span>
            </div>

            {/* Desktop Horizontal Connector (02 -> 03) */}
            <div className="hidden lg:flex items-center absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 pointer-events-none">
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-slate-200">
                  <div
                    className={`h-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-700 ease-out ${
                      progressPhase >= 2 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    progressPhase >= 2 ? 'border-violet-400 text-violet-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Tablet/Mobile Vertical Connector (02 ↓ 03) */}
            <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-8 z-20 h-8 pointer-events-none">
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="w-[2px] h-full bg-slate-200">
                  <div
                    className={`w-full bg-gradient-to-b from-sky-500 to-violet-500 transition-all duration-700 ease-out ${
                      progressPhase >= 2 ? 'h-full' : 'h-0'
                    }`}
                  />
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-white border transition-colors shadow-2xs flex items-center justify-center ${
                    progressPhase >= 2 ? 'border-violet-400 text-violet-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 03: RECORD & RECONCILE ================= */}
          <div
            onClick={() => setSelectedStep(3)}
            style={{ transitionDelay: isInView ? '400ms' : '0ms' }}
            className={`p-6 sm:p-7 rounded-2xl bg-slate-50/80 border ${
              status3.state === 'active' || selectedStep === 3
                ? 'border-violet-500/80 ring-2 ring-violet-500/15 shadow-sm'
                : status3.state === 'done'
                ? 'border-emerald-200/80 shadow-2xs'
                : 'border-slate-200/80 shadow-2xs'
            } hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 ease-out relative z-10 flex flex-col justify-between group cursor-pointer ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              {/* Step Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-extrabold text-slate-400 group-hover:text-slate-600 transition-colors">
                    03
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                      status3.state === 'done'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : status3.state === 'active'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {status3.label}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-50/70 border border-violet-200/60 flex items-center justify-center text-violet-600 shadow-2xs group-hover:border-violet-300/80 group-hover:bg-violet-50 transition-colors duration-200">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Record & Reconcile
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Approved hours immediately update personal quota pools and propagate via webhook into enterprise
                payroll engines with zero manual spreadsheet entry.
              </p>
            </div>

            {/* Bottom Status Strip */}
            <div className="h-10 px-3.5 rounded-xl bg-white border border-slate-200/80 font-mono text-[11px] text-slate-700 flex items-center justify-between shadow-2xs group-hover:border-slate-300/80 transition-colors">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                <span className="text-slate-600 font-medium">Immutable audit trail</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                SYNCED
              </span>
            </div>
          </div>

        </div>

        {/* Step Protocol Technical Inspector */}
        <div
          style={{ transitionDelay: isInView ? '500ms' : '0ms' }}
          className={`mt-7 p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs font-mono transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                STEP {activeSpec.num} PROTOCOL • {activeSpec.name}
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

      </div>
    </section>
  );
};

export default WorkflowSection;
