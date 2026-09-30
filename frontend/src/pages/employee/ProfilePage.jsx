import React from 'react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { Mail, Building, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-5 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Your official organization profile details, role, and reporting hierarchy.
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-xs flex-shrink-0 tracking-wider">
            {getInitials(user?.name)}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{user?.name || 'Authenticated User'}</h2>
            <p className="text-xs text-slate-500">{user?.departmentName || 'General Staff'}</p>
            <div className="pt-0.5">
              <StatusBadge status={user?.active !== false ? 'ACTIVE' : 'INACTIVE'} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-sm">
          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Email Address
              </span>
              <p className="font-medium text-slate-900 mt-0.5 font-mono text-xs">{user?.email || '—'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <Building className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Assigned Department
              </span>
              <p className="font-medium text-slate-900 mt-0.5">{user?.departmentName || 'Unassigned'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                System Role & Access
              </span>
              <p className="font-medium text-slate-900 mt-0.5">{user?.role || 'EMPLOYEE'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Reporting Manager
              </span>
              <p className="font-medium text-slate-900 mt-0.5">
                {user?.managerName || (user?.role === 'ADMIN' ? 'Self / Executive Board' : 'Not assigned')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
