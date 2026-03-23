import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import StarRating from '../components/StarRating';
import GameCard from '../components/GameCard';

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
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/'); return; }
    document.title = 'Game Details — Gamexlk Store';
    setLoading(true);
    api.get<any>(`/api/games/${id}`)
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Game not found');
        setGame(data.game);
        document.title = `${data.game.title} — Gamexlk Store`;
        const wl = JSON.parse(localStorage.getItem('gxWishlist') || '[]');
        setWishlisted(wl.includes(id));
        return api.get<any>(`/api/games?genre=${data.game.genre}`);
      })
      .then(d => setRelated((d.games || []).filter((g: Game) => g.id !== id).slice(0, 4)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const toggleWishlist = () => {
    if (!game) return;
    const list: string[] = JSON.parse(localStorage.getItem('gxWishlist') || '[]');
    const idx = list.indexOf(game.id);
    if (idx === -1) { list.push(game.id); onToast(`${game.title} added to wishlist!`, 'info'); setWishlisted(true); }
    else { list.splice(idx, 1); onToast(`${game.title} removed from wishlist.`, 'info'); setWishlisted(false); }
    localStorage.setItem('gxWishlist', JSON.stringify(list));
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
        <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', opacity: 0.8 }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ textDecoration: 'none', color: 'var(--text-secondary)', opacity: 0.8 }}>Store</Link>
          <span>/</span>
          <span style={{ color: 'white', fontWeight: 500 }}>{game.title}</span>
        </div>

        {/* Detail Hero */}
        <div className="detail-hero" style={{ marginBottom: '3rem', alignItems: 'start' }}>
          <div className="detail-cover">
            {game.image
              ? <img src={game.image} alt={game.title} style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onError={(e) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }} />
              : <div className="detail-cover-placeholder">🎮</div>}
          </div>
          <div className="detail-info">
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-platform" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>{game.platform}</span>
              <span className="badge badge-genre" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>{game.genre}</span>
            </div>

            <h1 className="detail-title" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{game.title}</h1>

            <div className="detail-rating">
              <StarRating rating={game.rating} />
              <span style={{ color: 'var(--accent-yellow)', fontWeight: 700, fontSize: '1rem', marginLeft: '0.75rem' }}>{parseFloat(String(game.rating)).toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.25rem' }}>/ 5.0</span>
            </div>

            {/* Action Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginTop: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  {price === 0
                    ? <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>Free</span>
                    : <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>LKR {price.toFixed(2)}</span>}
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Includes full game & updates</div>
                </div>
                {wishlisted ? (
                  <button onClick={toggleWishlist} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: 'var(--accent-pink)', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Remove from Wishlist">♥</button>
                ) : (
                  <button onClick={toggleWishlist} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Add to Wishlist">♡</button>
                )}
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1.1rem' }} onClick={() => Cart.add(game, onToast)}>Add to Cart</button>
            </div>

            {/* Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Publisher</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{game.publisher}</span>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Release Date</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Edition</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Standard</span>
              </div>
            </div>

            {game.tags && game.tags.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="tag-list">
                  {game.tags.map(t => <span key={t} className="tag" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>#{t.trim()}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Body */}
        <div className="detail-body" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>About This Game</h2>
            <div style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
              {game.description || 'No description available for this game.'}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>System Requirements (Minimum)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div><strong>OS:</strong> Windows 10 64-bit</div>
                <div><strong>Processor:</strong> Intel Core i5 or AMD Equivalent</div>
                <div><strong>Memory:</strong> 8 GB RAM</div>
                <div><strong>Graphics:</strong> NVIDIA GTX 1060 / AMD RX 580</div>
              </div>
            </div>
          </div>

          <div>
            {game.trailer && (
              <div className="video-wrap" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <iframe src={trailerSrc} frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%', aspectRatio: '16/9' }} title="Game Trailer" />
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
