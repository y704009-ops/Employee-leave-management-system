import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastStyles = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
  },
  error: {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  },
  info: {
    bg: 'bg-sky-50 border-sky-200 text-sky-900',
    icon: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
  },
};

const Toast = ({ toast, onClose }) => {
  const { message, type = 'info', duration = 4000 } = toast;
  const style = toastStyles[type] || toastStyles.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${style.bg}`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        {style.icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-black/5 transition-colors focus:outline-none"
        aria-label="Close toast"
      >
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
};

export default Toast;
