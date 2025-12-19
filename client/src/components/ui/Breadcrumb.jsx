import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Smart Breadcrumb component with automatic path detection
 */
const Breadcrumb = ({ items, className = '' }) => {
    const location = useLocation();

    // If no items provided, try to auto-generate from path
    const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

    return (
        <nav
            aria-label="Breadcrumb"
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
            }}
        >
            {/* Home link */}
            <Link
                to="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#6366F1'}
                onMouseLeave={(e) => e.target.style.color = '#64748B'}
            >
                <Home size={16} />
            </Link>

            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                    <React.Fragment key={item.path || index}>
                        <ChevronRight size={14} color="#CBD5E1" />
                        {isLast ? (
                            <span style={{
                                color: '#1E293B',
                                fontWeight: 500,
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                style={{
                                    color: '#64748B',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#6366F1'}
                                onMouseLeave={(e) => e.target.style.color = '#64748B'}
                            >
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

// Helper function to auto-generate breadcrumbs from path
const generateBreadcrumbs = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    const items = [];

    const pathLabels = {
        courses: 'Courses',
        professors: 'Professors',
        professor: 'Dashboard',
        student: 'Dashboard',
        dashboard: 'Dashboard',
        settings: 'Settings',
        messages: 'Messages',
        bookings: 'Bookings',
        availability: 'Availability',
    };

    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // Skip UUIDs in breadcrumbs (show as "Details" instead)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

        if (!isUUID) {
            items.push({
                label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
                path: currentPath,
            });
        } else if (index === segments.length - 1) {
            // Last segment that's a UUID - shows as "Details"
            items.push({
                label: 'Details',
                path: currentPath,
            });
        }
    });

    return items;
};

export default Breadcrumb;
