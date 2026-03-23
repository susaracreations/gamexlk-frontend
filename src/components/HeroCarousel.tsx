import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { Cart } from '../utils/cart';

interface HeroCarouselProps {
  games: Game[];
  onToast: (msg: string, type: string) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ games, onToast }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const AUTO_PLAY_TIME = 6000;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % games.length);
    }, AUTO_PLAY_TIME);
  };

  const goTo = (i: number) => {
    if (!games.length) return;
    setCurrent((i + games.length) % games.length); // Handle negative/overflow indices
    startTimer(); // Reset timer on interaction
  };

  useEffect(() => {
    if (!games.length) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length, current]);

  if (!games.length) return null;

  return (
    <div className="hero-card">
      {games.map((game, index) => {
        const isActive = index === current;
        return (
          <div key={game.id} className={`hero-slide ${isActive ? 'active' : ''}`}>
            <img
              src={game.image || '/default-game.svg'}
              alt={game.title}
              className="hero-card-img"
              onError={(e) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }}
            />
            <div className="hero-card-overlay">
              <div className="hero-content-glass">
                <div className="hero-badges">
                  <span className="badge badge-genre">{game.genre}</span>
                  <span className="badge badge-platform">{game.platform}</span>
                </div>
                <h2 className="hero-card-title">{game.title}</h2>
                <div className="hero-card-meta">
                  <span className="hero-price">LKR {parseFloat(String(game.price)).toFixed(2)}</span>
                  <span className="hero-rating">★ {game.rating}</span>
                </div>
                <div className="hero-card-actions">
                  <button className="btn btn-primary" onClick={() => Cart.add(game, onToast)}>Add to Cart</button>
                  <button className="btn btn-secondary glass-btn" onClick={() => navigate(`/game/${game.id}`)}>View Details</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hero-nav">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
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

export default HeroCarousel;
