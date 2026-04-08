import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Banner {
  id: string; // Unique identifier for the banner
  imageUrl: string; // URL of the banner image
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const AUTO_PLAY_TIME = 5000; // 5 seconds per slide

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (banners.length > 0 ? (c + 1) % banners.length : 0));
    }, AUTO_PLAY_TIME);
  }, [banners.length]);

  const goTo = useCallback((i: number) => {
    if (!banners.length) return;
    setCurrent((i + banners.length) % banners.length); // Handle negative/overflow indices
    startTimer(); // Reset timer on interaction
  }, [banners.length, startTimer]);

  useEffect(() => {
    if (!banners.length) return;
    startTimer();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('keydown', onKey);
    };
  }, [banners.length, current, goTo, startTimer]);

  if (!banners.length) return null; // Don't render if there are no banners

  return (
    <div className="banner-carousel-container" style={{ overflow: 'hidden', position: 'relative', width: '100%', aspectRatio: '1920 / 600' }}>
      <div 
        className="banner-track" 
        style={{ 
          display: 'flex', 
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
          transform: `translateX(-${current * 100}%)`,
          height: '100%'
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="banner-slide" // No onClick, so no cursor change needed
            style={{ flex: '0 0 100%', width: '100%', height: '100%' }} // Banners are now non-clickable
          >
            <img
              src={banner.imageUrl}
              alt={`Promotional banner ${index + 1}`}
              className="banner-image"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-banner.svg'; }}
            />
          </div>
        ))}
      </div>

      <div className="hero-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            aria-label={`Go to banner ${i + 1}`}
          >
            {i === current && (
              <svg className="hero-progress-ring" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;