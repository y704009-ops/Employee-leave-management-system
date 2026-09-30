import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  CheckSquare,
  Calendar,
  Users,
  Building2,
  Sliders,
  Scale,
  BarChart3,
  User,
  X,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const role = user?.role || 'EMPLOYEE';

  const navSections = [
    {
      title: 'Employee Portal',
      visible: true,
      items: [
        { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
        { name: 'Apply Leave', path: '/employee/apply-leave', icon: CalendarPlus },
        { name: 'My Leaves', path: '/employee/my-leaves', icon: History },
        { name: 'My Profile', path: '/employee/profile', icon: User },
      ],
    },
    {
      title: 'Manager Portal',
      visible: role === 'MANAGER' || role === 'ADMIN',
      items: [
        { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
        { name: 'Approval Queue', path: '/manager/approval-queue', icon: CheckSquare },
        { name: 'Team Calendar', path: '/manager/team-calendar', icon: Calendar },
        { name: 'Team History', path: '/manager/team-history', icon: History },
        { name: 'Team Reports', path: '/manager/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'Admin Console',
      visible: role === 'ADMIN',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Employees', path: '/admin/employees', icon: Users },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
        { name: 'Leave Types', path: '/admin/leave-types', icon: Sliders },
        { name: 'Leave Balances', path: '/admin/leave-balances', icon: Scale },
        { name: 'Reports & Export', path: '/admin/reports', icon: BarChart3 },
      ],
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-brand-600 rounded-lg text-white shadow-xs flex-shrink-0">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-sm tracking-tight truncate">ELMS</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-brand-300 border border-slate-700">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal truncate">Enterprise Leave</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.filter((s) => s.visible).map((section) => (
            <div key={section.title} className="space-y-1">
              <h2 className="px-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Info & Logout Footer */}
        {user && (
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/70">
            <div className="flex items-center space-x-2.5 mb-2.5 px-1">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/15 text-brand-300 border border-brand-500/25 flex-shrink-0">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-md text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
