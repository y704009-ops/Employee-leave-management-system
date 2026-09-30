import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  User,
  Users,
  Shield,
  Lock,
  Layers,
  CalendarCheck,
  Compass,
  FileCheck2,
  X,
  CornerDownLeft,
} from 'lucide-react';

const COMMANDS = [
  {
    id: 'hero',
    category: 'SECTIONS',
    title: 'Hero & Live Absence Ledger Node',
    description: 'Jump to top hero, live workflow stages, and staffing quorum metrics',
    icon: Compass,
    action: 'scroll',
    target: '#hero',
  },
  {
    id: 'capabilities',
    category: 'SECTIONS',
    title: 'Statutory Capabilities & Governance',
    description: 'Explore the 6 enterprise modules and simulated leave request sandbox',
    icon: Layers,
    action: 'scroll',
    target: '#capabilities',
  },
  {
    id: 'workflow',
    category: 'SECTIONS',
    title: 'Standardized Execution Pipeline',
    description: 'View the 3-step audited process: Plan & Apply, Review, Reconcile',
    icon: CalendarCheck,
    action: 'scroll',
    target: '#workflow',
  },
  {
    id: 'roles',
    category: 'SECTIONS',
    title: 'Role-Based Access Consoles (RBAC)',
    description: 'Inspect Employee, Manager, and Admin segmented workspaces',
    icon: Users,
    action: 'scroll',
    target: '#roles',
  },
  {
    id: 'security',
    category: 'SECTIONS',
    title: 'Security & Governance Architecture',
    description: 'Review JWT filter chain, database isolation, and live audit journal',
    icon: FileCheck2,
    action: 'scroll',
    target: '#security',
  },
  {
    id: 'login',
    category: 'WORKSPACES & SSO',
    title: 'Enterprise Single Sign-On (SSO)',
    description: 'Authenticate into corporate workspace via JWT credentials',
    icon: Lock,
    action: 'navigate',
    target: '/login',
  },
  {
    id: 'employee-console',
    category: 'WORKSPACES & SSO',
    title: 'Employee Self-Service Console',
    description: 'Submit leave applications, view entitlement pools, and check balance',
    icon: User,
    action: 'navigate',
    target: '/login',
  },
  {
    id: 'manager-console',
    category: 'WORKSPACES & SSO',
    title: 'Manager Approval & Quorum Console',
    description: 'Review subordinate queues, verify staffing quorum, and sign requests',
    icon: Users,
    action: 'navigate',
    target: '/login',
  },
  {
    id: 'admin-console',
    category: 'WORKSPACES & SSO',
    title: 'HR & Administrator Governance Engine',
    description: 'Configure statutory leave policies, carryover limits, and audit logs',
    icon: Shield,
    action: 'navigate',
    target: '/login',
  },
];

/**
 * Enterprise Command Palette (Ctrl+K / Cmd+K)
 * Clean, accessible keyboard-driven navigation modal for the SkillMate landing page.
 */
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter commands by title, category, or description
  const filteredCommands = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Focus input on open and reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);

  // Execute selected command
  const executeCommand = (cmd) => {
    if (!cmd) return;
    onClose();

    if (cmd.action === 'scroll') {
      const element = document.querySelector(cmd.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cmd.action === 'navigate') {
      navigate(cmd.target);
    }
  };

  // Keyboard navigation inside palette
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SkillMate Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4"
    >
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Palette Container */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, section, or role (e.g. Quorum, Security, SSO)..."
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Close palette"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 font-mono">
              No matching commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-50/70 border border-brand-200/60 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-brand-900' : 'text-slate-900'
                          }`}
                        >
                          {cmd.title}
                        </span>
                        <span className="font-mono text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60 uppercase">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5 font-normal">
                        {cmd.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-brand-700 bg-brand-100/60 px-1.5 py-0.5 rounded">
                        <CornerDownLeft className="w-2.5 h-2.5" />
                        <span>SELECT</span>
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to dismiss</span>
          </div>
          <span className="text-slate-500 font-semibold hidden sm:inline">
            SkillMate Command Palette
          </span>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;
