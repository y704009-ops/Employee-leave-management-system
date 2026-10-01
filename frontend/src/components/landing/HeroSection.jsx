import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Key,
  FileCheck2,
  Building2,
  CheckCircle2,
  Clock,
  Check,
  Play,
  Pause,
  Copy,
  Activity,
} from 'lucide-react';

const WORKFORCE_STAGES = [
  {
    stage: 'SUBMITTED',
    label: 'Leave request submitted',
    statusTag: 'PENDING REVIEW',
    statusColor: 'bg-blue-950/70 text-blue-400 border-blue-800/60',
    employee: 'Employee A',
    role: 'Senior Architect • Engineering',
    category: 'Annual Paid Leave',
    dates: 'Dec 24 → Dec 29',
    duration: '5.0 Days',
    progressWidth: '25%',
    checkLabel: 'Ingress Validation Passed',
    checkColor: 'text-blue-400',
    checkStatus: '0 Blackout Conflicts',
    reconcileLabel: 'Quota Reservation',
    reconcileVal: '5.0d Encumbered',
    balanceAvail: '18.5 Days',
    quorumVal: '94% Safe',
    activeStaffVal: '17 / 18',
  },
  {
    stage: 'REVIEW',
    label: 'Manager review pending',
    statusTag: 'MANAGER REVIEW',
    statusColor: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    employee: 'Employee A',
    role: 'Senior Architect • Engineering',
    category: 'Annual Paid Leave',
    dates: 'Dec 24 → Dec 29',
    duration: '5.0 Days',
    progressWidth: '50%',
    checkLabel: 'Staffing Quorum Verified',
    checkColor: 'text-amber-400',
    checkStatus: '94% Safe Quorum',
    reconcileLabel: 'Escalation Routing',
    reconcileVal: 'Line Manager (MGR-001)',
    balanceAvail: '18.5 Days',
    quorumVal: '94% Safe',
    activeStaffVal: '17 / 18',
  },
  {
    stage: 'APPROVED',
    label: 'Approved & Signed',
    statusTag: 'APPROVED & SIGNED',
    statusColor: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    employee: 'Employee A',
    role: 'Senior Architect • Engineering',
    category: 'Annual Paid Leave',
    dates: 'Dec 24 → Dec 29',
    duration: '5.0 Days',
    progressWidth: '75%',
    checkLabel: 'Manager Authorized',
    checkColor: 'text-emerald-400',
    checkStatus: 'Signed (MGR-001)',
    reconcileLabel: 'Ledger Settlement',
    reconcileVal: '13.5d Remaining',
    balanceAvail: '13.5 Days',
    quorumVal: '94% Safe',
    activeStaffVal: '17 / 18',
  },
  {
    stage: 'RECALCULATED',
    label: 'Team coverage recalculated',
    statusTag: 'RECONCILED & SYNCED',
    statusColor: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    employee: 'Employee A',
    role: 'Senior Architect • Engineering',
    category: 'Annual Paid Leave',
    dates: 'Dec 24 → Dec 29',
    duration: '5.0 Days',
    progressWidth: '100%',
    checkLabel: 'Policy Check Passed',
    checkColor: 'text-emerald-400',
    checkStatus: '0 Overlaps',
    reconcileLabel: 'Audit Rebalancing',
    reconcileVal: 'Reconciled (Demo)',
    balanceAvail: '13.5 Days (Settled)',
    quorumVal: '94% Safe',
    activeStaffVal: '17 / 18',
  },
];

const HeroSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeConsoleTab, setActiveConsoleTab] = useState('request');
  const [stageIndex, setStageIndex] = useState(0);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Controlled simulated ledger workflow progression
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || activeConsoleTab !== 'request' || isSimulationPaused) return;

    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % WORKFORCE_STAGES.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [activeConsoleTab, isSimulationPaused]);

  const currentStage = WORKFORCE_STAGES[stageIndex] || WORKFORCE_STAGES[0];

  const handleCopyTx = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('TX-2025-ELMS-09421').catch(() => {});
    }
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handlePrevStage = () => {
    setIsSimulationPaused(true);
    setStageIndex((prev) => (prev - 1 + WORKFORCE_STAGES.length) % WORKFORCE_STAGES.length);
  };

  const handleNextStage = () => {
    setIsSimulationPaused(true);
    setStageIndex((prev) => (prev + 1) % WORKFORCE_STAGES.length);
  };

  const handleSelectStage = (idx) => {
    setIsSimulationPaused(true);
    setStageIndex(idx);
  };

  const handlePrimaryCTA = () => {
    if (isAuthenticated && user?.role) {
      navigate(getDashboardForRole(user.role));
    } else {
      navigate('/login');
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[780px] lg:min-h-[860px] overflow-hidden flex items-center bg-[#020617] py-16 sm:py-20 lg:py-24"
    >
      {/* 1. Architectural Grid Background Depth */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_60%,transparent_100%)] pointer-events-none opacity-80" />

      {/* 2. Controlled Multi-Source Atmospheric Lighting */}
      <div className="absolute -top-24 left-[10%] w-[38rem] h-[38rem] bg-gradient-to-br from-blue-900/25 via-brand-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-[5%] w-[36rem] h-[36rem] bg-gradient-to-bl from-sky-800/20 via-blue-950/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Staggered Coordinated Entrance Sequence      */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Step 1: Enterprise Platform Status Eyebrow Badge */}
            <div className="animate-fade-in-up delay-75 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-xs mb-6 w-fit backdrop-blur-md ring-1 ring-white/5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                  SYSTEM OPERATIONAL
                </span>
              </div>
              <span className="font-mono text-[11px] sm:text-xs text-slate-200 font-bold tracking-wider uppercase">
                01 / 06 • WORKFORCE OPERATIONS
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-semibold bg-slate-800/80 border border-slate-700/60 px-1.5 py-0.5 rounded hidden sm:inline">
                CORP-NET v2.4
              </span>
            </div>

            {/* Step 2: Main Dominant Headline */}
            <h1 className="animate-fade-in-up delay-150 text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[64px] font-black text-white tracking-[-0.035em] leading-[1.05] mb-6 drop-shadow-sm max-w-2xl">
              Work<span className="text-sky-400">.</span> Manage<span className="text-sky-400">.</span> Grow<span className="text-sky-400">.</span>
            </h1>

            {/* Step 3: Strategic Value Proposition Paragraph */}
            <p className="animate-fade-in-up delay-250 text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed font-normal">
              The enterprise leave management platform built for modern organizations. Empower employees with transparent self-service leave requests, give managers immediate team quorum and absence visibility, and equip HR with automated statutory balancing and auditable workflow records.
            </p>

            {/* Step 4: Intentional CTA Cluster */}
            <div className="animate-fade-in-up delay-350 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handlePrimaryCTA}
                className="group relative inline-flex items-center justify-center h-12 px-7 bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-950/70 hover:shadow-blue-500/25 border border-sky-400/30 hover:border-sky-400/60 transition-all duration-200 cursor-pointer gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span>{isAuthenticated ? 'GO TO DASHBOARD' : 'SIGN IN WITH SSO'}</span>
                <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Secondary CTA */}
              <a
                href="#capabilities"
                className="group inline-flex items-center justify-center h-12 px-6 bg-slate-900/80 hover:bg-slate-800 active:bg-slate-950 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/80 hover:border-slate-500 shadow-xs transition-all duration-200 gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <Compass className="w-4 h-4 text-sky-300 group-hover:rotate-45 transition-transform duration-300" />
                <span>EXPLORE ELMS</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Step 5: Micro-Trust Operational Markers */}
            <div className="animate-fade-in-up delay-400 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mb-8 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> Instant Quota Balancing
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" /> Automated Quorum Guard
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" /> Multi-Tier Approval Routing
              </span>
            </div>

            {/* Step 6: Trust & Governance Verification Bar */}
            <div className="animate-fade-in-up delay-500 inline-flex flex-wrap items-center gap-y-2 gap-x-4 px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-md w-fit">
              <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Role-Based Access Control</span>
              </div>
              <span className="text-slate-700 font-mono text-xs hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Key className="w-4 h-4 text-sky-400" />
                <span>Enterprise SSO Integration</span>
              </div>
              <span className="text-slate-700 font-mono text-xs hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <FileCheck2 className="w-4 h-4 text-indigo-300" />
                <span>Auditable Activity Trail</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Live Workforce Operations Console           */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 w-full animate-fade-in-up delay-200">
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-sky-400/35 via-slate-800/90 to-slate-900 shadow-2xl shadow-blue-950/90 group">
              {/* Subtle Backlight Glow Accent */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div
                className="rounded-[15px] bg-[#070b14]/95 p-5 sm:p-6 backdrop-blur-2xl relative overflow-hidden"
                onMouseEnter={() => setIsSimulationPaused(true)}
                onMouseLeave={() => setIsSimulationPaused(false)}
              >
                {/* Console Hairline Accent Glow */}
                <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none" />

                {/* Console Header Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider block">
                        WORKFORCE OPERATIONS
                      </span>
                      <span className="font-mono text-[9px] text-emerald-400 font-semibold block">
                        ● SYSTEM OPERATIONAL
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded uppercase hidden sm:inline">
                      PRODUCT PREVIEW • SIMULATED DATA
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSimulationPaused((prev) => !prev)}
                      className="font-mono text-[9px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-700/80 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title={isSimulationPaused ? 'Resume live simulation' : 'Pause simulation'}
                    >
                      {isSimulationPaused ? (
                        <>
                          <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                          <span>RESUME</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-2.5 h-2.5 text-sky-400" />
                          <span>PAUSE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Three Live Key Metric Keycards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
                  {/* Card 1: TEAM QUORUM */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs hover:border-slate-700/80 transition-all group/card">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      TEAM QUORUM
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
                      94%
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-emerald-400 h-full w-[94%]" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono block mt-1">
                      Safe Quorum
                    </span>
                  </div>

                  {/* Card 2: ACTIVE STAFF */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs hover:border-slate-700/80 transition-all group/card">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      ACTIVE STAFF
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
                      17 / 18
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-sky-400 h-full w-[94%]" />
                    </div>
                    <span className="text-[9px] text-sky-400 font-mono block mt-1">
                      1 on leave
                    </span>
                  </div>

                  {/* Card 3: PENDING REQUESTS */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-2xs hover:border-slate-700/80 transition-all group/card">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      PENDING REQUESTS
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono tracking-tight">
                      02
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-amber-400 h-full w-[40%]" />
                    </div>
                    <span className="text-[9px] text-amber-300 font-mono block mt-1">
                      In Queue
                    </span>
                  </div>
                </div>

                {/* Interactive Mode Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-950/90 border border-slate-800/80 rounded-lg mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('request')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      activeConsoleTab === 'request'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Live Workflow
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('quorum')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      activeConsoleTab === 'quorum'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Quorum Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('rules')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      activeConsoleTab === 'rules'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Statutory Rules
                  </button>
                </div>

                {/* Tab 1: Live Simulated Request Stream (Phase 1 Micro-Interaction) */}
                {activeConsoleTab === 'request' && (
                  <div className="space-y-3 animate-fade-in">
                    {/* 4-Stage Step Scrubber */}
                    <div className="flex items-center justify-between gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-lg">
                      {WORKFORCE_STAGES.map((s, idx) => {
                        const isActive = idx === stageIndex;
                        const isCompleted = idx < stageIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectStage(idx)}
                            className={`flex-1 py-1 px-1 rounded text-[9px] font-mono font-semibold transition-all cursor-pointer truncate ${
                              isActive
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-xs'
                                : isCompleted
                                ? 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                            }`}
                            title={`Jump to ${s.stage}`}
                          >
                            <span className="hidden sm:inline">0{idx + 1} </span>
                            <span>{s.stage}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 hover:border-slate-700/70 transition-colors">
                      {/* Employee Meta Row */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-700 to-sky-600 text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                            SC
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{currentStage.employee}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{currentStage.role}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shadow-2xs transition-all duration-300 ${currentStage.statusColor}`}>
                          {currentStage.statusTag}
                        </span>
                      </div>

                      {/* Transaction Data Row */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/70 my-2">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">Category</span>
                          <span className="text-slate-200 font-medium">{currentStage.category}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">Dates &amp; Duration</span>
                          <span className="font-mono text-slate-200 font-bold">{currentStage.dates} ({currentStage.duration})</span>
                        </div>
                      </div>

                      {/* Verification Pipeline with Dynamic Width Transition */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className={`flex items-center gap-1 ${currentStage.checkColor} transition-colors`}>
                            <Check className="w-3 h-3 stroke-[2.5]" /> {currentStage.checkLabel}
                          </span>
                          <span className="text-slate-500">{currentStage.checkStatus}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: currentStage.progressWidth }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>{currentStage.reconcileLabel}</span>
                          <span className="text-sky-400 font-semibold">{currentStage.reconcileVal}</span>
                        </div>
                      </div>

                      {/* Interactive Micro-controls: Copy TX & Step Steppers */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/70 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={handleCopyTx}
                          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                          title="Copy verifiable transaction hash"
                        >
                          {copiedTx ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">COPIED TO CLIPBOARD</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>TX#8492-ACID</span>
                            </>
                          )}
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handlePrevStage}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-[9px]"
                            title="Previous Stage"
                          >
                            ◀ Prev
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStage}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-[9px]"
                            title="Next Stage"
                          >
                            Next ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Department Quorum */}
                {activeConsoleTab === 'quorum' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-slate-300 font-semibold">Core Engineering Staffing (This Week)</span>
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                          QUORUM MET
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                        {[
                          { day: 'MON', cap: '94%', count: '17/18' },
                          { day: 'TUE', cap: '94%', count: '17/18' },
                          { day: 'WED', cap: '88%', count: '16/18' },
                          { day: 'THU', cap: '94%', count: '17/18' },
                          { day: 'FRI', cap: '90%', count: '16/18' },
                        ].map((item, idx) => (
                          <div key={idx} className="p-1.5 sm:p-2 rounded bg-slate-900 border border-slate-800/80 shadow-2xs hover:border-sky-500/50 transition-colors">
                            <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 block">{item.day}</span>
                            <span className="font-mono text-[11px] sm:text-xs font-bold text-sky-400 block mt-0.5">{item.cap}</span>
                            <span className="font-mono text-[8px] sm:text-[9px] text-slate-500 block">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Minimum Operational Quorum:</span>
                      <span className="font-mono text-white font-semibold">75% Required Threshold</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Statutory Rules */}
                {activeConsoleTab === 'rules' && (
                  <div className="space-y-2.5 animate-fade-in text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-1.5 hover:border-slate-700/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 font-semibold">Annual Paid Leave</span>
                        <span className="font-mono text-[10px] text-sky-400 font-bold">20d / yr Accrual</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                        Accrues 1.67 d/mo. Maximum 5.0 days rollover carryover into subsequent statutory period.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-1.5 hover:border-slate-700/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 font-semibold">Statutory Sick Leave</span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">10d Protected</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                        Medical practitioner documentation strictly mandated for requests exceeding 3 consecutive business days.
                      </p>
                    </div>
                  </div>
                )}

                {/* Compact Activity Stream (Phase 1 Requirement) */}
                <div className="pt-3 mt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 uppercase font-semibold text-slate-300">
                      <Activity className="w-3 h-3 text-sky-400" />
                      <span>Live Activity Stream</span>
                    </span>
                    <span className="text-[9px] text-slate-500">SIMULATED STREAM</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between gap-2 text-slate-300">
                      <div className="truncate">
                        <span className="text-sky-400 font-semibold">09:42</span> Leave request submitted{' '}
                        <span className="text-slate-400">· Employee A (Engineering)</span>
                      </div>
                      <span className="text-emerald-400 shrink-0">● Active</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-slate-400">
                      <div className="truncate">
                        <span className="text-sky-400 font-semibold">09:37</span> Manager approval pending{' '}
                        <span className="text-slate-500">· Employee B (DevOps)</span>
                      </div>
                      <span className="text-amber-400 shrink-0">● Pending</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-slate-400">
                      <div className="truncate">
                        <span className="text-sky-400 font-semibold">09:21</span> Team coverage recalculated
                      </div>
                      <span className="text-slate-500 shrink-0">94% Quorum</span>
                    </div>
                  </div>
                </div>

                {/* Console Footer Compliance Note */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Avg Turnaround: &lt;4.2 hrs</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PRODUCT PREVIEW • SIMULATED DATA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Context System Status Indicator Bar */}
        <div className="animate-fade-in delay-500 pt-14 sm:pt-16 flex flex-wrap items-center justify-between gap-4 text-slate-300 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-lg shadow-xs">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-slate-200">
              SkillMate Enterprise Architecture — Product Preview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-slate-400 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 hidden sm:inline">SYSTEM STATUS:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AUTH ONLINE
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-sky-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              RBAC ACTIVE
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-indigo-300 font-semibold hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
              AUDIT READY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
