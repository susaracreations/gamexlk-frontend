import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import StarRating from '../components/StarRating';
import GameCard from '../components/GameCard';
import SubHero from '../components/SubHero';
import Loader from '../components/Loader';

interface GameDetailPageProps {
  onToast: (msg: string, type: string) => void;
}

const GameDetailPage: React.FC<GameDetailPageProps> = ({ onToast }) => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [related, setRelated] = useState<Game[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const checkWishlistStatus = useCallback(async (email: string, actualId: string) => {
    if (!actualId) return;
    try {
      const res = await api.get<any>(`/api/wishlist?email=${encodeURIComponent(email)}`);
      if (res.success && Array.isArray(res.wishlist)) {
        const found = res.wishlist.some((g: Game) => String(g.id) === String(actualId));
        setIsInWishlist(found);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, []);

  useEffect(() => {
    if (!idOrSlug) { navigate('/'); return; }
    document.title = 'Game Details | GamexLK Store';
    setLoading(true);

    const auth = localStorage.getItem('userAuth');
    let userEmail: string | null = null;
    if (auth) {
        const userData = JSON.parse(auth);
        userEmail = userData.email;
        setUser(userData);
    }

    let currentGameId: string = '';

    api.get<any>(`/api/games/${idOrSlug}`)
      .then((data: any) => {
        if (!data.success) throw new Error(data.error || 'Game not found');
        const gameData = data.game;
        setGame(gameData);
        currentGameId = gameData.id;
        document.title = `${gameData.title} | Buy Digital in Sri Lanka | GamexLK Store`;
        
        if (userEmail) {
          checkWishlistStatus(userEmail, gameData.id);
        }

        return api.get<any>(`/api/games?genre=${gameData.genre}`);
      })
      .then((d: any) => {
        setRelated((d.games || []).filter((g: Game) => g.id !== currentGameId).slice(0, 4));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [idOrSlug, navigate, checkWishlistStatus]);

  const toggleWishlist = async () => {
    if (!user?.email) {
      onToast("Please log in to add to wishlist!", "error");
      return;
    }

    if (isInWishlist) {
      try {
        const actualId = game?.id;
        if (!actualId) return;
        const res = await api.del<any>(`/api/wishlist/${actualId}?email=${encodeURIComponent(user.email)}`);
        if (res.success) {
          setIsInWishlist(false);
          onToast(`${game?.title} removed from wishlist.`, 'info');
        }
      } catch (err) {
        console.error("Failed to remove:", err);
      }
    } else {
      try {
        const actualId = game?.id;
        if (!actualId) return;
        const payload = { email: user.email, gameId: actualId };
        const res = await api.post<any>('/api/wishlist', payload);
        if (res.success) {
          setIsInWishlist(true);
          onToast(`${game?.title} added to wishlist!`, 'info');
        } else {
          onToast(`Failed to add: ${res.error}`, "error");
        }
      } catch (err) {
        console.error("Failed to add:", err);
      }
    }
  };

  if (loading) return (
    <main className="container section pt-24 min-h-screen">
      <Loader message="Loading game details..." />
    </main>
  );

  if (error || !game) return (
    <main className="container section pt-24 min-h-screen fade-in">
      <div className="empty-state glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>😕</div>
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Game Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error || "The game you're looking for doesn't exist or has been removed."}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Store</button>
      </div>
    </main>
  );

  const price = parseFloat(String(game.price));
  const trailerSrc = game.trailer && game.trailer.includes('youtube.com/watch')
    ? game.trailer.replace('watch?v=', 'embed/').split('&')[0]
    : game.trailer;

  return (
    <div className="game-detail-page fade-in">
      {/* Ambient Background Layer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100vh',
        backgroundImage: `url(${game.image || '/default-game.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        filter: 'blur(80px) saturate(2)',
        zIndex: -1,
      }} />

      <SubHero 
        title={game.title}
        subtitle={`${game.platform} • ${game.genre}`}
        bgImage={game.image}
        breadcrumbItems={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: 'Products', onClick: () => navigate('/products') },
          { label: game.title }
        ]}
      />

      <main className="container section" style={{ paddingBottom: '6rem' }}>
        <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
          
          {/* Main Content (8/12) */}
          <div style={{ gridColumn: 'span 8' }}>
            
            {/* Immersive Cover Image */}
            <div className="glass-card" style={{ overflow: 'hidden', position: 'relative', border: 'none', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
              {game.image ? (
                <img 
                  src={game.image} 
                  alt={game.title} 
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '550px', objectFit: 'cover' }} 
                  onError={(e: any) => { e.target.src = '/default-game.svg'; }} 
                />
              ) : (
                <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--gradient-hero)' }}>🎮</div>
              )}
              
              {/* Detailed Overlay Labels */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-platform">{game.platform}</span>
                    <span className="badge badge-genre">{game.genre}</span>
                  </div>
                  <h1 style={{ fontSize: '2.8rem', fontWeight: 900, textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>{game.title}</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StarRating rating={game.rating} />
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>{parseFloat(String(game.rating)).toFixed(1)} / 5.0</div>
                </div>
              </div>
            </div>

            {/* Description Tab */}
            <div className="glass-card" style={{ padding: '2.5rem', marginTop: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple-light)' }}>About the Game</h2>
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                {game.description || 'Experience the epic journey of ' + game.title + '.'}
              </div>
            </div>

            {/* Trailer Section */}
            {game.trailer && (
              <div className="glass-card" style={{ padding: '2.5rem', marginTop: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Official Trailer</h2>
                <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)' }}>
                  <iframe
                    src={trailerSrc}
                    title={`${game.title} Trailer`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Checkout/Purchase Sidebar (4/12) */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="glass-card" style={{ position: 'sticky', top: '7rem', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-purple-light)', letterSpacing: '1px' }}>Limited Time Price</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>
                  {price === 0 ? 'FREE' : `LKR ${price.toFixed(2)}`}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }}
                  onClick={() => { Cart.add(game); onToast(`${game.title} added to cart!`, 'success'); }}
                >
                  Add to Cart
                </button>
                <button 
                  className={`btn ${isInWishlist ? 'btn-danger' : 'btn-secondary'} btn-lg`} 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={toggleWishlist}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Publisher</span>
                  <span style={{ fontWeight: 600 }}>{game.publisher}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Release Date</span>
                  <span style={{ fontWeight: 600 }}>{new Date(game.releaseDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {related.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem', textAlign: 'center' }}>You Might Also Like</h2>
            <div className="games-grid">
              {related.map(r => <GameCard key={r.id} game={r} onToast={onToast} />)}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .grid-layout { grid-template-columns: 1fr !important; }
          .grid-layout > div { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
};

export default GameDetailPage;
