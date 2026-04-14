import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import { toSlug } from '../utils/api';

interface GameCardProps {
  game: Game;
  onToast: (msg: string, type: string) => void;
}

const PLATFORM_LOGOS: Record<string, string> = {
  'Steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
  'Epic Games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
  'Ubisoft': 'https://i.ibb.co/NgjhWkq0/c28ed1de0146.png',
  'Battle.Net': 'https://i.ibb.co/rGTdb5rj/e4611bc80f82.webp',
  'EA Play': 'https://i.ibb.co/VYnCVcYW/3414bc40caaf.png',
  'PlayStation': 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
  'Xbox': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
};

const GameCard: React.FC<GameCardProps> = ({ game, onToast }) => {
  const navigate = useNavigate();
  const price = parseFloat(String(game.price));
  
  // Mock discount for visual parity with the request image
  // In a real app, these would come from the game object
  const hasDiscount = price > 500 && price < 1000;
  const discountPercent = hasDiscount ? 40 : 0;
  const originalPrice = hasDiscount ? (price / (1 - discountPercent / 100)).toFixed(0) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    Cart.add(game, onToast);
  };

  const platformLogo = PLATFORM_LOGOS[game.platform] || null;

  return (
    <div className="game-card-v3" onClick={() => navigate(`/product/${game.slug || toSlug(game.title)}`)}>
      <div className="game-card-image-wrapper">
        {game.image ? (
          <img
            className="game-card-image"
            src={game.image}
            alt={game.title}
            onError={(e) => { (e.target as HTMLImageElement).src = '/default-game-3-4.svg'; }}
          />
        ) : (
          <img className="game-card-image" src="/default-game-3-4.svg" alt="Default Game" />
        )}
        {platformLogo && (
          <div className="game-platform-tag">
             <img src={platformLogo} alt={game.platform} />
          </div>
        )}
        <div className="game-card-hover-overlay">
           <button className="btn-add-cart-mini" onClick={handleAddToCart}>
             <span className="plus">+</span>
           </button>
        </div>
      </div>
      
      <div className="game-card-content">
        <div className="game-card-subtitle">{game.publisher || 'Direct Delivery'}</div>
        <div className="game-card-name" title={game.title}>{game.title}</div>
        
        <div className="game-card-price-row">
          {hasDiscount && (
            <span className="game-card-discount-badge">-{discountPercent}%</span>
          )}
          {originalPrice && (
            <span className="game-card-old-price">{originalPrice}</span>
          )}
          <span className="game-card-current-price">
            LKR.{Math.floor(price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
