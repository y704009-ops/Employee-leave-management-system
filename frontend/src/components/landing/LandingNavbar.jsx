import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import { User, ArrowRight, Menu, X, Shield, Lock, Command } from 'lucide-react';

const LandingNavbar = ({ onOpenCommandPalette }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position for elevation and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section detection
      const sections = ['hero', 'capabilities', 'workflow', 'product-experience', 'security'];
      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardRedirect = () => {
    if (user?.role) {
      navigate(getDashboardForRole(user.role));
    } else {
      navigate('/login');
    }
  };

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'Capabilities', href: '#capabilities', id: 'capabilities' },
    { label: 'Workflow', href: '#workflow', id: 'workflow' },
    { label: 'Product', href: '#product-experience', id: 'product-experience' },
    { label: 'Security', href: '#security', id: 'security' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/95 backdrop-blur-md border-b border-slate-800/90 shadow-xl'
          : 'bg-[#030712]/80 backdrop-blur-sm border-b border-slate-800/60'
      }`}
    >
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Identity */}
        <a
          href="#hero"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg p-1 -m-1"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 border border-sky-400/30 flex items-center justify-center shadow-xs group-hover:shadow transition-all">
            <span className="text-white font-extrabold text-base tracking-wider font-mono">E</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">SkillMate</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[10px] text-sky-400 font-bold border border-slate-800">
                ELMS v2.4
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal leading-none hidden xl:block">
              Enterprise Leave Management System
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with Active State */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-sky-300 bg-sky-950/80 border border-sky-800 shadow-2xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Primary Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Visible Command Center Trigger (Desktop) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-2xs font-mono"
            title="Open Command Center (Ctrl+K / Cmd+K)"
            aria-label="Open Command Center"
          >
            <Command className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-medium text-slate-200 font-sans">Command Center</span>
            <kbd className="font-mono text-[9px] font-bold bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-sky-300 shadow-2xs">
              CTRL K
            </kbd>
          </button>

          {/* Visible Quick Actions Trigger (Mobile) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex md:hidden items-center gap-1.5 h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors cursor-pointer font-mono"
            title="Quick Actions"
            aria-label="Quick Actions"
          >
            <Command className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-medium font-sans">Quick Actions</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleDashboardRedirect}
              className="inline-flex items-center gap-2 h-9 px-4 bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span>Dashboard ({user?.role?.toLowerCase() || 'user'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 h-9 px-4.5 bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow border border-sky-400/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Lock className="w-3.5 h-3.5 text-sky-200" />
              <span>Sign In with SSO</span>
            </Link>
          )}

          {/* User Profile Quick-Trigger */}
          <button
            onClick={() => (isAuthenticated ? handleDashboardRedirect() : navigate('/login'))}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            title={isAuthenticated ? `Signed in as ${user?.name || user?.email}` : 'Access Enterprise Portal'}
            aria-label="Account Access"
          >
            <User className="w-4 h-4 text-slate-400" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090e1a] border-b border-slate-800 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-150 text-slate-100">
          <nav className="flex flex-col gap-1 pb-4 border-b border-slate-800">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-sky-300 bg-sky-950/80 font-semibold border border-sky-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Command className="w-4 h-4 text-sky-400" />
                <span className="font-bold">Command Center</span>
              </span>
              <span className="font-mono text-[10px] text-sky-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">Quick Actions</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
                className="w-full flex items-center justify-center gap-2 h-11 bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-xl shadow-xs"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 h-11 bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-xl shadow-xs"
              >
                <Lock className="w-4 h-4 text-sky-200" />
                <span>Sign In with SSO</span>
              </Link>
            )}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono pt-1">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Restricted Corporate Gateway • Role-Based Access</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
