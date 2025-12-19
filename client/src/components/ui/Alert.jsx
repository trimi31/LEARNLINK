import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-600" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      text: 'text-yellow-800',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
  };

  const style = variants[variant] || variants.info;

  return (
    <div
      className={`
        relative w-full rounded-xl border p-4 shadow-sm
        flex items-start gap-3
        ${style.bg} ${style.border} ${style.text}
        ${className}
      `.trim()}
      role="alert"
    >
      <div className="shrink-0">
        {style.icon}
      </div>
      <div className="text-sm font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Alert;

