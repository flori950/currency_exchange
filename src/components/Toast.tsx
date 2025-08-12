import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { ToastMessage } from '../types';
import '../styles/Toast.css';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const getIcon = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="toast-icon" />;
    case 'error':
      return <AlertCircle className="toast-icon" />;
    case 'warning':
      return <AlertTriangle className="toast-icon" />;
    case 'info':
    default:
      return <Info className="toast-icon" />;
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        {getIcon(toast.type)}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
