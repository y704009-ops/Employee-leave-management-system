import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status = 'PENDING', className = '' }) => {
  const normalizedStatus = (status || 'PENDING').toUpperCase();
  const colorClass = STATUS_COLORS[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border tracking-tight ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" aria-hidden="true" />
      {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
