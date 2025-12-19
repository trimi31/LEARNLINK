import React from 'react';

/**
 * Standard page layout wrapper - ensures all pages have consistent spacing and structure
 */
const PageLayout = ({ 
  children, 
  maxWidth = '1200px',
  padding = 'default', // 'default' | 'none' | 'small' | 'large'
  className = '' 
}) => {
  const paddingClasses = {
    none: '',
    small: 'py-8',
    default: 'py-12 md:py-16',
    large: 'py-16 md:py-24'
  };

  return (
    <div className={`page-layout ${paddingClasses[padding]} ${className}`.trim()}>
      <div className="container" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
