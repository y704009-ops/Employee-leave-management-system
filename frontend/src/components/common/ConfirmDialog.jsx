import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const icons = {
    danger: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
    primary: <HelpCircle className="w-5 h-5 text-brand-600" />,
  };

  const bgColors = {
    danger: 'bg-rose-50 border border-rose-100',
    warning: 'bg-amber-50 border border-amber-100',
    primary: 'bg-brand-50 border border-brand-100',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start space-x-3.5">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${bgColors[variant] || bgColors.danger}`}>
          {icons[variant] || icons.danger}
        </div>
        <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">
          {message}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
