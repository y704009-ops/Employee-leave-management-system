import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const ForbiddenPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 mb-4 shadow-xs">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">403</h1>
      <h2 className="text-lg font-semibold text-slate-800 mt-1">Access Restricted</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
        You do not have permission to access this resource or administrative section with your current account privileges.
      </p>
      <Link to="/employee/dashboard">
        <Button size="sm" icon={ArrowLeft}>Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
