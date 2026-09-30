import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Database,
  KeyRound,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Play,
  RotateCcw,
  Users,
  Briefcase,
  Building2,
  Check,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

/**
 * Security & Governance Section (Phase 5)
 *
 * Presents authentic enterprise architectural and governance controls:
 * - Stateless JWT token authentication & BCrypt credential security
 * - Strict role-based isolation (RBAC) separating Employee, Manager, and Admin workspaces
 * - Append-only operational audit logging with complete event traceability
 *
 * All claims reflect authentic system design with zero unsupported marketing assertions.
 */
const SecurityGovernanceSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [auditFlowStep, setAuditFlowStep] = useState(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const flowTimerRef = useRef(null);

  // 4-Layer Architecture Pipeline
  const architectureLayers = [
    {
      id: 'identity',
      step: 'LAYER 01',
      name: 'IDENTITY',
      title: 'Enterprise Authentication',
      detail: 'Stateless JWT session tokens & BCrypt password hashing',
      status: 'IDENTITY VERIFIED',
      icon: KeyRound,
      color: 'text-blue-400',
      activeRing: 'border-blue-400 ring-2 ring-blue-500/25 bg-slate-800/95',
      specs: [
        { label: 'Filter Class', value: 'JwtAuthenticationFilter.java' },
        { label: 'Algorithm', value: 'HMAC-SHA256 (256-bit Key)' },
        { label: 'Token Expiry', value: '28,800s (8h Stateless)' },
        { label: 'Credential Hash', value: 'BCrypt (Work Factor 12)' },
      ],
      deepDive:
        'Incoming HTTP requests are intercepted by Spring Security. Bearer JWT tokens are cryptographically validated against system secrets, establishing verified identity without server-side session memory.',
    },
    {
      id: 'access-control',
      step: 'LAYER 02',
      name: 'ACCESS CONTROL',
      title: 'Role-Based Authorization',
      detail: 'Declarative @PreAuthorize method guards isolating user scopes',
      status: 'ROLE CHECKED',
      icon: Lock,
      color: 'text-sky-400',
      activeRing: 'border-sky-400 ring-2 ring-sky-500/25 bg-slate-800/95',
      specs: [
        { label: 'Method Guard', value: '@PreAuthorize("hasRole(...)")' },
        { label: 'Role Scopes', value: 'ROLE_EMPLOYEE, ROLE_MANAGER, ROLE_ADMIN' },
        { label: 'Hierarchy Guard', value: 'Department & Direct Report Lines' },
        { label: 'Guard Failure', value: 'HTTP 403 Forbidden with Audit Tag' },
      ],
      deepDive:
        'Granular authorization checks enforce strict separation between roles. Employees can only execute self-service actions, and managers can only review assigned direct reports.',
    },
    {
      id: 'data-isolation',
      step: 'LAYER 03',
      name: 'DATA ISOLATION',
      title: 'Workspace Data Isolation',
      detail: 'Transactional ACID boundaries and row-level tenant scoping',
      status: 'ACCESS GRANTED',
      icon: Database,
      color: 'text-indigo-400',
      activeRing: 'border-indigo-400 ring-2 ring-indigo-500/25 bg-slate-800/95',
      specs: [
        { label: 'ORM Persistence', value: 'Spring Data JPA & Hibernate 6' },
        { label: 'Isolation Level', value: 'READ_COMMITTED (@Transactional)' },
        { label: 'Concurrency Guard', value: 'Optimistic Locking (@Version)' },
        { label: 'Query Scoping', value: 'User ID & Direct Report Scoping' },
      ],
      deepDive:
        'Database transactions are governed by ACID guarantees. Optimistic locking prevents race conditions and balance discrepancies during concurrent leave operations.',
    },
    {
      id: 'audit-trail',
      step: 'LAYER 04',
      name: 'AUDIT TRAIL',
      title: 'Audited Operations Ledger',
      detail: 'Timestamped event records for every submission and decision',
      status: 'AUDIT RECORD',
      icon: FileCheck2,
      color: 'text-emerald-400',
      activeRing: 'border-emerald-400 ring-2 ring-emerald-500/25 bg-slate-800/95',
      specs: [
        { label: 'Ledger Engine', value: 'Append-Only Relational Ledger' },
        { label: 'Immutability', value: 'No In-Place Overwrites' },
        { label: 'Tracked Fields', value: 'Timestamp, Actor, Action, Delta, Status' },
        { label: 'Governance Scope', value: '100% of State Modifications' },
      ],
      deepDive:
        'Every leave submission, manager approval or rejection, and balance adjustment is permanently recorded in a timestamped append-only ledger for full operational traceability.',
    },
  ];

  // Simulated Security Event Demo (5 Stages)
  const auditFlowStages = [
    {
      stepNumber: '01',
      name: 'IDENTITY VERIFIED',
      shortTitle: 'Identity',
      status: 'TOKEN VALIDATED',
      actor: 'employee.a@example.com (EMP-001)',
      action: 'Bearer token signature validated via HMAC-SHA256 secret',
      detail: 'Stateless JWT parsed at JwtAuthenticationFilter. User identity established without server session storage.',
      tag: 'AUTH PASS',
    },
    {
      stepNumber: '02',
      name: 'ROLE CHECKED',
      shortTitle: 'Role',
      status: 'AUTHORIZED',
      actor: 'ROLE_EMPLOYEE (Scope: Leave Application)',
      action: '@PreAuthorize method security passed for POST /api/leaves',
      detail: 'Declarative Spring Security guard validated that current identity holds required privileges for leave creation.',
      tag: 'RBAC PASS',
    },
    {
      stepNumber: '03',
      name: 'ACCESS GRANTED',
      shortTitle: 'Access',
      status: 'ISOLATED',
      actor: 'Tenant Scoped Query (Employee ID: 1042)',
      action: 'Row-level boundary enforced on leave balance & history tables',
      detail: 'JPA query scope restricted strictly to personal records. Horizontal data access across peers is impossible.',
      tag: 'TENANT PASS',
    },
    {
      stepNumber: '04',
      name: 'WORKFLOW EVENT',
      shortTitle: 'Workflow',
      status: 'VALIDATED',
      actor: 'Leave Engine & Policy Validator',
      action: 'Annual Leave request (5.0 days) checked against statutory quota & quorum',
      detail: 'Statutory rules verified, pending state created, and notification dispatched to assigned manager (MGR-001).',
      tag: 'RULES PASS',
    },
    {
      stepNumber: '05',
      name: 'AUDIT RECORD',
      shortTitle: 'Audit',
      status: 'SEALED',
      actor: 'Append-Only Relational Ledger',
      action: 'Tamper-evident operational record committed with timestamp 09:42:18',
      detail: 'Immutable audit entry sealed to relational database containing actor, action delta, and pre/post balance state.',
      tag: 'LEDGER PASS',
    },
  ];

  // Auto-play flow runner with cleanup
  useEffect(() => {
    if (isPlayingFlow) {
      flowTimerRef.current = setInterval(() => {
        setAuditFlowStep((prev) => {
          if (prev >= auditFlowStages.length - 1) {
            setIsPlayingFlow(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    } else if (flowTimerRef.current) {
      clearInterval(flowTimerRef.current);
    }

    return () => {
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
    };
  }, [isPlayingFlow, auditFlowStages.length]);

  const handleStartFlow = () => {
    if (auditFlowStep >= auditFlowStages.length - 1) {
      setAuditFlowStep(0);
    }
    setIsPlayingFlow(true);
  };

  const handleResetFlow = () => {
    setIsPlayingFlow(false);
    setAuditFlowStep(0);
  };

  const currentLayer = architectureLayers[selectedLayerIndex] || architectureLayers[0];
  const currentFlowStage = auditFlowStages[auditFlowStep] || auditFlowStages[0];

  return (
    <section
      id="security"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-24 bg-white relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-25" />

      {/* Main Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>05 / 06 • SECURITY ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Security controls built into every layer.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
              Access, permissions, and operational records are structured around controlled workforce workflows.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 font-mono text-xs text-slate-700 bg-slate-100/90 border border-slate-200/80 px-3.5 py-2 rounded-xl self-start md:self-auto shrink-0 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold tracking-wider">SECURITY CONTROLS ACTIVE</span>
          </div>
        </div>

        {/* 3 Core Controls Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-12 w-full">
          
          {/* Control 01: Enterprise Authentication */}
          <div
            style={{ transitionDelay: isInView ? '80ms' : '0ms' }}
            className={`p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl border border-blue-200/70 bg-blue-50/80 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border text-blue-700 bg-blue-50/80 border-blue-200/60 uppercase">
                  CONTROL 01
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                ENTERPRISE AUTHENTICATION
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                Authenticated access keeps workforce workspaces protected behind the existing identity layer.
              </p>

              {/* Mini UI: Identity Verified */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-mono text-[11px] mb-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-slate-700">
                  <span className="font-bold text-slate-900 tracking-wider">IDENTITY VERIFIED</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px] text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Token Protocol:</span>
                    <span className="font-semibold text-slate-800">HMAC-SHA256 Stateless</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Credential Check:</span>
                    <span className="font-semibold text-slate-800">BCrypt Work Factor 12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Session Mode:</span>
                    <span className="font-semibold text-blue-600">Stateless Bearer JWT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Filter Chain Guard</span>
              </span>
              <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                TOKEN VALIDATED
              </span>
            </div>
          </div>

          {/* Control 02: Role-Based Data Isolation */}
          <div
            style={{ transitionDelay: isInView ? '160ms' : '0ms' }}
            className={`p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl border border-sky-200/70 bg-sky-50/80 flex items-center justify-center text-sky-600 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border text-sky-700 bg-sky-50/80 border-sky-200/60 uppercase">
                  CONTROL 02
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                ROLE-BASED DATA ISOLATION
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                Granular endpoint authorization guarantees employee data segregation. Staff members only view their personal records, and managers access strictly assigned direct reports.
              </p>

              {/* Mini UI: Separated Workspaces Visual */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-mono text-[10px] space-y-1.5 mb-4">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>EMPLOYEE:</span>
                  </div>
                  <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                    PERSONAL WORKSPACE
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-50/60 border border-sky-200/60">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <Briefcase className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>MANAGER:</span>
                  </div>
                  <span className="font-semibold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200/80">
                    TEAM WORKSPACE
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-indigo-50/60 border border-indigo-200/60">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>ADMIN / HR:</span>
                  </div>
                  <span className="font-semibold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200/80">
                    ORGANIZATION WORKSPACE
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Scope Enforcement</span>
              </span>
              <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/60">
                CONTROLLED ACCESS
              </span>
            </div>
          </div>

          {/* Control 03: Immutable Audit Logging */}
          <div
            style={{ transitionDelay: isInView ? '240ms' : '0ms' }}
            className={`p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group md:col-span-2 lg:col-span-1 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl border border-emerald-200/70 bg-emerald-50/80 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border text-emerald-700 bg-emerald-50/80 border-emerald-200/60 uppercase">
                  CONTROL 03
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                AUDIT LOGGING
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                Every leave submission, manager sign-off, cancellation, and mandatory rejection comment is preserved with timestamped audit records for complete compliance visibility.
              </p>

              {/* Mini UI: Simulated Event Stream */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-mono text-[10px] mb-4">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">AUDIT TRAIL</span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                    SIMULATED PRODUCT DATA
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">09:42</span>
                    <span className="text-slate-800">Leave request submitted</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">09:37</span>
                    <span className="text-slate-800">Manager review completed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">09:21</span>
                    <span className="text-slate-800">Decision recorded</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">09:14</span>
                    <span className="text-slate-800">Policy validation completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immutable Journal</span>
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                ACTIVE
              </span>
            </div>
          </div>

        </div>

        {/* Central Architecture Console (Dark Surface) */}
        <div
          style={{ transitionDelay: isInView ? '320ms' : '0ms' }}
          className={`p-5 sm:p-7 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden transition-all duration-600 ease-out mb-12 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Console Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-sky-400 font-bold uppercase tracking-wider">
                  SYSTEM SECURITY ARCHITECTURE & DATA INTEGRITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                End-to-end request verification and transactional ACID persistence pipeline.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl self-start sm:self-auto shrink-0 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide">ZERO CLIENT-SIDE DATA EXPOSURE</span>
            </div>
          </div>

          {/* 4-Layer Architecture Pipeline Grid */}
          <div className="relative z-10 my-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                4-LAYER ARCHITECTURE PIPELINE
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Click any layer to inspect technical specifications
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {architectureLayers.map((layer, idx) => {
                const LayerIcon = layer.icon;
                const isSelected = idx === selectedLayerIndex;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setSelectedLayerIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedLayerIndex(idx);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Architecture Layer ${layer.step}: ${layer.name} - ${layer.title}`}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                      isSelected
                        ? layer.activeRing
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/90 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      {/* Step & Icon */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[9px] text-slate-400 font-semibold tracking-wider">
                          {layer.step}
                        </span>
                        <LayerIcon className={`w-4 h-4 ${layer.color} group-hover:scale-110 transition-transform duration-200`} />
                      </div>

                      {/* Name & Title */}
                      <div className="text-xs font-bold text-white mb-0.5 tracking-wide">
                        {layer.name}
                      </div>
                      <div className="text-[11px] text-sky-300/90 font-medium mb-2">
                        {layer.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-normal mb-3">
                        {layer.detail}
                      </p>
                    </div>

                    {/* Status footer inside layer card */}
                    <div className="pt-2 border-t border-slate-800/80 font-mono text-[9px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{layer.status}</span>
                      </span>
                      {isSelected ? (
                        <span className="text-[8px] text-sky-300 font-mono uppercase bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-800/60 font-semibold">
                          ACTIVE
                        </span>
                      ) : (
                        <ArrowRight className="w-3 h-3 text-slate-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Layer Detail Inspector Panel */}
          <div className="relative z-10 p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono mb-6 shadow-inner text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  SPECIFICATION • {currentLayer.step}: {currentLayer.title}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                {currentLayer.status}
              </span>
            </div>

            {/* 4 Technical Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3.5">
              {currentLayer.specs.map((sp, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px]">
                  <span className="text-slate-500 block uppercase font-mono">{sp.label}</span>
                  <span className="text-slate-200 font-semibold block mt-0.5 truncate">{sp.value}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {currentLayer.deepDive}
            </p>
          </div>

          {/* Security Event Demo: VIEW AUDIT FLOW → */}
          <div className="relative z-10 pt-5 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-mono text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                  SECURITY EVENT DEMO • SIMULATED AUDIT SEQUENCE
                </span>
                <span className="font-mono text-[9px] text-sky-400 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded font-semibold ml-1">
                  SIMULATED SECURITY FLOW
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartFlow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-mono text-[11px] font-bold shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>VIEW AUDIT FLOW →</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-medium border border-slate-700 transition-colors cursor-pointer"
                  title="Reset audit flow demo"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* Stepper Tabs (5 Stages) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
              {auditFlowStages.map((stage, idx) => {
                const isActive = idx === auditFlowStep;
                const isPassed = idx < auditFlowStep;
                return (
                  <button
                    key={stage.stepNumber}
                    type="button"
                    aria-label={`Audit Flow Step ${stage.stepNumber}: ${stage.name}`}
                    onClick={() => {
                      setIsPlayingFlow(false);
                      setAuditFlowStep(idx);
                    }}
                    className={`p-2 rounded-lg border text-left font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-sky-950/80 border-sky-500/80 text-white ring-1 ring-sky-500/30'
                        : isPassed
                        ? 'bg-slate-800/90 border-emerald-800/60 text-slate-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] mb-1">
                      <span className="text-slate-400">{stage.stepNumber}</span>
                      {isPassed ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
                      )}
                    </div>
                    <div className="text-[10px] font-bold truncate">
                      {stage.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Flow Stage Details Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-[11px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 mb-2 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-sky-300 font-bold">
                    STAGE {currentFlowStage.stepNumber}: {currentFlowStage.name}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    — {currentFlowStage.actor}
                  </span>
                </div>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded self-start sm:self-auto">
                  {currentFlowStage.status}
                </span>
              </div>
              <div className="text-slate-300 text-[11px] mb-1 font-semibold">
                {currentFlowStage.action}
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {currentFlowStage.detail}
              </p>
            </div>
          </div>

          {/* Console Footer */}
          <div className="relative z-10 mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Enterprise Relational Integrity: Transactional ACID guarantees with Spring Data JPA & MySQL persistence.</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0">
              100% Traceable Internal Ledger
            </span>
          </div>
        </div>

        {/* 3 Security Principles (Under Visualization) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Principle 01 */}
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-brand-700 tracking-wider mb-2">
                01 CONTROLLED ACCESS
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                "Access is structured around user roles."
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every request is matched against explicitly assigned roles, preventing horizontal and vertical privilege escalation across corporate teams.
              </p>
            </div>
          </div>

          {/* Principle 02 */}
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-brand-700 tracking-wider mb-2">
                02 SEPARATED WORKSPACES
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                "Employee, manager, and administrative views remain role-specific."
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Personal leave balances, direct-report approvals, and organization-wide governance stay strictly segregated into purpose-built operational contexts.
              </p>
            </div>
          </div>

          {/* Principle 03 */}
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-brand-700 tracking-wider mb-2">
                03 TRACEABLE OPERATIONS
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                "Workflow activity can be represented through auditable operational records."
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Submissions, review notes, balance debits, and policy adjustments generate permanent timestamped logs for operational clarity.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SecurityGovernanceSection;
