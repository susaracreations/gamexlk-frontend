import React from 'react';

interface StarRatingProps {
  rating: string | number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const r = Math.round(parseFloat(String(rating)) * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (r >= i) stars.push(<span key={i}>★</span>);
    else if (r >= i - 0.5) stars.push(<span key={i}>⯨</span>);
    else stars.push(<span key={i} className="empty">★</span>);
  }
  return <span className="stars">{stars}</span>;
};

export default StarRating;
