import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Database,
  KeyRound,
  ArrowRight,
  ArrowDown,
  Play,
  X,
  CheckCircle2,
  Activity,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

// ============================================================================
// ARCHITECTURE LAYERS DATA & METADATA
// ============================================================================

const ARCHITECTURE_LAYERS = [
  {
    id: 'identity',
    num: '01',
    name: 'IDENTITY',
    title: 'Identity',
    status: 'ACCESS BOUNDARY',
    icon: KeyRound,
    detail: "Users enter through the application's authentication boundary before accessing protected workspaces.",
    flowText: 'USER → AUTHENTICATION → WORKSPACE ACCESS',
    miniUiTitle: 'IDENTITY GATE',
    specs: [
      { label: 'BOUNDARY', value: 'Authentication Boundary' },
      { label: 'SESSION SCOPE', value: 'Protected Workspace Session' },
      { label: 'ENTRY PROTOCOL', value: 'Direct Credential Check' },
      { label: 'ACCESS GUARD', value: 'Role Verification Required' },
    ],
    badgeColor: 'text-sky-300 bg-sky-950/80 border-sky-800',
    borderColor: 'border-sky-500/80',
  },
  {
    id: 'access-control',
    num: '02',
    name: 'ACCESS CONTROL',
    title: 'Access Control',
    status: 'ROLE-BASED ACCESS',
    icon: Lock,
    detail: 'Role-based access boundaries separate employee, manager, and administrator workflows.',
    flowText: 'ROLE ROUTING: EMPLOYEE → EMPLOYEE WORKSPACE | MANAGER → MANAGER WORKSPACE | ADMIN → ADMIN WORKSPACE',
    miniUiTitle: 'ROLE-BASED ROUTING',
    specs: [
      { label: 'ROLE SEPARATION', value: 'Employee / Manager / Admin' },
      { label: 'ROUTING GUARD', value: 'Role-Based Workspace Scoping' },
      { label: 'PRIVILEGE SCOPE', value: 'Role-Restricted Views' },
      { label: 'GUARD STATUS', value: 'Authorized Scope Only' },
    ],
    badgeColor: 'text-amber-300 bg-amber-950/80 border-amber-800',
    borderColor: 'border-amber-500/80',
  },
  {
    id: 'data-isolation',
    num: '03',
    name: 'DATA ISOLATION',
    title: 'Data Isolation',
    status: 'WORKSPACE BOUNDARIES',
    icon: Database,
    detail: 'Application workspaces expose information according to the user\'s authorized role and workflow.',
    flowText: 'EMPLOYEE DATA ─ PERSONAL WORKSPACE | MANAGER DATA ─ TEAM WORKSPACE | ADMIN DATA ─ ORGANIZATION WORKSPACE',
    miniUiTitle: 'WORKSPACE BOUNDARIES',
    specs: [
      { label: 'ISOLATION LEVEL', value: 'Role-Scoped Workspace Scoping' },
      { label: 'VISIBILITY GUARD', value: 'Authorized Context Only' },
      { label: 'DATA BOUNDARY', value: 'Strict Context Separation' },
      { label: 'EXPOSURE RULE', value: 'Zero Peer Cross-Exposure' },
    ],
    badgeColor: 'text-indigo-300 bg-indigo-950/80 border-indigo-800',
    borderColor: 'border-indigo-500/80',
  },
  {
    id: 'audit-trail',
    num: '04',
    name: 'AUDIT TRAIL',
    title: 'Audit Trail',
    status: 'SIMULATED SECURITY FLOW',
    icon: FileCheck2,
    detail: 'Operational events can be represented as traceable workflow activity.',
    flowText: '09:41 REQUEST EVENT → 09:43 REVIEW EVENT → 09:47 RECORD EVENT',
    miniUiTitle: 'TRACEABLE WORKFLOW TIMELINE',
    specs: [
      { label: 'LOG TYPE', value: 'Operational Activity Trace' },
      { label: 'EVENT SEQUENCE', value: 'Timestamped Audit Log' },
      { label: 'TRACKED SCOPE', value: 'Submissions & Decisions' },
      { label: 'TRACEABILITY', value: 'Structured Timeline Stream' },
    ],
    badgeColor: 'text-emerald-300 bg-emerald-950/80 border-emerald-800',
    borderColor: 'border-emerald-500/80',
  },
];

const AUDIT_FLOW_STEPS = [
  {
    num: '01',
    title: 'IDENTITY VERIFIED',
    status: 'ACCESS BOUNDARY',
    actor: 'AUTHENTICATION GATE',
    detail: 'User identity verified at authentication boundary before workspace entry.',
  },
  {
    num: '02',
    title: 'ROLE CHECKED',
    status: 'ROLE-BASED ACCESS',
    actor: 'AUTHORIZATION GUARD',
    detail: 'Assigned user role checked for target workspace access privileges.',
  },
  {
    num: '03',
    title: 'ACCESS BOUNDARY',
    status: 'WORKSPACE BOUNDARIES',
    actor: 'WORKSPACE SCOPER',
    detail: 'Role-based access boundary applied to personal, team, or organization workspace context.',
  },
  {
    num: '04',
    title: 'WORKFLOW EVENT',
    status: 'WORKFLOW VALIDATED',
    actor: 'POLICY VALIDATOR',
    detail: 'Operational leave workflow rules and policy criteria evaluated.',
  },
  {
    num: '05',
    title: 'TRACE ENTRY',
    status: 'TRACE RECORDED',
    actor: 'TIMELINE LEDGER',
    detail: 'Structured event trace entry generated for workforce activity audit stream.',
  },
];

const SecurityGovernanceSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
  
  // Interactive layer selection (01 Identity by default)
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  // VIEW AUDIT FLOW modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalStep, setActiveModalStep] = useState(0);
  const [isAutoPlayingModal, setIsAutoPlayingModal] = useState(false);

  // Escape key handler for accessible modal closing
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      setIsAutoPlayingModal(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  // Modal auto-play animation runner
  useEffect(() => {
    let timer = null;
    if (isAutoPlayingModal && isModalOpen) {
      timer = setInterval(() => {
        setActiveModalStep((prev) => {
          if (prev >= AUDIT_FLOW_STEPS.length - 1) {
            setIsAutoPlayingModal(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlayingModal, isModalOpen]);

  const handleOpenModal = () => {
    setActiveModalStep(0);
    setIsAutoPlayingModal(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAutoPlayingModal(false);
    setIsModalOpen(false);
  };

  const activeLayer = ARCHITECTURE_LAYERS[activeLayerIndex] || ARCHITECTURE_LAYERS[0];
  const currentModalStep = AUDIT_FLOW_STEPS[activeModalStep] || AUDIT_FLOW_STEPS[0];

  return (
    <section
      id="security"
      ref={sectionRef}
      className="w-full py-20 sm:py-24 bg-[#030712] relative border-b border-slate-800/80 overflow-hidden text-slate-100"
    >
      {/* 1. Architectural Grid Overlay */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" />

      {/* 2. Atmospheric Lighting Glow */}
      <div className="absolute top-1/4 left-1/4 w-[36rem] h-[36rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
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
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                SECURITY ARCHITECTURE
              </span>
              <span className="text-slate-600 font-mono text-xs">•</span>
              <span className="font-mono text-[11px] text-slate-300 font-semibold tracking-wider uppercase">
                05 / 06 • SECURITY ARCHITECTURE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-[-0.03em] leading-[1.12]">
              Security controls built into every layer.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-normal">
              Explore the access and operational boundaries that shape the ELMS experience.
            </p>
          </div>

          {/* Header Status Indicators */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0 font-mono text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold shadow-xs">
              SECURITY ARCHITECTURE PREVIEW
            </span>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xs text-slate-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>● CONTROL LAYERS DEFINED</span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* FOUR-LAYER ARCHITECTURE GRID (Desktop Horizontal / Mobile Vertical) */}
        {/* ================================================================ */}
        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mb-10">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const LayerIcon = layer.icon;
            const isSelected = idx === activeLayerIndex;

            return (
              <div
                key={layer.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Layer ${layer.num}: ${layer.title}`}
                onClick={() => setActiveLayerIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveLayerIndex(idx);
                  }
                }}
                className={`p-6 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none select-none relative z-10 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? `bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070e24] border-2 ${layer.borderColor} shadow-xl shadow-sky-950/50 ring-1 ring-sky-400/20 -translate-y-1`
                    : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1324] shadow-md hover:-translate-y-0.5 opacity-85 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Header: Layer Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xl font-black text-slate-400">
                        {layer.num}
                      </span>
                      <span
                        className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          isSelected ? layer.badgeColor : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {isSelected ? '● ACTIVE LAYER' : `STEP ${layer.num} / 04`}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shadow-xs">
                      <LayerIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {layer.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5 font-normal">
                    {layer.detail}
                  </p>
                </div>

                {/* Layer Specific Mini Visual Component */}
                <div>
                  {/* Layer 01 Mini UI: IDENTITY GATE */}
                  {layer.id === 'identity' && (
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-[10px]">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                        <span className="font-bold text-slate-200 uppercase tracking-wider">IDENTITY GATE</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-sky-950/80 text-sky-300 border-sky-800 uppercase">
                          {layer.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 text-[10px] py-1 font-semibold">
                        <span>USER</span>
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                        <span>AUTHENTICATION</span>
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                        <span>WORKSPACE ACCESS</span>
                      </div>
                    </div>
                  )}

                  {/* Layer 02 Mini UI: ACCESS CONTROL */}
                  {layer.id === 'access-control' && (
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-[10px] space-y-1.5">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-1">
                        <span className="font-bold text-slate-200 uppercase tracking-wider">ROLE ROUTING</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-800 uppercase">
                          {layer.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>EMPLOYEE</span>
                        <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-amber-300 font-bold">EMPLOYEE WORKSPACE</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>MANAGER</span>
                        <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-amber-300 font-bold">MANAGER WORKSPACE</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>ADMIN / HR</span>
                        <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-amber-300 font-bold">ADMIN WORKSPACE</span>
                      </div>
                    </div>
                  )}

                  {/* Layer 03 Mini UI: DATA ISOLATION */}
                  {layer.id === 'data-isolation' && (
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-[10px] space-y-1.5">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-1">
                        <span className="font-bold text-slate-200 uppercase tracking-wider">WORKSPACE BOUNDARIES</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-indigo-950/80 text-indigo-300 border-indigo-800 uppercase">
                          {layer.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>EMPLOYEE DATA</span>
                        <span className="text-slate-600">────────</span>
                        <span className="text-indigo-300 font-bold">PERSONAL WORKSPACE</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>MANAGER DATA</span>
                        <span className="text-slate-600">────────</span>
                        <span className="text-indigo-300 font-bold">TEAM WORKSPACE</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-300">
                        <span>ADMIN DATA</span>
                        <span className="text-slate-600">────────</span>
                        <span className="text-indigo-300 font-bold">ORGANIZATION WORKSPACE</span>
                      </div>
                    </div>
                  )}

                  {/* Layer 04 Mini UI: AUDIT TRAIL */}
                  {layer.id === 'audit-trail' && (
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-[10px]">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-1.5">
                        <span className="font-bold text-slate-200 uppercase tracking-wider">TIMELINE STREAM</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-800 uppercase">
                          {layer.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-[9px]">
                        <div className="flex justify-between text-slate-300">
                          <span className="text-emerald-400 font-bold">09:41</span>
                          <span>REQUEST EVENT</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-emerald-400 font-bold">09:43</span>
                          <span>REVIEW EVENT</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-emerald-400 font-bold">09:47</span>
                          <span>RECORD EVENT</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer status bar */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-3 mt-3 border-t border-slate-800/80">
                    <span className="text-slate-300 font-semibold">{layer.status}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE
                    </span>
                  </div>
                </div>

                {/* Desktop Horizontal Connectors */}
                {idx < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-6 pointer-events-none">
                    <div className="relative w-full flex items-center justify-center">
                      <div className="w-full h-[2px] bg-slate-800">
                        <div
                          className={`h-full bg-sky-400 transition-all duration-500 ease-out ${
                            activeLayerIndex > idx ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                          activeLayerIndex > idx ? 'border-sky-400 text-sky-300' : 'border-slate-800 text-slate-600'
                        }`}
                      >
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Vertical Connectors */}
                {idx < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="lg:hidden flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 h-6 pointer-events-none">
                    <div className="relative h-full flex flex-col items-center justify-center">
                      <div className="w-[2px] h-full bg-slate-800">
                        <div
                          className={`w-full bg-sky-400 transition-all duration-500 ease-out ${
                            activeLayerIndex > idx ? 'h-full' : 'h-0'
                          }`}
                        />
                      </div>
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-slate-950 border transition-colors shadow-md flex items-center justify-center ${
                          activeLayerIndex > idx ? 'border-sky-400 text-sky-300' : 'border-slate-800 text-slate-600'
                        }`}
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* ACTIVE CONTROL DETAIL PANEL                                      */}
        {/* ================================================================ */}
        <div
          style={{ transitionDelay: isInView ? '350ms' : '0ms' }}
          className={`mb-10 p-6 sm:p-7 rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl font-mono transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Panel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-bold uppercase tracking-wider">
                CONTROL LAYER
              </span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                {activeLayer.num} — {activeLayer.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
                CONCEPTUAL CONTROL
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded">
                {activeLayer.status}
              </span>
            </div>
          </div>

          {/* Panel Content Body */}
          <div className="pt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            <div className="lg:col-span-2">
              <h4 className="text-base font-bold text-white mb-2 font-mono">
                {activeLayer.name} CONTROL SPECIFICATION
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-normal">
                {activeLayer.detail}
              </p>

              {/* Visual Flow Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-xs text-sky-300 font-semibold mb-4">
                <span className="text-slate-500 text-[10px] block uppercase font-mono mb-1">VISUAL ARCHITECTURE FLOW</span>
                {activeLayer.flowText}
              </div>

              {/* 4 Technical Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[10px]">
                {activeLayer.specs.map((sp, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block uppercase font-bold text-[9px] mb-0.5">{sp.label}</span>
                    <span className="text-slate-200 font-semibold block truncate">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Right Side CTA: VIEW AUDIT FLOW → */}
            <div className="flex flex-col justify-between p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono">
              <div>
                <span className="text-xs font-bold text-white block mb-1">
                  SECURITY FLOW PREVIEW
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                  Step through the simulated multi-layer request verification flow.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenModal}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white shadow-md shadow-sky-950/50 border border-sky-400/30 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-sky-200 fill-sky-200" />
                <span>VIEW AUDIT FLOW →</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3 SECURITY PRINCIPLES                                           */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Principle 01 */}
          <div className="p-6 rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 shadow-md">
            <div className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
              CONTROLLED ACCESS
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              "Access boundaries are defined by application roles."
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Application workflows restrict actions based on explicitly defined user roles.
            </p>
          </div>

          {/* Principle 02 */}
          <div className="p-6 rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 shadow-md">
            <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              SEPARATED WORKSPACES
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              "Different application roles operate within distinct workspace contexts."
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Employee, manager, and administrative capabilities run in segregated workspace boundaries.
            </p>
          </div>

          {/* Principle 03 */}
          <div className="p-6 rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 shadow-md">
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              TRACEABLE OPERATIONS
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              "Workflow activity can be represented as a structured process trace."
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Operational actions generate structured timeline records for audit and compliance visibility.
            </p>
          </div>
        </div>

      </div>

      {/* ================================================================ */}
      {/* VIEW AUDIT FLOW MODAL / OVERLAY                                   */}
      {/* ================================================================ */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="security-flow-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h3 id="security-flow-modal-title" className="text-base font-bold text-white tracking-tight">
                    SECURITY FLOW PREVIEW
                  </h3>
                </div>
                <span className="text-[10px] text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800 font-bold uppercase mt-1 inline-block">
                  SIMULATED SECURITY FLOW
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close security flow modal"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Step Indicators (01 to 05) */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {AUDIT_FLOW_STEPS.map((st, idx) => {
                const isActive = idx === activeModalStep;
                const isPassed = idx < activeModalStep;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      setIsAutoPlayingModal(false);
                      setActiveModalStep(idx);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-950/90 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/20'
                        : isPassed
                        ? 'bg-slate-900/90 border-emerald-800/80 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] mb-1 font-bold">
                      <span>{st.num}</span>
                      {isPassed ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      ) : null}
                    </div>
                    <div className="text-[9px] font-bold truncate">
                      {st.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Spec Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 mb-6">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3 text-xs">
                <span className="font-bold text-sky-300">
                  STEP {currentModalStep.num}: {currentModalStep.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                  {currentModalStep.status}
                </span>
              </div>

              <div className="text-xs font-bold text-white mb-2">
                ACTOR: {currentModalStep.actor}
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {currentModalStep.detail}
              </p>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveModalStep(0);
                  setIsAutoPlayingModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>REPLAY SEQUENCE</span>
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-bold transition-colors cursor-pointer"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default SecurityGovernanceSection;
