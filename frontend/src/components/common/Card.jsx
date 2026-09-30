import React from 'react';

const Card = ({ children, title, subtitle, action, className = '', headerClassName = '', bodyClassName = 'p-5' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-xs transition-shadow duration-150 ${className}`}>
      {(title || subtitle || action) && (
        <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 ${headerClassName}`}>
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 flex items-center space-x-2">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
