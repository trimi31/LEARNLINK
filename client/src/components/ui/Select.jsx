import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Enhanced Select Dropdown with search and better styling
 */
const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    searchable = false,
    error,
    required = false,
    disabled = false,
    id,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#334155',
                        marginBottom: '0.375rem',
                    }}
                >
                    {label}
                    {required && <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                id={inputId}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 1rem',
                    fontSize: '0.9375rem',
                    color: selectedOption ? '#1E293B' : '#94A3B8',
                    background: disabled ? '#F8FAFC' : '#FFFFFF',
                    border: `1px solid ${error ? '#EF4444' : isOpen ? '#6366F1' : '#E2E8F0'}`,
                    borderRadius: '0.625rem',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption?.label || placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={18} color="#64748B" />
                </motion.div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '0.5rem',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.75rem',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            zIndex: 50,
                        }}
                    >
                        {/* Search Input */}
                        {searchable && (
                            <div style={{ padding: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.875rem',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '0.5rem',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        )}

                        {/* Options List */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange?.(option.value);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.9375rem',
                                            color: '#1E293B',
                                            background: option.value === value ? '#F1F5F9' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                            textAlign: 'left',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (option.value !== value) e.target.style.background = '#F8FAFC';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = option.value === value ? '#F1F5F9' : 'transparent';
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {option.icon && <span>{option.icon}</span>}
                                            {option.label}
                                        </span>
                                        {option.value === value && (
                                            <Check size={16} color="#6366F1" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: '#94A3B8',
                                    fontSize: '0.875rem',
                                }}>
                                    No options found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <p style={{
                    marginTop: '0.375rem',
                    fontSize: '0.8125rem',
                    color: '#EF4444',
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
