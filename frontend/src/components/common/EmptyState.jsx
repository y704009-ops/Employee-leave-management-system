import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  title = 'No data found',
  description = 'There are no items to display at this time.',
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-xl border border-slate-200/90 shadow-xs my-4">
      <div className="p-3.5 bg-slate-100/80 rounded-xl mb-3.5 text-slate-400 border border-slate-200/60">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
