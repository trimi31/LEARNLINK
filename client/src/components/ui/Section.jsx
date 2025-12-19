import React from 'react';

/**
 * Standard section wrapper - consistent spacing between page sections
 */
const Section = ({ 
  title, 
  description,
  actions,
  children, 
  spacing = 'default', // 'small' | 'default' | 'large'
  className = '' 
}) => {
  const spacingClasses = {
    small: 'mb-8',
    default: 'mb-12',
    large: 'mb-16'
  };

  return (
    <section className={`page-section ${spacingClasses[spacing]} ${className}`.trim()}>
      {(title || actions) && (
        <div className="section-header">
          <div className="section-header-content">
            {title && <h2 className="section-title">{title}</h2>}
            {description && <p className="section-description">{description}</p>}
          </div>
          {actions && (
            <div className="section-header-actions">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="section-content">
        {children}
      </div>
    </section>
  );
};

export default Section;
