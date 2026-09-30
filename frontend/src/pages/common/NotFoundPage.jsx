import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-3 bg-slate-100 border border-slate-200/80 rounded-xl text-slate-500 mb-4 shadow-xs">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">404</h1>
      <h2 className="text-lg font-semibold text-slate-800 mt-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
        The route or view you are looking for does not exist or may have been relocated within the portal.
      </p>
      <Link to="/employee/dashboard">
        <Button size="sm" icon={ArrowLeft}>Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
