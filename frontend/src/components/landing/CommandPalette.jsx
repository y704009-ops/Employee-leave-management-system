import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  Search,
  ArrowRight,
  X,
  Home,
  LayoutGrid,
  Monitor,
  ArrowLeftRight,
  ShieldCheck,
  User,
  Users,
  Shield,
  Compass,
  Lock,
  Play,
} from 'lucide-react';

/**
 * COMMAND SPECIFICATIONS
 * Structured into 3 clear enterprise categories:
 * - NAVIGATE (Section smooth scrolling)
 * - PRODUCT PREVIEW (Interactive role console activation)
 * - QUICK ACTIONS (Platform exploration, Sign In, and workflow execution)
 */
const COMMAND_GROUPS = [
  {
    group: 'NAVIGATE',
    items: [
      {
        id: 'nav-hero',
        title: 'Go to Hero',
        description: 'Scroll to top overview and live workforce operations console',
        icon: Home,
        category: 'NAVIGATE',
        keywords: ['hero', 'home', 'top', 'start', 'overview', 'live operations'],
        action: 'scroll',
        target: '#hero',
      },
      {
        id: 'nav-capabilities',
        title: 'Go to Capabilities',
        description: 'Explore the 6 core workforce management capabilities',
        icon: LayoutGrid,
        category: 'NAVIGATE',
        keywords: ['capabilities', 'features', 'modules', 'leave balance', 'statutory policies'],
        action: 'scroll',
        target: '#capabilities',
      },
      {
        id: 'nav-product-experience',
        title: 'Go to Product Experience',
        description: 'View the interactive Employee, Manager, and Admin console preview',
        icon: Monitor,
        category: 'NAVIGATE',
        keywords: ['product', 'experience', 'preview', 'consoles', 'demo', 'roles'],
        action: 'scroll',
        target: '#product-experience',
      },
      {
        id: 'nav-workflow',
        title: 'Go to Workflow',
        description: 'Inspect the 3-stage audited leave and quorum workflow pipeline',
        icon: ArrowLeftRight,
        category: 'NAVIGATE',
        keywords: ['workflow', 'process', 'pipeline', 'stages', 'approval queue', 'quorum'],
        action: 'scroll',
        target: '#workflow',
      },
      {
        id: 'nav-security',
        title: 'Go to Security',
        description: 'Review 4-layer defense architecture, RBAC, and audit logs',
        icon: ShieldCheck,
        category: 'NAVIGATE',
        keywords: ['security', 'architecture', 'rbac', 'audit', 'jwt', 'isolation', 'governance'],
        action: 'scroll',
        target: '#security',
      },
    ],
  },
  {
    group: 'PRODUCT PREVIEW',
    items: [
      {
        id: 'preview-employee',
        title: 'Preview Employee Console',
        description: 'Activate personal leave balance, quota pool, and request history',
        icon: User,
        category: 'PRODUCT PREVIEW',
        keywords: ['employee', 'personal', 'quota', 'balance', 'apply leave', 'request'],
        action: 'role-preview',
        roleId: 'employee',
        target: '#product-experience',
      },
      {
        id: 'preview-manager',
        title: 'Preview Manager Console',
        description: 'Activate team absence ledger, approval queue, and quorum monitor',
        icon: Users,
        category: 'PRODUCT PREVIEW',
        keywords: ['manager', 'approvals', 'team', 'absence ledger', 'quorum', 'review'],
        action: 'role-preview',
        roleId: 'manager',
        target: '#product-experience',
      },
      {
        id: 'preview-admin',
        title: 'Preview Admin / HR Console',
        description: 'Activate organization policy master, system metrics, and audit digest',
        icon: Shield,
        category: 'PRODUCT PREVIEW',
        keywords: ['admin', 'hr', 'administrator', 'policy master', 'metrics', 'compliance', 'audit'],
        action: 'role-preview',
        roleId: 'admin',
        target: '#product-experience',
      },
    ],
  },
  {
    group: 'QUICK ACTIONS',
    items: [
      {
        id: 'action-explore',
        title: 'Explore ELMS',
        description: 'Explore the end-to-end workforce management platform',
        icon: Compass,
        category: 'QUICK ACTIONS',
        keywords: ['explore', 'elms', 'overview', 'platform', 'tour'],
        action: 'scroll',
        target: '#product-experience',
      },
      {
        id: 'action-signin',
        title: 'Sign In',
        description: 'Navigate to existing enterprise authentication gateway',
        icon: Lock,
        category: 'QUICK ACTIONS',
        keywords: ['sign in', 'login', 'auth', 'sso', 'credentials', 'portal'],
        action: 'navigate',
        target: '/login',
      },
      {
        id: 'action-demo',
        title: 'Run Product Demo',
        description: 'Execute the interactive 3-stage workflow execution sequence',
        icon: Play,
        category: 'QUICK ACTIONS',
        keywords: ['run', 'product demo', 'demo', 'simulation', 'workflow demo', 'simulate'],
        action: 'run-demo',
        target: '#workflow',
      },
    ],
  },
];

/**
 * Command Center / Command Palette (Phase 6)
 *
 * Premium enterprise command center providing keyboard-driven (Ctrl+K / Cmd+K)
 * search and execution across landing sections, role consoles, and interactive workflows.
 */
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Filter commands by title, category, description, and keywords
  const filteredGroups = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return COMMAND_GROUPS;

    return COMMAND_GROUPS.map((grp) => {
      const matchingItems = grp.items.filter((item) => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inCategory = item.category.toLowerCase().includes(q);
        const inKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
        return inTitle || inDesc || inCategory || inKeywords;
      });

      return {
        ...grp,
        items: matchingItems,
      };
    }).filter((grp) => grp.items.length > 0);
  }, [query]);

  // Flattened list of visible commands for keyboard navigation
  const flatCommands = useMemo(() => {
    return filteredGroups.flatMap((grp) => grp.items);
  }, [filteredGroups]);

  // Focus input and reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= flatCommands.length) {
      setSelectedIndex(Math.max(0, flatCommands.length - 1));
    }
  }, [flatCommands.length, selectedIndex]);

  // Global ESC listener while open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute selected command
  const executeCommand = (cmd) => {
    if (!cmd) return;
    onClose();

    if (cmd.action === 'scroll') {
      const el = document.querySelector(cmd.target);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cmd.action === 'navigate') {
      navigate(cmd.target);
    } else if (cmd.action === 'role-preview') {
      const el = document.querySelector(cmd.target);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(
        new CustomEvent('elms:switch-role', { detail: { roleId: cmd.roleId } })
      );
    } else if (cmd.action === 'run-demo') {
      const el = document.querySelector(cmd.target);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(new CustomEvent('elms:run-workflow-demo'));
    }
  };

  // Keyboard navigation inside palette input
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatCommands.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatCommands.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatCommands[selectedIndex]) {
        executeCommand(flatCommands[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Center"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-6"
    >
      {/* Dim Translucent Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      />

      {/* Main Panel Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Header with Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
            <Command className="w-4 h-4 text-brand-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[9px] font-bold text-brand-700 tracking-wider uppercase">
                Command Center
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search commands, sections, or actions..."
              aria-label="Search commands, sections, or actions"
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title="Close Command Center"
              aria-label="Close Command Center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
          {flatCommands.length === 0 ? (
            <div className="py-12 px-4 text-center font-mono">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                No matching commands
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                No matching commands found for &ldquo;{query}&rdquo;. Try searching for &ldquo;manager&rdquo;, &ldquo;security&rdquo;, &ldquo;workflow&rdquo;, or &ldquo;login&rdquo;.
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group} className="py-2 first:pt-1 last:pb-1">
                {/* Group Heading */}
                <div className="px-3 py-1 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.group}
                </div>

                {/* Group Items */}
                <div className="space-y-1 mt-1">
                  {group.items.map((cmd) => {
                    const Icon = cmd.icon;
                    const itemFlatIndex = flatCommands.findIndex((c) => c.id === cmd.id);
                    const isSelected = itemFlatIndex === selectedIndex;

                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={cmd.title}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(itemFlatIndex)}
                        className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                          isSelected
                            ? 'bg-brand-50/90 border border-brand-200/80 shadow-2xs'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-150 ${
                              isSelected
                                ? 'bg-brand-700 text-white border-brand-700 shadow-2xs scale-105'
                                : 'bg-slate-100 text-slate-600 border-slate-200/80'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold truncate ${
                                  isSelected ? 'text-brand-950 font-bold' : 'text-slate-900'
                                }`}
                              >
                                {cmd.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                              {cmd.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isSelected && (
                            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-semibold text-brand-700 bg-brand-100/70 px-1.5 py-0.5 rounded border border-brand-200/60 shadow-2xs">
                              ↵
                            </kbd>
                          )}
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform duration-150 ${
                              isSelected
                                ? 'text-brand-700 translate-x-0.5'
                                : 'text-slate-300'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Palette Footer Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-slate-600 font-semibold tracking-wider">
            SIMULATED PRODUCT NAVIGATION
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
export { CommandPalette as CommandCenter };
