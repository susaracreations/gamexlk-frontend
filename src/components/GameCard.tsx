import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import { toSlug } from '../utils/api';
import StarRating from './StarRating';

interface GameCardProps {
  game: Game;
  onToast: (msg: string, type: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onToast }) => {
  const navigate = useNavigate();
  const desc = game.description || 'No description available.';
  const truncated = desc.length > 100 ? desc.substring(0, 97) + '...' : desc;
  const price = parseFloat(String(game.price));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    Cart.add(game, onToast);
  };

  return (
    <div className="game-card" onClick={() => navigate(`/product/${game.slug || toSlug(game.title)}`)}>
      <div style={{ position: 'relative' }}>
        {game.image ? (
          <img
            className="game-card-img"
            src={game.image}
            alt={game.title}
            onError={(e) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }}
          />
        ) : (
          <div className="game-card-img-placeholder">🎮</div>
        )}
        <span className="game-card-badge">
          {price === 0 ? 'FREE' : `LKR ${price.toFixed(2)}`}
        </span>
      </div>
      <div className="game-card-body">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-genre">{game.genre}</span>
          <span className="badge badge-platform">{game.platform}</span>
        </div>
        <div className="game-card-title">{game.title}</div>
        <div className="game-card-desc">{truncated}</div>
        <div className="game-card-meta">
          <div className="game-rating">
            <StarRating rating={game.rating} />
            <span style={{ color: 'var(--text-secondary)' }}>({parseFloat(String(game.rating)).toFixed(1)})</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{game.publisher}</div>
        </div>
      </div>
      <div className="game-card-footer">
        <button
          className="btn btn-secondary btn-sm"
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${game.slug || toSlug(game.title)}`); }}
        >
          Details
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
          🛒 Add
        </button>
      </div>
    </div>
  );
};

export default GameCard;
