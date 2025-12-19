import React from 'react';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem',
      padding: fullScreen ? 0 : '4rem 2rem'
    }}>
      {/* Modern gradient spinner */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, transparent, var(--brand-primary))',
        animation: 'spin 0.8s linear infinite',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: '4px',
          borderRadius: '50%',
          background: 'var(--bg-primary)'
        }} />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{ 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontSize: '0.9375rem',
          fontWeight: 500
        }}>
          {message}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}>
        {content}
      </div>
    );
  }

  return (
    <div className="loading" style={{ minHeight: '300px' }}>
      {content}
    </div>
  );
};

export default Loader;
