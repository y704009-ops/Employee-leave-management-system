import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorAlert = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 flex items-start space-x-3 my-4">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm text-rose-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 underline focus:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
