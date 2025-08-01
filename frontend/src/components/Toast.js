import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContainer = ({ position = 'bottom-right' }) => {
  const [toasts, setToasts] = useState([]);

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return createPortal(
    <div
      className={`fixed z-50 m-4 flex flex-col gap-2 ${positions[position]}`}
      style={{ maxWidth: 'calc(100% - 2rem)' }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      icon: '✓',
      classes: 'border-green-500/30 text-green-300',
    },
    error: {
      icon: '✕',
      classes: 'border-red-500/30 text-red-300',
    },
    warning: {
      icon: '⚠',
      classes: 'border-yellow-500/30 text-yellow-300',
    },
    info: {
      icon: 'ℹ',
      classes: 'border-blue-500/30 text-blue-300',
    },
  };

  return (
    <div
      className={`glass-card p-4 pr-12 border ${
        types[type].classes
      } animate-[slideIn_0.3s_ease-out_forwards] relative min-w-[300px] max-w-md shadow-xl`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{types[type].icon}</span>
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 animate-[shrink_linear_forwards]" style={{ 
        width: '100%',
        animation: `shrink ${duration}ms linear forwards`
      }} />
    </div>
  );
};

// Create a toast manager
const toastManager = {
  container: null,
  
  show(message, type = 'info', duration = 5000) {
    if (this.container) {
      const id = Math.random().toString(36).substr(2, 9);
      this.container.setToasts((prev) => [
        ...prev,
        { id, message, type, duration },
      ]);
    }
  },

  success(message, duration) {
    this.show(message, 'success', duration);
  },

  error(message, duration) {
    this.show(message, 'error', duration);
  },

  warning(message, duration) {
    this.show(message, 'warning', duration);
  },

  info(message, duration) {
    this.show(message, 'info', duration);
  },
};

export { ToastContainer, toastManager }; 