import React from 'react';
import { motion } from 'framer-motion';

/**
 * Visual Level Selector with cards instead of dropdown
 */
const LevelSelector = ({
    value,
    onChange,
    label,
    disabled = false,
}) => {
    const levels = [
        {
            value: 'BEGINNER',
            label: 'Beginner',
            icon: '🌱',
            description: 'No prior knowledge needed',
            color: '#10B981',
        },
        {
            value: 'INTERMEDIATE',
            label: 'Intermediate',
            icon: '📚',
            description: 'Some experience required',
            color: '#F59E0B',
        },
        {
            value: 'ADVANCED',
            label: 'Advanced',
            icon: '🚀',
            description: 'Expert-level content',
            color: '#8B5CF6',
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#334155',
                    marginBottom: '0.5rem',
                }}>
                    {label}
                </label>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
            }}>
                {levels.map((level) => {
                    const isSelected = value === level.value;

                    return (
                        <motion.button
                            key={level.value}
                            type="button"
                            disabled={disabled}
                            onClick={() => !disabled && onChange?.(level.value)}
                            whileHover={{ scale: disabled ? 1 : 1.02 }}
                            whileTap={{ scale: disabled ? 1 : 0.98 }}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '1rem 0.75rem',
                                background: isSelected
                                    ? `linear-gradient(135deg, ${level.color}10 0%, ${level.color}05 100%)`
                                    : '#FFFFFF',
                                border: `2px solid ${isSelected ? level.color : '#E2E8F0'}`,
                                borderRadius: '0.75rem',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: disabled ? 0.5 : 1,
                            }}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-6px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: level.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    ✓
                                </motion.div>
                            )}

                            {/* Icon */}
                            <span style={{ fontSize: '1.5rem' }}>{level.icon}</span>

                            {/* Label */}
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: isSelected ? level.color : '#1E293B',
                            }}>
                                {level.label}
                            </span>

                            {/* Description */}
                            <span style={{
                                fontSize: '0.6875rem',
                                color: '#64748B',
                                textAlign: 'center',
                                lineHeight: 1.3,
                            }}>
                                {level.description}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelector;
