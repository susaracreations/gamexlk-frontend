import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import StarRating from '../components/StarRating';
import GameCard from '../components/GameCard';
import Breadcrumb from '../components/Breadcrumb';
// Ensure useState and useEffect are imported from 'react'

interface GameDetailPageProps {
  onToast: (msg: string, type: string) => void;
}

const GameDetailPage: React.FC<GameDetailPageProps> = ({ onToast }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [related, setRelated] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/'); return; }
    document.title = 'Game Details — Gamexlk Store';
    setLoading(true);

    const auth = localStorage.getItem('userAuth');
    if (auth) {
      const userData = JSON.parse(auth);
      setUser(userData);
      checkWishlistStatus(userData.email);
    }

    api.get<any>(`/api/games/${id}`)
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Game not found');
        setGame(data.game);
        document.title = `${data.game.title} — Gamexlk Store`;
        return api.get<any>(`/api/games?genre=${data.game.genre}`);
      })
      .then(d => setRelated((d.games || []).filter((g: Game) => g.id !== id).slice(0, 4)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const checkWishlistStatus = async (email: string) => {
    if (!id) return;
    try {
      const res = await api.get<any>(`/api/wishlist?email=${encodeURIComponent(email)}`);
      if (res.success && Array.isArray(res.wishlist)) {
        const found = res.wishlist.some((g: any) => String(g.id) === String(id));
        setIsInWishlist(found);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user?.email) {
      onToast("Please log in to add to wishlist!", "error");
      return;
    }

    if (isInWishlist) {
      try {
        const res = await api.del<any>(`/api/wishlist/${id}?email=${encodeURIComponent(user.email)}`);
        if (res.success) {
          setIsInWishlist(false);
          onToast(`${game?.title} removed from wishlist.`, 'info');
        }
      } catch (err) {
        console.error("Failed to remove:", err);
      }
    } else {
      try {
        const payload = { email: user.email, gameId: id };
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
    <main className="container" style={{ paddingTop: '70px' }}>
      <div className="loading-state"><div className="spinner" /><p>Loading game...</p></div>
    </main>
  );

  if (error || !game) return (
    <main className="container" style={{ paddingTop: '70px' }}>
      <div className="empty-state">
        <div className="icon">😕</div>
        <h3>Game not found</h3>
        <p>{error}</p>
        <a href="/" className="btn btn-primary">Back to Store</a>
      </div>
    </main>
  );

  const price = parseFloat(String(game.price));
  const trailerSrc = game.trailer && game.trailer.includes('youtube.com/watch')
    ? game.trailer.replace('watch?v=', 'embed/').split('&')[0]
    : game.trailer;

  return (
    <>
      {/* Ambient Background */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '80vh',
        backgroundImage: `url(${game.image || '/default-game.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.15,
        filter: 'blur(60px) saturate(1.2)',
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, black, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
      }} />

      <main className="container" style={{ paddingTop: '100px', position: 'relative' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', icon: '🏠', onClick: () => navigate('/') },
            { label: 'Store', onClick: () => navigate('/products') },
            { label: game.title }
          ]}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start', marginBottom: '4rem' }}>
          {/* Left Column: Visuals & Content */}
          <div style={{ flex: '1 1 600px', minWidth: 0 }}>
            {/* Main Cover */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', marginBottom: '2.5rem', background: '#000' }}>
              {game.image ? (
                <img src={game.image} alt={game.title} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }} />
              ) : (
                <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#333' }}>🎮</div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>About This Game</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {game.description || 'No description available for this game.'}
              </div>
            </div>

            {/* Trailer */}
            {game.trailer && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Trailer</h3>
                <div className="video-wrap" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <iframe src={trailerSrc} frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%', aspectRatio: '16/9' }} title="Game Trailer" />
                </div>
              </div>
            )}

            {/* System Req */}
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>System Requirements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div><strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>OS</strong> Windows 10 64-bit</div>
                <div><strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Processor</strong> Intel Core i5 / AMD Equivalent</div>
                <div><strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Memory</strong> 8 GB RAM</div>
                <div><strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Graphics</strong> NVIDIA GTX 1060 / AMD RX 580</div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div style={{ flex: '1 1 300px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.75rem' }}>{game.platform}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem' }}>{game.genre}</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem' }}>{game.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
              <StarRating rating={game.rating} />
              <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>({parseFloat(String(game.rating)).toFixed(1)})</span>
            </div>

            {/* Purchase Card */}
            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                {price === 0 ? 'Free' : `LKR ${price.toFixed(2)}`}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>One-time purchase</div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: '50px', fontSize: '1rem' }} onClick={() => Cart.add(game, onToast)}>
                  Add to Cart
                </button>
                <button 
                  className={`btn ${isInWishlist ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={toggleWishlist}
                  style={{ flex: 1, justifyContent: 'center', height: '50px', fontSize: '0.9rem' }}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>
            </div>

            {/* Details List */}
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Publisher</span>
                <span style={{ fontWeight: 500 }}>{game.publisher}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Release Date</span>
                <span style={{ fontWeight: 500 }}>{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {game.tags.map(t => <span key={t} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-secondary)' }}>#{t.trim()}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div style={{ marginBottom: '6rem' }}>
          <h2 className="section-title" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '3rem' }}>You May Also Like</h2>
          <div className="games-grid">
            {related.length === 0
              ? <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No related games found.</p>
              : related.map(g => <GameCard key={g.id} game={g} onToast={onToast} />)}
          </div>
        </div>
      </main>
    </>
  );
};

export default GameDetailPage;
