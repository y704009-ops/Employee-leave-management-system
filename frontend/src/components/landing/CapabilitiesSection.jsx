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
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const LEAVE_TYPES = {
  ANNUAL: { name: 'Annual Paid Leave', total: 20.0, available: 18.5, quotaColor: 'text-blue-600', unit: 'Days' },
  SICK: { name: 'Statutory Sick Leave', total: 12.0, available: 10.0, quotaColor: 'text-emerald-600', unit: 'Days' },
  CASUAL: { name: 'Casual Floating Leave', total: 4.0, available: 3.0, quotaColor: 'text-indigo-600', unit: 'Days' },
};

const CAPABILITIES = [
  {
    id: '01',
    tag: '01 • SUBMISSION',
    title: 'Employee Leave Requests',
    description: 'Submit, track, and manage leave requests from one workspace.',
    icon: CalendarPlus,
    iconColor: 'text-blue-600 bg-blue-50/80 border-blue-200/60',
    activeBadge: 'SELF-SERVICE ACTIVE',
  },
  {
    id: '02',
    tag: '02 • REVIEW',
    title: 'Manager Approvals',
    description: 'Review requests while keeping team coverage visible.',
    icon: ClipboardCheck,
    iconColor: 'text-sky-600 bg-sky-50/80 border-sky-200/60',
    activeBadge: 'GOVERNANCE QUEUE ACTIVE',
  },
  {
    id: '03',
    tag: '03 • BALANCES',
    title: 'Leave Balance Tracking',
    description: 'Maintain a clear view of available and used leave.',
    icon: Wallet,
    iconColor: 'text-violet-600 bg-violet-50/80 border-violet-200/60',
    activeBadge: 'ACCRUAL LEDGER SYNCED',
  },
  {
    id: '04',
    tag: '04 • COMPLIANCE',
    title: 'Statutory Leave Policies',
    description: 'Keep leave rules and organizational policies structured.',
    icon: Scale,
    iconColor: 'text-emerald-600 bg-emerald-50/80 border-emerald-200/60',
    activeBadge: 'STATUTORY FRAMEWORK ENFORCED',
  },
  {
    id: '05',
    tag: '05 • WORKFORCE',
    title: 'Employee Management',
    description: 'Manage workforce records through role-based controls.',
    icon: Users,
    iconColor: 'text-indigo-600 bg-indigo-50/80 border-indigo-200/60',
    activeBadge: 'DIRECTORY & RBAC BOUND',
  },
  {
    id: '06',
    tag: '06 • INSIGHTS',
    title: 'Reports & Visibility',
    description: 'Turn workforce activity into clear operational insight.',
    icon: BarChart3,
    iconColor: 'text-amber-600 bg-amber-50/80 border-amber-200/60',
    activeBadge: 'AUDIT REPOSITORY READY',
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
      className="w-full py-16 sm:py-20 bg-slate-50/70 relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Grid */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div
          className={`max-w-2xl mb-10 sm:mb-12 transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 uppercase font-bold tracking-wider mb-2.5">
            <Layers className="w-4 h-4 text-brand-700" />
            <span>02 / 06 • WORKFORCE OPERATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Everything your workforce needs, in one place.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            One connected workspace for employees, managers, and HR teams.
          </p>
        </div>

        {/* 2x3 Grid on Desktop & Tablet (2 columns x 3 rows), 1 column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full">
          
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
                  transitionDelay: isInView ? `${index * 60}ms` : '0ms',
                }}
                className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl cursor-pointer text-left transition-all duration-300 ease-out outline-none group select-none ${
                  isActive
                    ? 'bg-white border-2 border-brand-500 shadow-md shadow-brand-900/10 -translate-y-1 ring-2 ring-brand-500/15'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5'
                } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                {/* Top Bar: Icon, Tag & Active Status */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs transition-transform duration-200 ${
                          card.iconColor
                        } ${isActive ? 'scale-105 ring-2 ring-brand-500/20' : 'group-hover:scale-105'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 bg-slate-100/80 border border-slate-200/80 px-2 py-0.5 rounded">
                        {card.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded animate-fadeIn">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                          ACTIVE SUBSYSTEM
                        </span>
                      )}
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive
                            ? 'text-brand-600 translate-x-0.5 -translate-y-0.5'
                            : 'text-slate-300 group-hover:text-slate-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight flex items-center justify-between">
                    <span>{card.title}</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                {/* Subsystem Embedded Mini UI Preview */}
                <div className="mt-2 pt-2">
                  {/* Card 01: Employee Leave Requests */}
                  {card.id === '01' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          LEAVE REQUEST
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                            isActive
                              ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 ${isActive ? 'animate-pulse' : ''}`} />
                          ● Pending Review
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-900">Annual Leave</span>
                        <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                          Dec 24 → Dec 29
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Duration: 5.0 Days</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 0 Schedule Conflicts
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 02: Manager Approvals */}
                  {card.id === '02' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-sky-50/40 border-sky-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          APPROVAL QUEUE
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border transition-all duration-200 uppercase tracking-wide ${
                            isActive
                              ? 'bg-brand-600 text-white border-brand-700 shadow-xs shadow-brand-500/30 ring-1 ring-brand-400/40'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          ACTION REQUIRED
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">Employee A</span>
                          <span className="font-mono text-[9px] text-slate-500 bg-slate-200/70 px-1 py-0.2 rounded">
                            Platform
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                          5 days
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Coverage: 3 of 4 active</span>
                        <span className="text-emerald-700 font-semibold">Quorum 75% Safe</span>
                      </div>
                    </div>
                  )}

                  {/* Card 03: Leave Balance Tracking */}
                  {card.id === '03' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-violet-50/40 border-violet-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          AVAILABLE: 18 DAYS
                        </span>
                        <span className="font-mono text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                          USED: 7 DAYS
                        </span>
                      </div>
                      {/* Dynamic Fill Progress Bar */}
                      <div className="space-y-1.5 mb-2">
                        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden flex">
                          <div
                            className={`bg-brand-600 h-full rounded-l-full transition-all duration-700 ease-out ${
                              isActive ? 'w-[72%]' : 'w-[68%]'
                            }`}
                          />
                          <div className="bg-amber-400 h-full w-[28%] rounded-r-full opacity-80" />
                        </div>
                        <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                          <span>Entitlement: 25.0 Days</span>
                          <span className="text-brand-700 font-semibold">72% Retained</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Rollover Cap: 5.0d max</span>
                        <span className="text-violet-700 font-medium">Auto-Accrual Synced</span>
                      </div>
                    </div>
                  )}

                  {/* Card 04: Statutory Leave Policies */}
                  {card.id === '04' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          POLICY STATUS
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-all duration-200 ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          ● ACTIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-slate-600 mb-2">
                        <div className="bg-white/90 p-1 rounded border border-slate-200/60 truncate">
                          Annual: <span className="font-semibold text-slate-900">24d/yr</span>
                        </div>
                        <div className="bg-white/90 p-1 rounded border border-slate-200/60 truncate">
                          Notice: <span className="font-semibold text-slate-900">2d min</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Statutory Framework</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Zero Audit Deficit
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 05: Employee Management */}
                  {card.id === '05' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isActive ? 'text-indigo-900' : 'text-slate-700'
                          }`}
                        >
                          ACTIVE EMPLOYEES: 250+ (DEMO)
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isActive ? 'text-brand-700' : 'text-slate-700'
                          }`}
                        >
                          DEPARTMENTS: 12 (DEMO)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2 font-mono text-[9px]">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200/80 text-slate-700 font-semibold shadow-2xs">
                          Admin (4)
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200/80 text-slate-700 font-semibold shadow-2xs">
                          Manager (28)
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200/80 text-slate-700 font-semibold shadow-2xs">
                          Staff (216)
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Role-Based Access Control</span>
                        <span className="text-indigo-700 font-medium">SSO / LDAP Sync</span>
                      </div>
                    </div>
                  )}

                  {/* Card 06: Reports & Visibility */}
                  {card.id === '06' && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 group-hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          REPORT STATUS: ● READY
                        </span>
                        <span className="font-mono text-[9px] text-amber-700 bg-amber-50/90 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase">
                          ISO-27001
                        </span>
                      </div>
                      {/* Micro-chart / Sparkline Bars */}
                      <div className="flex items-end justify-between h-8 gap-1.5 px-1 mb-2">
                        {[40, 65, 45, 85, 55, 95, 75].map((height, bIdx) => (
                          <div key={bIdx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                            <div
                              style={{ height: `${isActive ? height : Math.max(25, height - 15)}%` }}
                              className={`w-full rounded-xs transition-all duration-500 ease-out ${
                                isActive
                                  ? 'bg-amber-500 shadow-2xs'
                                  : 'bg-slate-300 group-hover:bg-amber-400'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                        <span>Audit Journal Digest</span>
                        <span className="text-amber-700 font-medium">SHA-256 Validated</span>
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
          className={`mt-10 p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span className="font-mono text-xs font-bold text-brand-700 uppercase tracking-wider">
                  INTERACTIVE SIMULATOR • STATUTORY LEAVE ENGINE
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Simulate a Leave Request & Live Validation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Test how SkillMate validates real-time statutory balances, policy gates, and manager routing before database commit.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>LIVE CLIENT SANDBOX</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls: Leave Type & Days */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Leave Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-2">
                  1. Select Leave Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-50/60 border-brand-500/80 ring-2 ring-brand-500/15 shadow-2xs'
                            : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {item.name}
                        </span>
                        <span className={`font-mono text-[11px] font-semibold block mt-0.5 ${item.quotaColor}`}>
                          {item.available} {item.unit} Avail
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-2">
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                    <span>Reset Simulation</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!isSufficient || simState === 'SUBMITTING'}
                    onClick={handleSubmitSimulation}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                      !isSufficient
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : simState === 'SUBMITTING'
                        ? 'bg-brand-600 text-white opacity-80'
                        : 'bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white shadow-brand-900/20'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-sky-200" />
                    <span>{simState === 'SUBMITTING' ? 'Evaluating Statutory Ledger...' : 'Run Policy Pre-Check (Demo)'}</span>
                  </button>
                )}

                <span className="font-mono text-[10px] text-slate-500">
                  {simState === 'SUBMITTED' ? '✓ Ledger event recorded' : 'Demo sandbox • no database writes'}
                </span>
              </div>
            </div>

            {/* Right Live Verification Preview */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/70">
                  <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    POLICY EVALUATION REPORT
                  </span>
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    simState === 'SUBMITTED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isSufficient
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {simState === 'SUBMITTED' ? 'PRE-CHECK VERIFIED (DEMO)' : isSufficient ? 'RULE COMPLIANT' : 'EXCEEDS QUOTA'}
                  </span>
                </div>

                {/* Balance Delta Display */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-slate-200/70 mb-3 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Current</span>
                    <span className="text-xs font-bold text-slate-800">{activeLeave.available}d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Request</span>
                    <span className="text-xs font-bold text-brand-700">-{selectedDays}.0d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Projected</span>
                    <span className={`text-xs font-bold ${isSufficient ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {projectedBalance}d
                    </span>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSufficient ? 'text-emerald-600' : 'text-rose-500'}`} />
                      <span>Statutory balance verification</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-800">
                      {isSufficient ? 'PASSED' : 'INSUFFICIENT'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Team quorum threshold (&gt;75%)</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700">
                      94% SAFE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Line manager auto-routing</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-800">
                      MGR-001 BOUND
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-3 mt-3 border-t border-slate-200/70 font-mono text-[10px] text-slate-500 flex items-center justify-between">
                <span>Verification latency: &lt;45ms</span>
                <span className="text-emerald-700 font-semibold">Zero Discrepancy</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CapabilitiesSection;
