import React, { useState } from 'react';
import {
  CalendarPlus,
  ClipboardCheck,
  Wallet,
  Scale,
  Users,
  BarChart3,
  Layers,
  CheckCircle2,
  RotateCcw,
  Send,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const LEAVE_TYPES = {
  ANNUAL: { name: 'Annual Paid Leave', total: 20.0, available: 18.5, quotaColor: 'text-sky-400', unit: 'Days' },
  SICK: { name: 'Statutory Sick Leave', total: 12.0, available: 10.0, quotaColor: 'text-emerald-400', unit: 'Days' },
  CASUAL: { name: 'Casual Floating Leave', total: 4.0, available: 3.0, quotaColor: 'text-indigo-400', unit: 'Days' },
};

const CAPABILITIES = [
  {
    id: '01',
    tag: '01 • SUBMISSION',
    title: 'Employee Leave Requests',
    description: 'Submit, track, and manage leave requests from one workspace.',
    icon: CalendarPlus,
    iconColor: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
    activeBadge: 'SELF-SERVICE ACTIVE',
    gridSpan: 'md:col-span-1 lg:col-span-6',
  },
  {
    id: '02',
    tag: '02 • REVIEW',
    title: 'Manager Approvals',
    description: 'Review requests while keeping team coverage visible.',
    icon: ClipboardCheck,
    iconColor: 'text-blue-400 bg-blue-950/80 border-blue-700/80',
    activeBadge: 'GOVERNANCE QUEUE ACTIVE',
    featured: true,
    gridSpan: 'md:col-span-1 lg:col-span-6',
  },
  {
    id: '03',
    tag: '03 • BALANCES',
    title: 'Leave Balance Tracking',
    description: 'Maintain a clear view of available and used leave.',
    icon: Wallet,
    iconColor: 'text-violet-400 bg-violet-950/60 border-violet-800/60',
    activeBadge: 'ACCRUAL LEDGER SYNCED',
    gridSpan: 'md:col-span-1 lg:col-span-4',
  },
  {
    id: '04',
    tag: '04 • COMPLIANCE',
    title: 'Statutory Leave Policies',
    description: 'Keep leave rules and organizational policies structured.',
    icon: Scale,
    iconColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    activeBadge: 'STATUTORY FRAMEWORK ENFORCED',
    gridSpan: 'md:col-span-1 lg:col-span-4',
  },
  {
    id: '05',
    tag: '05 • WORKFORCE',
    title: 'Employee Management',
    description: 'Manage workforce records through role-based controls.',
    icon: Users,
    iconColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
    activeBadge: 'DIRECTORY & RBAC BOUND',
    gridSpan: 'md:col-span-1 lg:col-span-4',
  },
  {
    id: '06',
    tag: '06 • INSIGHTS',
    title: 'Reports & Visibility',
    description: 'Turn workforce activity into clear operational insight.',
    icon: BarChart3,
    iconColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    activeBadge: 'AUDIT REPOSITORY READY',
    gridSpan: 'md:col-span-2 lg:col-span-12',
  },
];

const CapabilitiesSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeCardId, setActiveCardId] = useState('02'); // Default to 02 Manager Approvals

  // Interactive Simulator State
  const [selectedType, setSelectedType] = useState('ANNUAL');
  const [selectedDays, setSelectedDays] = useState(3);
  const [simState, setSimState] = useState('IDLE');

  const activeLeave = LEAVE_TYPES[selectedType] || LEAVE_TYPES.ANNUAL;
  const projectedBalance = Math.max(0, Number((activeLeave.available - selectedDays).toFixed(1)));
  const isSufficient = selectedDays <= activeLeave.available;

  const handleSubmitSimulation = () => {
    if (!isSufficient) return;
    setSimState('SUBMITTING');
    setTimeout(() => {
      setSimState('SUBMITTED');
    }, 450);
  };

  const handleResetSimulation = () => {
    setSimState('IDLE');
    setSelectedDays(3);
  };

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="w-full py-20 sm:py-24 bg-[#030712] relative border-b border-slate-800/80 overflow-hidden text-slate-100"
    >
      {/* 1. Subtle Architectural Grid Texture */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" />

      {/* 2. Ambient Atmospheric Lighting Glow */}
      <div className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xs mb-3.5 backdrop-blur-md">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                02 / 06 • WORKFORCE OPERATIONS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-[-0.03em] leading-[1.12]">
              Everything your workforce needs, in one place.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-normal">
              One connected workspace for employees, managers, and HR teams.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xs text-xs font-mono text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">6 CORE CAPABILITIES</span>
            </div>
          </div>
        </div>

        {/* Asymmetric Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 w-full">
          
          {CAPABILITIES.map((card, index) => {
            const Icon = card.icon;
            const isActive = activeCardId === card.id;

            return (
              <div
                key={card.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Select capability: ${card.title}`}
                onClick={() => setActiveCardId(card.id)}
                onMouseEnter={() => setActiveCardId(card.id)}
                onFocus={() => setActiveCardId(card.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCardId(card.id);
                  }
                }}
                style={{
                  transitionDelay: isInView ? `${index * 70}ms` : '0ms',
                }}
                className={`flex flex-col justify-between h-full p-6 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none group select-none relative overflow-hidden ${
                  card.gridSpan
                } ${
                  isActive
                    ? 'bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070e24] border-2 border-sky-500/80 shadow-xl shadow-sky-950/50 ring-1 ring-sky-400/20 -translate-y-1'
                    : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1324] shadow-md hover:-translate-y-0.5'
                } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                {/* Active Backlight Accent Glow */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                {/* Top Bar: Icon, Tag & Active Status */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-xs transition-transform duration-200 ${
                          card.iconColor
                        } ${isActive ? 'scale-105 ring-2 ring-sky-400/30' : 'group-hover:scale-105'}`}
                      >
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md uppercase">
                        {card.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-sky-300 bg-sky-950/80 border border-sky-800/80 px-2.5 py-1 rounded-md animate-fadeIn shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          ACTIVE SUBSYSTEM
                        </span>
                      )}
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive
                            ? 'text-sky-400 translate-x-0.5 -translate-y-0.5'
                            : 'text-slate-600 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight flex items-center justify-between">
                    <span>{card.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Embedded Mini Product Preview */}
                <div className="mt-3 pt-3 border-t border-slate-800/70">
                  {/* Card 01: Employee Leave Requests */}
                  {card.id === '01' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-sky-500/40 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
                        <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          LEAVE REQUEST
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border transition-colors ${
                            isActive
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-2xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-amber-400 ${isActive ? 'animate-pulse' : ''}`} />
                          ● Pending Review
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span className="font-bold text-white">Annual Leave</span>
                        <span className="font-mono text-[11px] text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-2xs font-semibold">
                          Dec 24 → Dec 29
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Duration: 5.0 Days</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> REQUEST → REVIEW → RECORDED
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 02: Manager Approvals (Featured Highlight) */}
                  {card.id === '02' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-sky-500/50 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                            APPROVAL QUEUE
                          </span>
                          <span className="font-mono text-[8px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                            2 REQUESTS IN REVIEW
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border transition-all duration-200 uppercase tracking-wide ${
                            isActive
                              ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-xs'
                              : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                          }`}
                        >
                          ACTION REQUIRED
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Employee A</span>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                            Platform Team
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          5 days
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Coverage: 3 of 4 active</span>
                        <span className="text-emerald-400 font-bold">MANAGER REVIEW • 75% Safe</span>
                      </div>
                    </div>
                  )}

                  {/* Card 03: Leave Balance Tracking */}
                  {card.id === '03' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-violet-500/50 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2 font-mono text-[10px] font-bold">
                        <span className="text-slate-200 uppercase tracking-wider">
                          AVAILABLE: 18 DAYS
                        </span>
                        <span className="text-violet-400 uppercase tracking-wider">
                          USED: 7 DAYS
                        </span>
                      </div>
                      {/* Dynamic Fill Progress Bar */}
                      <div className="space-y-1.5 mb-2">
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex border border-slate-800">
                          <div
                            className={`bg-violet-500 h-full rounded-l-full transition-all duration-700 ease-out ${
                              isActive ? 'w-[72%]' : 'w-[68%]'
                            }`}
                          />
                          <div className="bg-amber-400 h-full w-[28%] rounded-r-full opacity-80" />
                        </div>
                        <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                          <span>ANNUAL BALANCE: 25.0 Days</span>
                          <span className="text-violet-300 font-bold">72% Retained</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Rollover Cap: 5.0d max</span>
                        <span className="text-violet-400 font-semibold">Auto-Accrual Synced</span>
                      </div>
                    </div>
                  )}

                  {/* Card 04: Statutory Leave Policies */}
                  {card.id === '04' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-emerald-500/50 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          POLICY STATUS
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-all duration-200 ${
                            isActive
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 shadow-2xs'
                              : 'bg-slate-900 text-emerald-400 border-slate-800'
                          }`}
                        >
                          ● ACTIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-300 mb-2">
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800 truncate">
                          ANNUAL: <span className="font-bold text-white">24d/yr</span>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800 truncate">
                          SICK: <span className="font-bold text-white">10d ACTIVE</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>POLICY ACTIVE</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Framework Enforced
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 05: Employee Management */}
                  {card.id === '05' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-indigo-500/50 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isActive ? 'text-indigo-300' : 'text-slate-300'
                          }`}
                        >
                          ACTIVE EMPLOYEES: 250+ (DEMO)
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isActive ? 'text-sky-400' : 'text-slate-300'
                          }`}
                        >
                          DEPARTMENTS: 12 (DEMO)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2 font-mono text-[9px]">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-semibold">
                          ADMIN
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-semibold">
                          MANAGER
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-semibold">
                          EMPLOYEE
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Role-Based Access Control</span>
                        <span className="text-indigo-400 font-semibold">SSO / Directory Bound</span>
                      </div>
                    </div>
                  )}

                  {/* Card 06: Reports & Visibility */}
                  {card.id === '06' && (
                    <div
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-950/95 border-amber-500/50 shadow-inner'
                          : 'bg-slate-950/70 border-slate-800/80 group-hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            REPORT STATUS: ● READY
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                            LEAVE OVERVIEW
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded font-bold uppercase">
                          ISO-27001
                        </span>
                      </div>
                      {/* Micro-chart / Sparkline Bars */}
                      <div className="flex items-end justify-between h-9 gap-1.5 px-1 mb-2">
                        {[40, 65, 45, 85, 55, 95, 75, 60, 90, 80, 100, 70].map((height, bIdx) => (
                          <div key={bIdx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                            <div
                              style={{ height: `${isActive ? height : Math.max(25, height - 15)}%` }}
                              className={`w-full rounded-xs transition-all duration-500 ease-out ${
                                isActive
                                  ? 'bg-amber-400 shadow-xs'
                                  : 'bg-slate-700 group-hover:bg-amber-500/80'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Audit Journal Digest</span>
                        <span className="text-amber-400 font-semibold">SHA-256 Validated</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>

        {/* Interactive Simulated Leave-Request Sandbox */}
        <div
          style={{ transitionDelay: isInView ? '450ms' : '0ms' }}
          className={`mt-12 p-6 sm:p-8 rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out relative overflow-hidden ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  INTERACTIVE SIMULATOR • STATUTORY LEAVE ENGINE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                Simulate a Leave Request & Live Validation
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                Test how SkillMate validates real-time statutory balances, policy gates, and manager routing before database commit.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-lg self-start sm:self-auto shrink-0 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>LIVE CLIENT SANDBOX</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls: Leave Type & Days */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Leave Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2.5">
                  1. Select Leave Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {Object.entries(LEAVE_TYPES).map(([key, item]) => {
                    const isSelected = selectedType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedType(key);
                          if (simState === 'SUBMITTED') setSimState('IDLE');
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-950/80 border-sky-400/80 ring-2 ring-sky-400/20 shadow-md'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-xs font-bold text-white block truncate">
                          {item.name}
                        </span>
                        <span className={`font-mono text-[11px] font-semibold block mt-1 ${item.quotaColor}`}>
                          {item.available} {item.unit} Avail
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2.5">
                  2. Select Duration
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 5, 10].map((d) => {
                    const isSelected = selectedDays === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSelectedDays(d);
                          if (simState === 'SUBMITTED') setSimState('IDLE');
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-900/40 ring-1 ring-sky-400/40'
                            : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                {simState === 'SUBMITTED' ? (
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                    <span>Reset Simulation</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!isSufficient || simState === 'SUBMITTING'}
                    onClick={handleSubmitSimulation}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer ${
                      !isSufficient
                        ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                        : simState === 'SUBMITTING'
                        ? 'bg-sky-600 text-white opacity-80'
                        : 'bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white shadow-sky-950/50 border border-sky-400/30'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-sky-200" />
                    <span>{simState === 'SUBMITTING' ? 'Evaluating Statutory Ledger...' : 'Run Policy Pre-Check (Demo)'}</span>
                  </button>
                )}

                <span className="font-mono text-[10px] text-slate-400">
                  {simState === 'SUBMITTED' ? '✓ Ledger event recorded' : 'Demo sandbox • no database writes'}
                </span>
              </div>
            </div>

            {/* Right Live Verification Preview */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-800/80">
                  <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    POLICY EVALUATION REPORT
                  </span>
                  <span className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase ${
                    simState === 'SUBMITTED'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : isSufficient
                      ? 'bg-blue-950/80 text-sky-300 border-blue-800'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800'
                  }`}>
                    {simState === 'SUBMITTED' ? 'PRE-CHECK VERIFIED (DEMO)' : isSufficient ? 'RULE COMPLIANT' : 'EXCEEDS QUOTA'}
                  </span>
                </div>

                {/* Balance Delta Display */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Current</span>
                    <span className="text-xs font-bold text-white">{activeLeave.available}d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Request</span>
                    <span className="text-xs font-bold text-sky-400">-{selectedDays}.0d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Projected</span>
                    <span className={`text-xs font-bold ${isSufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {projectedBalance}d
                    </span>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSufficient ? 'text-emerald-400' : 'text-rose-400'}`} />
                      <span>Statutory balance verification</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-white">
                      {isSufficient ? 'PASSED' : 'INSUFFICIENT'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Team quorum threshold (&gt;75%)</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-400">
                      94% SAFE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Line manager auto-routing</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-white">
                      MGR-001 BOUND
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-3 mt-4 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>Verification latency: &lt;45ms</span>
                <span className="text-emerald-400 font-semibold">Zero Discrepancy</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CapabilitiesSection;
