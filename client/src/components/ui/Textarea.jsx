import React, { useState, useRef, useEffect } from 'react';

/**
 * Enhanced Textarea with character counter and auto-resize
 */
const Textarea = ({
    label,
    value = '',
    onChange,
    placeholder,
    maxLength,
    minRows = 3,
    maxRows = 8,
    error,
    hint,
    showCount = true,
    required = false,
    disabled = false,
    id,
    ...props
}) => {
    const textareaRef = useRef(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Auto-resize logic
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';

        // Calculate line height
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows * lineHeight;

        // Set new height within bounds
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
    }, [value, minRows, maxRows]);

    const charCount = value?.length || 0;
    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;

    return (
        <div style={{ width: '100%' }}>
            {/* Label Row */}
            {(label || (showCount && maxLength)) && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.375rem',
                }}>
                    {label && (
                        <label
                            htmlFor={inputId}
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#334155',
                            }}
                        >
                            {label}
                            {required && <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>}
                        </label>
                    )}
                    {showCount && maxLength && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: isOverLimit ? '#EF4444' : isNearLimit ? '#F59E0B' : '#94A3B8',
                            fontWeight: isNearLimit ? 500 : 400,
                            transition: 'color 0.2s ease',
                        }}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            )}

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                id={inputId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9375rem',
                    lineHeight: '1.5',
                    color: '#1E293B',
                    background: disabled ? '#F8FAFC' : '#FFFFFF',
                    border: `1px solid ${error ? '#EF4444' : isOverLimit ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '0.625rem',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'text',
                    minHeight: `${minRows * 24}px`,
                }}
                onFocus={(e) => {
                    if (!error && !isOverLimit) {
                        e.target.style.borderColor = '#6366F1';
                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error || isOverLimit ? '#EF4444' : '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                }}
                {...props}
            />

            {/* Hint/Error Text */}
            {(hint || error) && (
                <p style={{
                    marginTop: '0.375rem',
                    fontSize: '0.8125rem',
                    color: error ? '#EF4444' : '#64748B',
                }}>
                    {error || hint}
                </p>
            )}
        </div>
    );
};

export default Textarea;
