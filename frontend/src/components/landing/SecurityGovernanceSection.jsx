import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Database,
  KeyRound,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

/**
 * Security & Governance Section
 * Presents authentic enterprise architectural and governance controls:
 * - Stateless JWT token authentication
 * - Strict role-based isolation (RBAC)
 * - Tamper-evident transaction logging
 */
const SecurityGovernanceSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.12, triggerOnce: true });
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);

  const securityPillars = [
    {
      icon: KeyRound,
      step: '01 • AUTHENTICATION',
      title: 'Enterprise Authentication',
      layerLabel: 'Layer 01 • Stateless Ingress',
      description:
        'Cryptographic BCrypt hashing paired with signed, stateless JWT session tokens. Automated expiration policies enforce strict session integrity across corporate devices.',
      tag: 'JWT SESSION BOUND',
      badgeColor: 'text-blue-700 bg-blue-50/70 border-blue-200/60',
      iconWrapper: 'bg-blue-50/70 border-blue-200/60 text-blue-600',
      statusText: 'Filter Chain Validation',
      statusTag: 'ENFORCED',
    },
    {
      icon: Lock,
      step: '02 • AUTHORIZATION',
      title: 'Role-Based Data Isolation',
      layerLabel: 'Layer 02 • Access Control',
      description:
        'Granular endpoint authorization guarantees employee data segregation. Staff members only view their personal records, and managers access strictly assigned direct reports.',
      tag: 'RBAC ENFORCED',
      badgeColor: 'text-sky-700 bg-sky-50/70 border-sky-200/60',
      iconWrapper: 'bg-sky-50/70 border-sky-200/60 text-sky-600',
      statusText: 'Pre-Authorize Method Guard',
      statusTag: 'ENFORCED',
      isCenter: true,
    },
    {
      icon: FileCheck2,
      step: '03 • AUDITABILITY',
      title: 'Immutable Audit Logging',
      layerLabel: 'Layer 03 • Compliance Ledger',
      description:
        'Every leave submission, manager sign-off, cancellation, and mandatory rejection comment is preserved with timestamped audit records for complete compliance visibility.',
      tag: 'AUDIT TRACEABLE',
      badgeColor: 'text-emerald-700 bg-emerald-50/70 border-emerald-200/60',
      iconWrapper: 'bg-emerald-50/70 border-emerald-200/60 text-emerald-600',
      statusText: 'Immutable Append-Only Log',
      statusTag: 'ACTIVE',
    },
  ];

  const architectureNodes = [
    {
      step: '01 • INGRESS',
      title: 'JWT Auth Filter',
      detail: 'Cryptographic signature verification & BCrypt token validation',
      status: 'TOKEN VALIDATED',
      icon: KeyRound,
      color: 'text-blue-400',
      activeBorder: 'border-blue-400 ring-2 ring-blue-500/25 bg-slate-800/95',
      specs: [
        { label: 'Filter Class', value: 'JwtAuthenticationFilter.java' },
        { label: 'Algorithm', value: 'HMAC-SHA256 (256-bit Key)' },
        { label: 'Token Expiry', value: '28,800s (8h Stateless)' },
        { label: 'Hashing', value: 'BCrypt (Work Factor 12)' },
      ],
      deepDive: 'Intercepts incoming Authorization bearer header, cryptographically verifies HMAC-SHA256 signature against system secret, extracts role claims, and populates SecurityContext without server-side session memory.',
    },
    {
      step: '02 • POLICY',
      title: 'RBAC Enforcement',
      detail: '@PreAuthorize method security strictly isolating user scopes',
      status: 'SCOPE VERIFIED',
      icon: Lock,
      color: 'text-sky-400',
      activeBorder: 'border-sky-400 ring-2 ring-sky-500/25 bg-slate-800/95',
      specs: [
        { label: 'Annotation', value: '@PreAuthorize("hasRole(...)")' },
        { label: 'Role Scopes', value: 'ROLE_EMPLOYEE, ROLE_MANAGER, ROLE_ADMIN' },
        { label: 'Data Boundary', value: 'Tenant ID & Sub-Tree Hierarchy' },
        { label: 'Guard Fail', value: 'HTTP 403 Forbidden with Audit Tag' },
      ],
      deepDive: 'Enforces declarative method-level authorization. Employees are isolated to their personal tenant record, and managers access only assigned direct reports.',
    },
    {
      step: '03 • STORAGE',
      title: 'Database Isolation',
      detail: 'Spring Data JPA & MySQL row-level isolation preventing leakage',
      status: 'ACID BOUND',
      icon: Database,
      color: 'text-indigo-400',
      activeBorder: 'border-indigo-400 ring-2 ring-indigo-500/25 bg-slate-800/95',
      specs: [
        { label: 'ORM Engine', value: 'Hibernate 6.x / Spring Data JPA' },
        { label: 'Engine', value: 'MySQL 8.x InnoDB (ACID Compliant)' },
        { label: 'Concurrency', value: 'Optimistic Locking (@Version)' },
        { label: 'Transaction', value: '@Transactional(isolation = READ_COMMITTED)' },
      ],
      deepDive: 'Guarantees transactional atomicity across balance recalculations, preventing double-booking and race conditions during simultaneous employee leave submissions.',
    },
    {
      step: '04 • AUDIT',
      title: 'Traceable Journal',
      detail: 'Timestamped event record for every balance debit and decision',
      status: 'COMMITTED',
      icon: FileCheck2,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-500/25 bg-slate-800/95',
      specs: [
        { label: 'Log Type', value: 'Append-Only Relational Ledger' },
        { label: 'Immutability', value: 'No In-Place Overwrites' },
        { label: 'Audit Fields', value: 'Timestamp, ActorID, Action, Delta, PostBalance' },
        { label: 'Compliance', value: 'SOC-2 / ISO-27001 Readiness' },
      ],
      deepDive: 'Permanently persists tamper-evident historical audit entries for every leave event, manager review note, and statutory recalculation for compliance tracing.',
    },
  ];

  // Feature 7: Simulated Sequential Audit Verification Stream
  const auditStreamEvents = [
    { time: '09:42:18', event: 'LEAVE_REQUEST_CREATED', detail: 'Annual Paid (5.0d) by Emp#1042', status: 'VERIFIED', delay: '120ms' },
    { time: '09:42:21', event: 'POLICY_VALIDATED', detail: 'Statutory balance checked (18.5d)', status: 'COMPLIANT', delay: '240ms' },
    { time: '09:42:25', event: 'MANAGER_ASSIGNED', detail: 'Direct report line bound to M#308', status: 'DISPATCHED', delay: '360ms' },
    { time: '09:43:02', event: 'APPROVAL_RECORDED', detail: 'Team quorum verified (94% capacity)', status: 'SIGNED', delay: '480ms' },
    { time: '09:43:04', event: 'BALANCE_RECALCULATED', detail: 'Personal ledger adjusted (-5.0d)', status: 'SETTLED', delay: '600ms' },
    { time: '09:43:05', event: 'AUDIT_EVENT_COMMITTED', detail: 'Tamper-evident record sealed to MySQL', status: 'IMMUTABLE', delay: '720ms' },
  ];

  const currentNode = architectureNodes[selectedNodeIndex] || architectureNodes[0];

  return (
    <section
      id="security"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-white relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header (Storytelling 05 / 06) */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>05 / 06 • IMMUTABLE AUDIT VERIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Rigorous security controls built into the core.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
              SkillMate enforces stateless token authentication, database-level role isolation, and tamper-evident audit logs to safeguard internal workforce transactions.
            </p>
          </div>

          {/* Enterprise Compliance Status Badge */}
          <div className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100/80 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start md:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE AUDIT ACTIVE</span>
          </div>
        </div>

        {/* 3 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-8 w-full">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                style={{ transitionDelay: isInView ? `${idx * 100 + 60}ms` : '0ms' }}
                className={`p-5 sm:p-6 rounded-2xl bg-slate-50/80 border ${
                  pillar.isCenter
                    ? 'border-slate-200/90 ring-1 ring-sky-500/10 shadow-2xs hover:border-sky-300'
                    : 'border-slate-200/80 shadow-2xs hover:border-slate-300'
                } hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between group ${
                  idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                } ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div>
                  {/* Card Header: Icon + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${pillar.iconWrapper} shadow-2xs group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-mono text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded border ${pillar.badgeColor}`}>
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title & Layer */}
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">
                    {pillar.title}
                  </h3>
                  <div className="font-mono text-[10px] text-slate-500 mb-2">
                    {pillar.layerLabel}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Status Row */}
                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pillar.statusText}</span>
                  </div>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    {pillar.statusTag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Large Dark Console: Architecture Flow OR Audit Stream */}
        <div
          style={{ transitionDelay: isInView ? '380ms' : '0ms' }}
          className={`p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md relative overflow-hidden transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Console Top Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  SYSTEM SECURITY ARCHITECTURE & DATA INTEGRITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                End-to-end request verification and transactional ACID persistence pipeline.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ZERO CLIENT-SIDE DATA EXPOSURE</span>
            </div>
          </div>

          {/* 4-Step Architectural Pipeline & Audit Log Stream */}
          <div>
            {/* 4-Step Architectural Pipeline */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
              {architectureNodes.map((node, nIdx) => {
                const NodeIcon = node.icon;
                const isSelected = nIdx === selectedNodeIndex;
                return (
                  <button
                    key={nIdx}
                    type="button"
                    onClick={() => setSelectedNodeIndex(nIdx)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 text-left cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? node.activeBorder
                        : 'bg-slate-800/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                    title={`Inspect ${node.title} specs`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] text-slate-400 tracking-wider">
                          {node.step}
                        </span>
                        <NodeIcon className={`w-3.5 h-3.5 ${node.color}`} />
                      </div>
                      <div className="text-xs font-bold text-white mb-1">
                        {node.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-normal mb-3">
                        {node.detail}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 font-mono text-[9px] text-emerald-400 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{node.status}</span>
                      </span>
                      {isSelected && (
                        <span className="text-[8px] text-sky-300 font-mono uppercase bg-sky-950/80 px-1 py-0.2 rounded border border-sky-800/60">
                          SELECTED
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Architecture Node Deep Dive Panel */}
            <div className="relative z-10 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono mb-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                    SPECIFICATION • {currentNode.step}: {currentNode.title}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded self-start sm:self-auto">
                  {currentNode.status}
                </span>
              </div>

              {/* 4 Tech Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                {currentNode.specs.map((sp, sIdx) => (
                  <div key={sIdx} className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px]">
                    <span className="text-slate-500 block uppercase">{sp.label}</span>
                    <span className="text-slate-200 font-semibold block mt-0.5 truncate">{sp.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {currentNode.deepDive}
              </p>
            </div>

            {/* Simulated Live Audit Verification Stream */}
            <div className="relative z-10 mt-2 pt-3.5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  SIMULATED AUDIT VERIFICATION LOG STREAM
                </span>
                <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                  6 EVENTS COMMITTED
                </span>
              </div>

              <div className="font-mono text-[11px] space-y-1.5 bg-slate-950/80 p-3 sm:p-3.5 rounded-xl border border-slate-800/80">
                {auditStreamEvents.map((ev, eIdx) => (
                  <div
                    key={eIdx}
                    style={{
                      transitionDelay: isInView ? ev.delay : '0ms',
                    }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-0.5 border-b border-slate-900/60 last:border-none transition-all duration-500 ease-out ${
                      isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-[11px]">
                      <span className="text-slate-500">{ev.time}</span>
                      <span className="text-sky-300 font-semibold">{ev.event}</span>
                      <span className="text-slate-400 hidden md:inline">— {ev.detail}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-semibold self-start sm:self-auto shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{ev.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Console Bottom Info Bar */}
          <div className="relative z-10 mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Enterprise Relational Integrity: Transactional ACID guarantees with Spring Data JPA & MySQL persistence.</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0">
              100% Traceable Internal Ledger
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SecurityGovernanceSection;
