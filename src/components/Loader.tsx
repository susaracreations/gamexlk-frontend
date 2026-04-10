import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className="loader-logo-pulse">
          <div className="loader-inner-core" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            color: 'white', 
            letterSpacing: '5px', 
            fontWeight: 900, 
            fontSize: '1.5rem',
            background: 'linear-gradient(to right, white, var(--accent-purple-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            GAMEXLK
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem', letterSpacing: '2px' }}>
            {message.toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
      <div className="spinner" />
      {message && <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>}
    </div>
  );
};

export default Loader;
