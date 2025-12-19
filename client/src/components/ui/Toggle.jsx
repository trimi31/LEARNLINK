import React from 'react';
import { motion } from 'framer-motion';

/**
 * iOS-style Toggle Switch Component
 * More intuitive than a checkbox for on/off settings
 */
const Toggle = ({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
}) => {
    const sizes = {
        sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-4 h-4', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-5 h-5', translate: 'translate-x-7' },
    };

    const s = sizes[size];

    return (
        <label
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {/* Toggle Track */}
            <motion.button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange?.(!checked)}
                style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: size === 'sm' ? '36px' : size === 'lg' ? '56px' : '44px',
                    height: size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px',
                    borderRadius: '999px',
                    background: checked
                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        : '#E2E8F0',
                    border: 'none',
                    padding: '2px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
            >
                {/* Toggle Thumb */}
                <motion.div
                    style={{
                        width: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
                        height: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
                        borderRadius: '999px',
                        background: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                    }}
                    animate={{
                        x: checked
                            ? size === 'sm' ? 16 : size === 'lg' ? 28 : 20
                            : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </motion.button>

            {/* Label & Description */}
            {(label || description) && (
                <div style={{ flex: 1, minWidth: 0 }}>
                    {label && (
                        <div style={{
                            fontWeight: 500,
                            fontSize: '0.9375rem',
                            color: '#1E293B',
                        }}>
                            {label}
                        </div>
                    )}
                    {description && (
                        <div style={{
                            fontSize: '0.8125rem',
                            color: '#64748B',
                            marginTop: '0.125rem',
                            lineHeight: 1.4,
                        }}>
                            {description}
                        </div>
                    )}
                </div>
            )}
        </label>
    );
};

export default Toggle;
