import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, message }) => {
  return (
    <div style={fullScreen ? {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 5, 16, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    } : {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0'
    }}>
      <style>{`
        .custom-spinner {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 10px;
        }

        .custom-spinner div {
          width: 8%;
          height: 24%;
          background: rgb(128, 128, 128);
          position: absolute;
          left: 50%;
          top: 30%;
          opacity: 0;
          border-radius: 50px;
          box-shadow: 0 0 3px rgba(0,0,0,0.2);
          animation: spinner-fade-animation 1s linear infinite;
        }

        @keyframes spinner-fade-animation {
          from { opacity: 1; }
          to { opacity: 0.25; }
        }

        .custom-spinner .spinner-bar-1 { transform: rotate(0deg) translate(0, -130%); animation-delay: 0s; }
        .custom-spinner .spinner-bar-2 { transform: rotate(30deg) translate(0, -130%); animation-delay: -1.1s; }
        .custom-spinner .spinner-bar-3 { transform: rotate(60deg) translate(0, -130%); animation-delay: -1s; }
        .custom-spinner .spinner-bar-4 { transform: rotate(90deg) translate(0, -130%); animation-delay: -0.9s; }
        .custom-spinner .spinner-bar-5 { transform: rotate(120deg) translate(0, -130%); animation-delay: -0.8s; }
        .custom-spinner .spinner-bar-6 { transform: rotate(150deg) translate(0, -130%); animation-delay: -0.7s; }
        .custom-spinner .spinner-bar-7 { transform: rotate(180deg) translate(0, -130%); animation-delay: -0.6s; }
        .custom-spinner .spinner-bar-8 { transform: rotate(210deg) translate(0, -130%); animation-delay: -0.5s; }
        .custom-spinner .spinner-bar-9 { transform: rotate(240deg) translate(0, -130%); animation-delay: -0.4s; }
        .custom-spinner .spinner-bar-10 { transform: rotate(270deg) translate(0, -130%); animation-delay: -0.3s; }
        .custom-spinner .spinner-bar-11 { transform: rotate(300deg) translate(0, -130%); animation-delay: -0.2s; }
        .custom-spinner .spinner-bar-12 { transform: rotate(330deg) translate(0, -130%); animation-delay: -0.1s; }
      `}</style>
      <div className="custom-spinner">
        <div className="spinner-bar-1"></div>
        <div className="spinner-bar-2"></div>
        <div className="spinner-bar-3"></div>
        <div className="spinner-bar-4"></div>
        <div className="spinner-bar-5"></div>
        <div className="spinner-bar-6"></div>
        <div className="spinner-bar-7"></div>
        <div className="spinner-bar-8"></div>
        <div className="spinner-bar-9"></div>
        <div className="spinner-bar-10"></div>
        <div className="spinner-bar-11"></div>
        <div className="spinner-bar-12"></div>
      </div>
      {message && (
        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
