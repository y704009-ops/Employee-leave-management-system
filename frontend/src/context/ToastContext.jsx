import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const removeToastsMatching = useCallback((predicate) => {
    if (typeof predicate !== 'function') return;
    setToasts((prev) => prev.filter((t) => !predicate(t)));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    if (!message) return;

    setToasts((prev) => {
      // 1. Deduplication: prevent duplicate toast if an identical message & type is already active
      if (prev.some((t) => t.message === message && t.type === type)) {
        return prev;
      }

      // 2. Mutual exclusion for auth lifecycle events
      const isWelcomeToast = typeof message === 'string' && message.toLowerCase().includes('welcome back');
      const isLogoutToast = typeof message === 'string' && message.toLowerCase().includes('logged out');

      let filtered = prev;
      if (isLogoutToast) {
        // Logging out terminates the session: flush all prior session toasts
        filtered = [];
      } else if (isWelcomeToast) {
        // Logging in begins a new session: eliminate any lingering logout / auth messages
        filtered = filtered.filter((t) => {
          if (typeof t.message !== 'string') return true;
          const msg = t.message.toLowerCase();
          return !msg.includes('logged out') && !msg.includes('welcome back');
        });
      }

      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      return [...filtered, { id, message, type, duration }];
    });
  }, []);

  const showSuccess = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const showError = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const showInfo = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const showWarning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeToast,
        clearToasts,
        removeToastsMatching,
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
