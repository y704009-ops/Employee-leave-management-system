import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  Lock,
  Check,
  X,
  Clock,
  ChevronRight,
  Activity,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const ROLE_PREVIEWS = {
  employee: {
    badge: 'EMPLOYEE SELF-SERVICE WORKSPACE',
    viewTitle: 'Employee Personal Leave & Quota Console',
    quickStats: [
      { label: 'Available Annual', value: '18.5 Days', change: '1.67d / mo accrual' },
      { label: 'Sick Leave Quota', value: '10.0 Days', change: 'Fully available' },
      { label: 'Pending Decisions', value: '1 Request', change: 'Under manager review' },
    ],
    sampleRows: [
      { type: 'Annual Leave', dates: 'Dec 24 - Dec 29, 2025', duration: '5.0 Days', status: 'PENDING', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
      { type: 'Statutory Sick', dates: 'Oct 14, 2025', duration: '1.0 Day', status: 'APPROVED', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { type: 'Casual Leave', dates: 'Aug 18, 2025', duration: '1.0 Day', status: 'APPROVED', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ],
    hint: 'Employees manage personal balances, submit leave requests with document uploads, and track review status in real time.',
  },
  manager: {
    badge: 'MANAGER TEAM GOVERNANCE CONSOLE',
    viewTitle: 'Team Absence Ledger & Approval Queue',
    quickStats: [
      { label: 'Current Team Quorum', value: '94% Safe', change: '17 of 18 staff active' },
      { label: 'Pending Approvals', value: '2 Requests', change: 'Avg turnaround 3.8h' },
      { label: 'Team Active On Leave', value: '1 Member', change: 'Coverage nominal' },
    ],
    sampleRows: [
      { type: 'Sarah Chen (Platform Eng)', dates: 'Dec 24 → Dec 29 (5d)', duration: 'Annual Leave', status: 'ACTION REQUIRED', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
      { type: 'Marcus Vance (DevOps)', dates: 'Nov 12 → Nov 14 (3d)', duration: 'Annual Leave', status: 'ACTION REQUIRED', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
      { type: 'Elena Rostova (Frontend)', dates: 'Nov 04 (1d)', duration: 'Sick Leave', status: 'APPROVED', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ],
    hint: 'Managers evaluate team heatmaps, verify staffing quorums before sign-off, and delegate review authority during vacations.',
  },
  admin: {
    badge: 'ENTERPRISE HR & GOVERNANCE CONSOLE',
    viewTitle: 'Global Statutory Policy & Audit Management',
    quickStats: [
      { label: 'Statutory Policies', value: '4 Active Sets', change: 'Global & Regional' },
      { label: 'Total Headcount', value: '1,248 Staff', change: 'Row-level isolated' },
      { label: 'Ledger Audit Health', value: '100% Sealed', change: 'ACID transactional' },
    ],
    sampleRows: [
      { type: 'Annual Statutory Accrual', dates: '20.0 Days / Year', duration: '1.67d Monthly', status: 'ENFORCED', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { type: 'Annual Rollover Carryover', dates: 'Max 5.0 Days', duration: 'Expires Mar 31', status: 'ENFORCED', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { type: 'Mandatory Sick Documentation', dates: 'Threshold > 3 Days', duration: 'Practitioner Note', status: 'MANDATED', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
    ],
    hint: 'Enterprise administrators define global leave policies, configure carryover rules, audit system operations, and manage tenant organizations.',
  },
};

const roles = [
  {
    id: 'employee',
    title: 'Employee Console',
    roleTag: 'EMPLOYEE',
    workspaceLabel: 'Personal Workspace',
    icon: User,
    iconWrapper: 'bg-blue-50/70 border-blue-200/60 text-blue-600',
    checkColor: 'text-blue-600',
    topBorder: 'border-t-blue-500',
    boundaryColor: 'border-blue-200/50',
    ctaText: 'Sign In to Employee Console',
    focusArea: 'Personal Leave & Balances',
    features: [
      { text: 'Self-service real-time leave entitlement balances', focus: true },
      { text: 'Self-cancellation and amendment workflows', focus: true },
      { text: 'Medical documentation and sick-note upload portal', focus: false },
      { text: 'Personal calendar sync (.ics feed / Google integration)', focus: false },
    ],
    accessLevel: 'Self-Record Isolated (Tenant Bound)',
    isolationDetail: 'Isolation Level: Row-Level (Tenant ID)',
    statusTag: 'ENFORCED',
    statusTagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/70',
    previewTitle: 'Employee Workspace Preview',
    previewMetrics: [
      { label: 'Annual Available', val: '18.5 Days' },
      { label: 'Active Requests', val: '1 Pending' },
      { label: 'Next Planned', val: 'Dec 24, 2025' },
    ],
  },
  {
    id: 'manager',
    title: 'Manager Console',
    roleTag: 'MANAGER',
    workspaceLabel: 'Team Workspace',
    icon: Users,
    iconWrapper: 'bg-sky-50/70 border-sky-200/60 text-sky-600',
    checkColor: 'text-sky-600',
    topBorder: 'border-t-sky-500',
    boundaryColor: 'border-sky-200/60',
    ctaText: 'Sign In to Manager Console',
    focusArea: 'Team Approvals & Quorum',
    features: [
      { text: 'Team absence overlap calendar with quorum alarms', focus: true },
      { text: 'One-click batch approval / rejection with audit notes', focus: true },
      { text: 'Delegation rule activation during manager vacation', focus: false },
      { text: 'Subordinate historical utilization trends', focus: false },
    ],
    accessLevel: 'Departmental / Sub-Tree Hierarchy',
    isolationDetail: 'Isolation Level: Org Hierarchy Tree',
    statusTag: 'DELEGATED',
    statusTagColor: 'text-sky-700 bg-sky-50 border-sky-200/70',
    previewTitle: 'Manager Approval Queue Preview',
    previewMetrics: [
      { label: 'Team Coverage', val: '94% Quorum' },
      { label: 'Pending Approvals', val: '2 Requests' },
      { label: 'Direct Reports', val: '18 Active' },
    ],
  },
  {
    id: 'admin',
    title: 'Administrator & HR',
    roleTag: 'ADMIN',
    workspaceLabel: 'Enterprise Workspace',
    icon: Shield,
    iconWrapper: 'bg-slate-100/80 border-slate-200/70 text-slate-700',
    checkColor: 'text-slate-700',
    topBorder: 'border-t-slate-700',
    boundaryColor: 'border-slate-200/70',
    ctaText: 'Sign In to Admin Console',
    focusArea: 'Global Policy & Audit Logs',
    features: [
      { text: 'Global statutory policy rule engine & holiday builder', focus: true },
      { text: 'Annual carryover limits and accrual recalculation', focus: false },
      { text: 'Payroll export reconciliation and data maintenance', focus: false },
      { text: 'Tamper-evident system activity and compliance logs', focus: true },
    ],
    accessLevel: 'Global Enterprise Administrator',
    isolationDetail: 'Isolation Level: Org-Wide Root',
    statusTag: 'UNRESTRICTED',
    statusTagColor: 'text-slate-700 bg-slate-100 border-slate-200/70',
    previewTitle: 'HR Governance & Policy Engine',
    previewMetrics: [
      { label: 'Scope', val: 'Enterprise' },
      { label: 'Statutory Policies', val: 'Active Sets' },
      { label: 'Ledger Audit Health', val: '100% Synced' },
    ],
  },
];

const INITIAL_MANAGER_REQUESTS = [
  {
    id: 'req-sarah',
    name: 'Sarah Chen',
    role: 'Platform Eng',
    dept: 'Platform Engineering',
    dates: 'Dec 24 → Dec 29',
    duration: '5d',
    type: 'Annual Leave',
    status: 'ACTION REQUIRED',
    coverageInfo: 'Platform Eng: 3 of 4 remaining active (75% coverage)',
    impact: 'Low • Quorum remains safely above 80% minimum threshold',
    notes: 'Pre-scheduled year-end annual entitlement leave. Handoff assigned to Marcus Vance.',
    quotaAvailable: '18.5 Days',
    quotaRemaining: '13.5 Days',
  },
  {
    id: 'req-marcus',
    name: 'Marcus Vance',
    role: 'DevOps',
    dept: 'DevOps & Infrastructure',
    dates: 'Nov 12 → Nov 14',
    duration: '3d',
    type: 'Annual Leave',
    status: 'ACTION REQUIRED',
    coverageInfo: 'DevOps: 2 of 2 covered by secondary on-call rotation',
    impact: 'Low • Primary CI/CD secondary engineer active on duty',
    notes: 'Mid-quarter personal leave. Automated CI/CD alerts routed to on-call secondary.',
    quotaAvailable: '14.0 Days',
    quotaRemaining: '11.0 Days',
  },
  {
    id: 'req-elena',
    name: 'Elena Rostova',
    role: 'Frontend',
    dept: 'Frontend Core',
    dates: 'Nov 04',
    duration: '1d',
    type: 'Sick Leave',
    status: 'APPROVED',
    coverageInfo: 'Frontend Core: 4 of 5 active',
    impact: 'Negligible • Daily standup tasks rebalanced',
    notes: 'Statutory sick leave with registered medical consultation receipt.',
    quotaAvailable: '10.0 Days',
    quotaRemaining: '9.0 Days',
  },
];

const INITIAL_ACTIVITY = [
  { id: 'act-1', time: '09:42', text: 'Leave request updated' },
  { id: 'act-2', time: '09:37', text: 'Team coverage recalculated' },
  { id: 'act-3', time: '09:21', text: 'Approval queue synchronized' },
];

const RoleConsolesSection = () => {
  // Manager is active by default as required
  const [selectedRole, setSelectedRole] = useState(roles[1]);
  const [sectionRef, isInView] = useInView({ threshold: 0.12, triggerOnce: true });

  // Manager interactive console state
  const [managerRequests, setManagerRequests] = useState(INITIAL_MANAGER_REQUESTS);
  const [activeStaff, setActiveStaff] = useState(17);
  const [totalStaff] = useState(18);
  const [onLeaveCount, setOnLeaveCount] = useState(1);
  const [activityFeed, setActivityFeed] = useState(INITIAL_ACTIVITY);
  const [highlightQueue, setHighlightQueue] = useState(false);

  // Modal / panel review states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('Staffing threshold / critical delivery window');
  const [confirmationNotice, setConfirmationNotice] = useState(null);

  // Derived manager stats
  const pendingCount = managerRequests.filter((r) => r.status === 'ACTION REQUIRED').length;
  const quorum = Math.round((activeStaff / totalStaff) * 100);

  // Handle keyboard accessibility for modal (Escape key listener)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRequest(null);
        setRejectingRequest(null);
      }
    };
    if (selectedRequest || rejectingRequest) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRequest, rejectingRequest]);

  // Highlight queue when Card 2 is clicked
  const handleHighlightQueue = () => {
    setHighlightQueue(true);
    setTimeout(() => {
      setHighlightQueue(false);
    }, 1600);
  };

  // Micro-interaction: Approve Request
  const handleApprove = (req) => {
    const updatedRequests = managerRequests.map((r) =>
      r.id === req.id ? { ...r, status: 'APPROVED' } : r
    );
    setManagerRequests(updatedRequests);

    const newActiveStaff = Math.max(1, activeStaff - 1);
    const newOnLeave = onLeaveCount + 1;
    setActiveStaff(newActiveStaff);
    setOnLeaveCount(newOnLeave);

    const newQuorum = Math.round((newActiveStaff / totalStaff) * 100);

    const newActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      text: `${req.name} request approved (Quorum: ${newQuorum}%)`,
    };
    setActivityFeed((prev) => [newActivity, ...prev.slice(0, 4)]);

    setConfirmationNotice({
      type: 'approved',
      title: '✓ REQUEST APPROVED',
      subtitle: `${req.name} • ${req.dates}`,
      note: 'Team quorum updated.',
    });

    setSelectedRequest(null);
    setShowReviewDetails(false);

    // Auto-clear notification after 4s
    setTimeout(() => {
      setConfirmationNotice(null);
    }, 4500);
  };

  // Micro-interaction: Initiate Reject
  const handleStartReject = (req) => {
    setSelectedRequest(null);
    setRejectingRequest(req);
  };

  // Micro-interaction: Confirm Reject
  const handleConfirmReject = () => {
    if (!rejectingRequest) return;
    const req = rejectingRequest;

    const updatedRequests = managerRequests.map((r) =>
      r.id === req.id ? { ...r, status: 'REJECTED' } : r
    );
    setManagerRequests(updatedRequests);

    const newActivity = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      text: `${req.name} request rejected (${rejectReason})`,
    };
    setActivityFeed((prev) => [newActivity, ...prev.slice(0, 4)]);

    setConfirmationNotice({
      type: 'rejected',
      title: 'REQUEST REJECTED',
      subtitle: `${req.name} • ${req.dates}`,
      note: `Reason: ${rejectReason}`,
    });

    setRejectingRequest(null);

    setTimeout(() => {
      setConfirmationNotice(null);
    }, 4500);
  };

  // Reset demo state
  const handleResetDemo = () => {
    setManagerRequests(INITIAL_MANAGER_REQUESTS);
    setActiveStaff(17);
    setOnLeaveCount(1);
    setActivityFeed(INITIAL_ACTIVITY);
    setConfirmationNotice(null);
    setSelectedRequest(null);
    setRejectingRequest(null);
  };

  const rolePreview = ROLE_PREVIEWS[selectedRole.id] || ROLE_PREVIEWS.employee;

  return (
    <section
      id="roles"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-slate-50/70 relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        {/* Section Header (Storytelling 04 / 06) */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 sm:mb-14 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-xl">
            <div className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2.5">
              04 / 06 • ROLE-BASED ACCESS CONTROL
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Role-Based Access Consoles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Segmented operational workspaces designed for strict data isolation and compliance governance.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start md:self-auto font-mono text-[10px] text-slate-600 font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
        </div>

        {/* 3 Console Cards Grid (Interactive Selection) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-8 w-full">
          {roles.map((role, rIdx) => {
            const Icon = role.icon;
            const isSelected = selectedRole.id === role.id;
            const isManager = role.id === 'manager';

            return (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedRole(role)}
                onMouseEnter={() => setSelectedRole(role)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRole(role);
                  }
                }}
                style={{ transitionDelay: isInView ? `${rIdx * 100 + 60}ms` : '0ms' }}
                className={`p-5 sm:p-6 rounded-2xl bg-white border border-t-[3px] ${role.topBorder} ${
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-500/25 shadow-md -translate-y-0.5'
                    : isManager
                    ? 'border-slate-200/90 shadow-2xs hover:border-sky-300'
                    : 'border-slate-200/80 shadow-2xs hover:border-slate-300'
                } hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  role.id === 'admin' ? 'md:col-span-2 lg:col-span-1' : ''
                } ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div>
                  {/* Console Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${role.iconWrapper} shadow-2xs group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {role.title}
                        </h3>
                        <span className="font-mono text-[10px] text-slate-500 tracking-tight">
                          {role.workspaceLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="font-mono text-[8px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-1 py-0.5 rounded uppercase">
                          ACTIVE
                        </span>
                      )}
                      <span className="font-mono text-[9px] font-semibold tracking-wider text-slate-600 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded">
                        {role.roleTag}
                      </span>
                    </div>
                  </div>

                  {/* Verified Permission Capabilities List with Active Focus Highlights */}
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {role.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${role.checkColor}`} />
                        <span className={`leading-relaxed ${isSelected && feat.focus ? 'font-semibold text-slate-900' : ''}`}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Console System Boundary & Action */}
                <div className="space-y-3 pt-3.5 border-t border-slate-100">
                  {/* Data Boundary Mini Monitor */}
                  <div className={`bg-slate-50/80 border ${role.boundaryColor} p-3 rounded-xl group-hover:bg-slate-50 transition-colors shadow-2xs`}>
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200/60">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                        DATA BOUNDARY
                      </span>
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${role.statusTagColor}`}>
                        {role.statusTag}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-900 leading-tight mb-1">
                      {role.accessLevel}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      {role.isolationDetail}
                    </div>
                  </div>

                  {/* Sign In CTA */}
                  <Link
                    to="/login"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-800 text-xs font-semibold rounded-lg transition-colors group/btn"
                  >
                    <span>{role.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE PRODUCT PREVIEW CONSOLE (Defaulting to MANAGER)     */}
        {/* ============================================================== */}
        <div
          className={`p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Top Header Bar with Role Switcher & Live Pulse */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <div
                title="SkillMate Enterprise Leave Management System"
                className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 font-mono font-bold text-xs shadow-2xs shrink-0 transition-all duration-300 hover:shadow-[0_0_12px_rgba(37,99,235,0.25)] hover:border-brand-400 cursor-default"
              >
                ELMS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-brand-700 uppercase tracking-wider font-semibold block">
                    {selectedRole.id === 'manager'
                      ? 'MANAGER TEAM GOVERNANCE CONSOLE'
                      : rolePreview.badge}
                  </span>
                  {selectedRole.id === 'manager' && (
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE TEAM DATA</span>
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900 block">
                  {selectedRole.id === 'manager'
                    ? 'Team Absence Ledger & Approval Queue'
                    : rolePreview.viewTitle}
                </span>
              </div>
            </div>

            {/* Role Switcher Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-lg self-start sm:self-auto border border-slate-200/50">
              {roles.map((r) => {
                const isActive = selectedRole.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-brand-800 shadow-2xs font-bold ring-1 ring-slate-200/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {r.roleTag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Confirmation Notification Banner */}
          {confirmationNotice && (
            <div
              className={`mb-5 p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
                confirmationNotice.type === 'approved'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    confirmationNotice.type === 'approved'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {confirmationNotice.type === 'approved' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs font-mono">{confirmationNotice.title}</div>
                  <div className="text-[11px] opacity-90">
                    {confirmationNotice.subtitle} • {confirmationNotice.note}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmationNotice(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* MANAGER CONSOLE SPECIFIC VIEW (Rich, Interactive)              */}
          {/* ============================================================== */}
          {selectedRole.id === 'manager' ? (
            <div className="space-y-5 transition-all duration-200 ease-out">
              {/* Three Interactive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Card 1: CURRENT TEAM QUORUM */}
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                      CURRENT TEAM QUORUM
                    </span>
                    <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      SAFE
                    </span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                    {quorum}% Safe
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                    {activeStaff} of {totalStaff} staff active
                  </span>

                  {/* Horizontal Progress Indicator */}
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${quorum}%` }}
                    />
                  </div>
                </div>

                {/* Card 2: PENDING APPROVALS (Click highlights approval queue) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleHighlightQueue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleHighlightQueue();
                    }
                  }}
                  title="Click to highlight approval queue below"
                  className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                      PENDING APPROVALS
                    </span>
                    <span className="font-mono text-[9px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>QUEUE ACTIVE</span>
                    </span>
                  </div>
                  <div className="text-xl font-bold text-brand-700 font-mono tracking-tight group-hover:text-brand-800 transition-colors">
                    {pendingCount} {pendingCount === 1 ? 'Request' : 'Requests'}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-[10px] text-slate-500">
                      Avg turnaround 3.8h
                    </span>
                    <span className="font-mono text-[9px] text-brand-600 underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Highlight ↓
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-100/70 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(100, pendingCount * 50)}%` }}
                    />
                  </div>
                </div>

                {/* Card 3: TEAM ACTIVE ON LEAVE */}
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">
                      TEAM ACTIVE ON LEAVE
                    </span>
                    <span className="font-mono text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded">
                      NOMINAL
                    </span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                    {onLeaveCount} {onLeaveCount === 1 ? 'Member' : 'Members'}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                    Coverage nominal
                  </span>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.round((onLeaveCount / totalStaff) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Coverage Segmented Bar Visualization (Section 9) */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      TEAM COVERAGE
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {activeStaff} / {totalStaff} active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Active ({activeStaff})</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span>On Leave ({onLeaveCount})</span>
                    </span>
                    {pendingCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Pending ({pendingCount})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 18-Segment Team Roster Indicator */}
                <div className="flex gap-1 h-3 sm:h-3.5 w-full">
                  {Array.from({ length: totalStaff }).map((_, i) => {
                    const isActive = i < activeStaff;
                    const isOnLeave = !isActive && i < activeStaff + onLeaveCount;
                    return (
                      <div
                        key={i}
                        title={`Staff #${i + 1}: ${isActive ? 'Active on Duty' : isOnLeave ? 'On Approved Leave' : 'Pending Request'}`}
                        className={`flex-1 h-full rounded-xs transition-colors duration-300 ${
                          isActive
                            ? 'bg-emerald-500'
                            : isOnLeave
                            ? 'bg-sky-500'
                            : 'bg-amber-400'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Centerpiece Approval Queue Table (Section 5 & 6) */}
              <div
                className={`rounded-xl border overflow-hidden transition-all duration-300 bg-white ${
                  highlightQueue
                    ? 'ring-2 ring-brand-500 border-brand-400 shadow-md bg-brand-50/10'
                    : 'border-slate-200/90 shadow-2xs'
                }`}
              >
                <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Queue Item / Subordinate</span>
                    {highlightQueue && (
                      <span className="text-[9px] text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded font-bold animate-pulse">
                        FOCUSED
                      </span>
                    )}
                  </div>
                  <span>Status Protocol</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {managerRequests.map((req) => {
                    const isActionRequired = req.status === 'ACTION REQUIRED';
                    const isApproved = req.status === 'APPROVED';
                    const isRejected = req.status === 'REJECTED';

                    return (
                      <div
                        key={req.id}
                        role={isActionRequired ? 'button' : 'region'}
                        tabIndex={isActionRequired ? 0 : -1}
                        onClick={() => {
                          if (isActionRequired) setSelectedRequest(req);
                        }}
                        onKeyDown={(e) => {
                          if (isActionRequired && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            setSelectedRequest(req);
                          }
                        }}
                        className={`px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors group ${
                          isActionRequired
                            ? 'hover:bg-slate-50/90 cursor-pointer focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-1 focus-visible:ring-brand-500'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {req.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                              {req.role}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                            {req.dates} • {req.duration} • {req.type}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          {isActionRequired && (
                            <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/90 px-2 py-0.5 rounded uppercase tracking-wider group-hover:bg-blue-100 transition-colors">
                              ACTION REQUIRED
                            </span>
                          )}
                          {isApproved && (
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>APPROVED</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/90 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <X className="w-3 h-3 text-rose-600" />
                              <span>REJECTED</span>
                            </span>
                          )}

                          {/* Hover action affordance for interactive row */}
                          {isActionRequired && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(req);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              <span>Review</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Manager Meta Grid: Live System Activity + Product Preview Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Live System Activity Feed (Section 11) */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/50">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-brand-600" />
                      <span>RECENT ACTIVITY</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="font-mono text-[9px] text-slate-500 hover:text-brand-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Reset interactive demo state"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Reset Preview</span>
                    </button>
                  </div>
                  <ul className="space-y-1.5 font-mono text-[10px] text-slate-600">
                    {activityFeed.slice(0, 3).map((act) => (
                      <li key={act.id} className="flex items-center justify-between gap-2">
                        <span className="truncate text-slate-700">{act.text}</span>
                        <span className="text-slate-400 shrink-0">{act.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Audit & Verification Note */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/50">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Info className="w-3 h-3 text-sky-600" />
                      <span>GOVERNANCE PROTOCOL</span>
                    </span>
                    <span className="font-mono text-[8px] font-bold text-slate-500 bg-white border border-slate-200 px-1 py-0.2 rounded uppercase">
                      SIMULATED DATA
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-slate-600 leading-relaxed">
                    Evaluates team presence heatmaps and validates quorum minimums prior to commit.
                    All actions update the immutable ledger.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* EMPLOYEE & ADMIN WORKSPACE PREVIEWS (Smooth preservation)      */
            /* ============================================================== */
            <div className="space-y-5 transition-all duration-200 ease-out">
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rolePreview.quickStats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs"
                  >
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide block mb-1">
                      {st.label}
                    </span>
                    <div className="text-lg font-bold text-slate-900 font-mono">
                      {st.value}
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                      {st.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Representative Records Table Preview */}
              <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
                <div className="bg-slate-100/80 px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                  <span>{selectedRole.id === 'admin' ? 'Statutory Policy Rule' : 'Leave Type & Schedule'}</span>
                  <span>Status Protocol</span>
                </div>
                <div className="divide-y divide-slate-200/60 font-mono text-xs">
                  {rolePreview.sampleRows.map((row, idx) => (
                    <div key={idx} className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-white transition-colors">
                      <div>
                        <div className="font-semibold text-slate-800 text-[11px] sm:text-xs">
                          {row.type}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {row.dates} • {row.duration}
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${row.badge}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Footer Callout & SSO Link (Section 12) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-5 border-t border-slate-100 text-xs text-slate-600">
            <p className="text-[11px] leading-relaxed max-w-xl font-normal text-slate-600">
              {rolePreview.hint}
            </p>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="font-mono text-[9px] text-slate-400 uppercase hidden md:inline">
                PRODUCT PREVIEW
              </span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white text-xs font-semibold rounded-lg transition-all shadow-2xs group/portal"
              >
                <Lock className="w-3 h-3 text-blue-200" />
                <span>Sign In to {selectedRole.roleTag}</span>
                <ArrowRight className="w-3 h-3 group-hover/portal:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE APPROVAL DETAIL MODAL / PANEL (Section 6 & 7)        */}
        {/* ============================================================== */}
        {selectedRequest && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => {
              setSelectedRequest(null);
              setShowReviewDetails(false);
            }}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-brand-700 uppercase tracking-wider font-semibold block">
                      REQUEST GOVERNANCE REVIEW
                    </span>
                    <h4 id="approval-modal-title" className="text-sm font-bold text-slate-900 leading-tight">
                      Leave Approval Protocol
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                    PRODUCT PREVIEW
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRequest(null);
                      setShowReviewDetails(false);
                    }}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Request Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    EMPLOYEE
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.name}</span>
                  <span className="text-[10px] text-slate-500">{selectedRequest.dept}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    REQUEST TYPE
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.type}</span>
                  <span className="text-[10px] text-slate-500">{selectedRequest.duration} (Full-time)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    DATES
                  </span>
                  <span className="font-bold text-slate-900 block">{selectedRequest.dates}</span>
                  <span className="text-[10px] text-slate-500">2025 Ledger Cycle</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    TEAM COVERAGE
                  </span>
                  <span className="font-bold text-emerald-700 block">{activeStaff} / {totalStaff} active</span>
                  <span className="text-[10px] text-slate-500">Quorum Safe ({quorum}%)</span>
                </div>
              </div>

              {/* Impact Assessment Card */}
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs mb-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-blue-900 font-bold mb-1">
                  <span>IMPACT ANALYSIS</span>
                  <span className="text-emerald-700">LOW IMPACT</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {selectedRequest.coverageInfo}. {selectedRequest.impact}.
                </p>
              </div>

              {/* Collapsible Detailed Review Details Section */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => setShowReviewDetails(!showReviewDetails)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10px] uppercase text-brand-700 font-bold">
                    {showReviewDetails ? '▼ Hide Verification Details' : '▶ Review Details (Policy & Quota)'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {showReviewDetails ? 'Collapse' : 'Expand'}
                  </span>
                </button>

                {showReviewDetails && (
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/70 font-mono text-[10px] space-y-2 text-slate-600 animate-in fade-in duration-150">
                    <div className="flex justify-between border-b border-slate-200/50 pb-1">
                      <span>Quota Balance:</span>
                      <span className="font-bold text-slate-800">{selectedRequest.quotaAvailable} available</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1">
                      <span>Balance Post-Approval:</span>
                      <span className="font-bold text-slate-800">{selectedRequest.quotaRemaining} remaining</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1">
                      <span>Blackout Calendar Conflict:</span>
                      <span className="font-bold text-emerald-700">None detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Notes:</span>
                      <span className="text-slate-800 text-right max-w-[240px] truncate">{selectedRequest.notes}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequest(null);
                    setShowReviewDetails(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleStartReject(selectedRequest)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedRequest)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Request</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* REJECTION CONFIRMATION MODAL (Section 8)                        */}
        {/* ============================================================== */}
        {rejectingRequest && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setRejectingRequest(null)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 mb-3 text-rose-600">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </div>
                <div>
                  <h4 id="reject-modal-title" className="text-sm font-bold text-slate-900">
                    REJECT LEAVE REQUEST?
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">
                    {rejectingRequest.name} • {rejectingRequest.dates}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Provide an administrative protocol reason for this rejection. The subordinate will be notified
                and their quota will not be deducted.
              </p>

              {/* Optional Reason Selection */}
              <div className="mb-4">
                <label htmlFor="rejection-reason" className="font-mono text-[10px] text-slate-500 uppercase tracking-wide font-semibold block mb-1.5">
                  REJECTION REASON (AUDITED)
                </label>
                <select
                  id="rejection-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Staffing threshold / critical delivery window">
                    Staffing threshold / critical delivery window
                  </option>
                  <option value="Infrastructure sprint release freeze">
                    Infrastructure sprint release freeze
                  </option>
                  <option value="Insufficient advance statutory notice">
                    Insufficient advance statutory notice
                  </option>
                  <option value="Direct subordinate coordination required">
                    Direct subordinate coordination required
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  Confirm Rejection
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
