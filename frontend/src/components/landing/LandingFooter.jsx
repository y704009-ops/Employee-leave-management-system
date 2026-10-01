import React from 'react';
import { Link } from 'react-router-dom';
import WorkoraLogo from '../common/WorkoraLogo';

/**
 * LandingFooter Component (Phase 7 Enterprise Polish)
 *
 * Clean, consistent enterprise dark footer with authentic system navigation,
 * dynamic year, operational status pill, and security disclaimer.
 */
const CURRENT_YEAR = new Date().getFullYear();

const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#030712] border-t border-slate-800/80 py-12 lg:py-16 font-sans text-slate-400">
      <div className="w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <WorkoraLogo size={32} className="shrink-0" idPrefix="workora-footer" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">WORKORA</span>
              <span className="text-xs text-slate-400 leading-tight">
                Workforce Management System
              </span>
            </div>
          </div>

          {/* Quick Navigation Anchors */}
          <nav className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs font-semibold text-slate-300" aria-label="Footer Navigation">
            <a href="#hero" className="hover:text-white transition-colors">
              Product
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#product-experience" className="hover:text-white transition-colors">
              Role Consoles
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
            <Link to="/login" className="hover:text-sky-300 transition-colors text-sky-400 font-bold">
              Sign In
            </Link>
          </nav>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono font-semibold text-emerald-400 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Product Preview</span>
          </div>
        </div>

        {/* Sub-Footer Copyright & Product Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <p>© {CURRENT_YEAR} WORKORA. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Workforce Management System • Product Preview</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
