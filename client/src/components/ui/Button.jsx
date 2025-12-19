import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
  icon,
  ...props
}) => {
  const baseClass = 'btn-base';
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'w-full' : '';

  // Variant style mappings with fallback inline styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.35)',
    },
    secondary: {
      background: '#F1F5F9',
      color: '#1E293B',
      border: '1px solid #E2E8F0',
    },
    success: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.35)',
    },
    outline: {
      background: 'transparent',
      color: '#6366F1',
      border: '2px solid #6366F1',
    },
    ghost: {
      background: 'transparent',
      color: '#64748B',
      border: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.35)',
    },
  };

  // Size mapping
  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
  };

  // Combine styles
  const combinedStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '0.625rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <motion.button
      type={type}
      className={`${baseClass} ${variantClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={combinedStyles}
      {...props}
    >
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span>{children}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          {children}
        </div>
      )}
    </motion.button>
  );
};

export default Button;

