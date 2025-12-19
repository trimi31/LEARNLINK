import React from 'react';
import './Skeleton.css';

const Skeleton = ({
    variant = 'text',
    width,
    height,
    className = '',
    count = 1
}) => {
    const getStyles = () => {
        const styles = {};
        if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
        if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
        return styles;
    };

    const skeletonClass = `skeleton skeleton-${variant} ${className}`;

    if (count > 1) {
        return (
            <>
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={skeletonClass} style={getStyles()} />
                ))}
            </>
        );
    }

    return <div className={skeletonClass} style={getStyles()} />;
};

// Pre-built skeleton cards for common use cases
export const CourseCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-card-header">
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="rectangular" width={60} height={28} />
        </div>
        <Skeleton variant="text" height={24} width="80%" />
        <Skeleton variant="text" count={2} />
        <div className="skeleton-card-footer">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={100} />
        </div>
        <Skeleton variant="rectangular" height={40} style={{ marginTop: 'auto' }} />
    </div>
);

export const ProfessorCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-card-header">
            <Skeleton variant="circular" width={56} height={56} />
            <div style={{ flex: 1 }}>
                <Skeleton variant="text" height={20} width="70%" />
                <Skeleton variant="text" height={14} width="50%" />
            </div>
        </div>
        <div className="skeleton-tags">
            <Skeleton variant="rectangular" width={60} height={22} />
            <Skeleton variant="rectangular" width={80} height={22} />
            <Skeleton variant="rectangular" width={50} height={22} />
        </div>
        <Skeleton variant="text" count={2} />
        <Skeleton variant="rectangular" height={40} style={{ marginTop: 'auto' }} />
    </div>
);

export default Skeleton;
