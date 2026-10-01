import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogIn, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const todayFormatted = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
}).format(new Date());

const routeTitleMap = {
  '/login': { portal: 'Authentication', title: 'Sign In' },
  '/employee/dashboard': { portal: 'Employee Portal', title: 'Dashboard' },
  '/employee/apply-leave': { portal: 'Employee Portal', title: 'Apply for Leave' },
  '/employee/my-leaves': { portal: 'Employee Portal', title: 'My Leaves' },
  '/employee/profile': { portal: 'Employee Portal', title: 'My Profile' },
  '/manager/dashboard': { portal: 'Manager Portal', title: 'Team Dashboard' },
  '/manager/approval-queue': { portal: 'Manager Portal', title: 'Approval Queue' },
  '/manager/team-calendar': { portal: 'Manager Portal', title: 'Team Calendar' },
  '/manager/team-history': { portal: 'Manager Portal', title: 'Team History' },
  '/manager/reports': { portal: 'Manager Portal', title: 'Team Reports' },
  '/admin/dashboard': { portal: 'Admin Console', title: 'Overview Dashboard' },
  '/admin/employees': { portal: 'Admin Console', title: 'Employee Directory' },
  '/admin/departments': { portal: 'Admin Console', title: 'Department Management' },
  '/admin/leave-types': { portal: 'Admin Console', title: 'Leave Type Policies' },
  '/admin/leave-balances': { portal: 'Admin Console', title: 'Balance Quotas' },
  '/admin/reports': { portal: 'Admin Console', title: 'Reports & Analytics' },
  '/403': { portal: 'Security', title: 'Access Forbidden' },
  '/404': { portal: 'Navigation', title: 'Page Not Found' },
};

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess, clearToasts } = useToast();

  const currentRoute = routeTitleMap[location.pathname] || {
    portal: 'WORKORA',
    title: 'Leave Management',
  };

  const handleLogout = async () => {
    clearToasts?.();
    navigate('/login', { replace: true, state: null });
    await logout();
    showSuccess('Logged out successfully');
  };

  return (
    <header className="h-15 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 shadow-2xs">
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex items-center space-x-2">
          <span className="hidden sm:inline text-xs font-medium text-slate-400">
            {currentRoute.portal}
          </span>
          <span className="hidden sm:inline text-slate-300 font-light" aria-hidden="true">/</span>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate">
            {currentRoute.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Date Stamp */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayFormatted}</span>
        </div>

        {isAuthenticated && user ? (
          <>
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-label="Online status" />
              <span className="font-semibold text-slate-800">{user.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-all text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all text-xs font-medium text-slate-700"
          >
            <LogIn className="w-3.5 h-3.5 text-brand-600" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
