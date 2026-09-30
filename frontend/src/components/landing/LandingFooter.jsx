import React from 'react';
import { Lock } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 border border-brand-600/30 flex items-center justify-center shadow-xs">
              <span className="text-white font-extrabold text-sm tracking-wider font-mono">E</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 leading-tight">SkillMate ELMS</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-700 font-bold border border-slate-200">
                  v2.4
                </span>
              </div>
              <span className="text-xs text-slate-500 leading-tight">
                Enterprise Leave Management System
              </span>
            </div>
          </div>

          {/* Quick Navigation Anchors */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-brand-700 transition-colors">
              Home
            </a>
            <a href="#capabilities" className="hover:text-brand-700 transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-brand-700 transition-colors">
              Workflow
            </a>
            <a href="#roles" className="hover:text-brand-700 transition-colors">
              Roles
            </a>
            <a href="#security" className="hover:text-brand-700 transition-colors">
              Security
            </a>
          </div>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-semibold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Operational (All Services Active)</span>
          </div>
        </div>

        {/* Sub-Footer Copyright & Security Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2025 SkillMate / ELMS Corporate Systems. All internal rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Restricted Internal Corporate Network. Authorized personnel only.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
