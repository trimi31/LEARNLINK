import React from 'react';

/**
 * Standard page header - consistent heading, description, and action buttons
 */
const PageHeader = ({ 
  title, 
  description, 
  badge, 
  actions,
  className = '' 
}) => {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header-content">
        {badge && (
          <div className="page-header-badge">
            {badge}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {description && (
          <p className="page-description">{description}</p>
        )}
      </div>
      {actions && (
        <div className="page-header-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
