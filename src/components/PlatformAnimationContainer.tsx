import React from 'react';

const PLATFORMS = [
  { 
    name: 'Steam', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg'
  },
  { 
    name: 'Epic Games', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg'
  },
  { 
    name: 'PlayStation', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg'
  },
  { 
    name: 'Xbox', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg'
  },
  { 
    name: 'Ubisoft', 
    logo: 'https://i.ibb.co/NgjhWkq0/c28ed1de0146.png'
  },
  { 
    name: 'Battle.Net', 
    logo: 'https://i.ibb.co/rGTdb5rj/e4611bc80f82.webp'
  },
  { 
    name: 'EA Play', 
    logo: 'https://i.ibb.co/VYnCVcYW/3414bc40caaf.png'
  }
];

const PlatformAnimationContainer: React.FC = () => {
  const styles = `
    .platform-container {
      width: 100%;
      background: #020617;
      padding: 3rem 0;
      overflow: hidden;
      position: relative;
    }

    .platform-mask {
      display: flex;
      overflow: hidden;
      user-select: none;
      mask-image: linear-gradient(
        to right,
        transparent,
        black 15%,
        black 85%,
        transparent
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 15%,
        black 85%,
        transparent
      );
    }

    .platform-track {
      display: flex;
      flex-shrink: 0;
      gap: 6rem;
      padding: 0 3rem;
      animation: scroll 40s linear infinite;
    }

    .platform-box {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      opacity: 0.5;
      filter: grayscale(1) brightness(2);
      transition: all 0.3s ease;
    }

    .platform-icon-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .platform-label {
      color: #f8fafc;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      white-space: nowrap;
    }

    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    @media (max-width: 768px) {
      .platform-track { gap: 4rem; animation-duration: 30s; }
      .platform-container { padding: 2.5rem 0; }
      .platform-icon-img { width: 24px; height: 24px; }
      .platform-label { font-size: 0.75rem; }
    }
  `;

  // Duplicate for seamless looping
  const trackContent = [...PLATFORMS, ...PLATFORMS];

  return (
    <div className="platform-container">
      <style>{styles}</style>
      <div className="platform-mask">
        <div className="platform-track">
          {trackContent.map((platform, index) => (
            <div key={index} className="platform-box">
              <img 
                src={platform.logo} 
                alt={platform.name}
                className="platform-icon-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="platform-label">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformAnimationContainer;