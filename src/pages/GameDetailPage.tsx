import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Game } from '../types';
import { Cart } from '../utils/cart';
import StarRating from '../components/StarRating';
import GameCard from '../components/GameCard';
import SubHero from '../components/SubHero';
// Ensure useState and useEffect are imported from 'react'

interface GameDetailPageProps {
  onToast: (msg: string, type: string) => void;
}

const GameDetailPage: React.FC<GameDetailPageProps> = ({ onToast }) => {
  /* 
     Integrated CSS Styles 
     Moving base styles from style.css and implementing utility classes
     to ensure the page remains self-contained and visually "superb".
  */
  const pageStyles = `
    .game-detail-page {
      --bg-primary: #050510;
      --bg-secondary: #0a0a1f;
      --glass: rgba(255, 255, 255, 0.04);
      --glass-border: rgba(255, 255, 255, 0.1);
      --accent-purple: #a855f7;
      --accent-purple-light: #c084fc;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #475569;
      --radius-xl: 28px;
    }

    /* Core Layout Utilities */
    .fixed { position: fixed; }
    .inset-0 { top: 0; left: 0; right: 0; bottom: 0; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .w-full { width: 100%; }
    .h-screen { height: 100vh; }
    .-z-10 { z-index: -10; }
    .bg-cover { background-size: cover; }
    .bg-center { background-position: center; }
    .bg-blur-xl { backdrop-filter: blur(80px); -webkit-backdrop-filter: blur(80px); }
    .opacity-5 { opacity: 0.05; }
    .saturate-200 { filter: saturate(200%); }
    
    .rounded-\[--radius-xl\] { border-radius: var(--radius-xl); }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .shadow-black\/50 { shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); }
    .bg-secondary { background: var(--bg-secondary); }
    .border-glass { border: 1px solid var(--glass-border); }

    /* Flex & Grid */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
    .gap-10 { gap: 2.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .space-y-12 > * + * { margin-top: 3rem; }

    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      .lg\\:col-span-8 { grid-column: span 8 / span 8; }
      .lg\\:col-span-4 { grid-column: span 4 / span 4; }
      .lg\\:sticky { position: sticky; }
      .lg\\:top-24 { top: 6rem; }
      .lg\\:pb-32 { padding-bottom: 8rem; }
    }

    /* Component Styles */
    .glass-card {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-platform { background: rgba(168, 85, 247, 0.15); color: var(--accent-purple-light); border: 1px solid rgba(168, 85, 247, 0.3); }
    .badge-genre { background: rgba(6, 182, 212, 0.15); color: #67e8f9; border: 1px solid rgba(6, 182, 212, 0.3); }

    .text-gradient {
      background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-shadow-lg { text-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .text-4xl { font-size: 2.25rem; }
    .text-5xl { font-size: 3rem; }
    .font-black { font-weight: 900; }
    .font-extrabold { font-weight: 800; }
    
    .section-title {
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f8fafc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(168, 85, 247, 0.2);
      border-top-color: var(--accent-purple);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .mobile-top-margin {
        margin-top: 4rem !important;
      }
    }
  `;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [related, setRelated] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const checkWishlistStatus = useCallback(async (email: string) => {
    if (!id) return;
    try {
      const res = await api.get<any>(`/api/wishlist?email=${encodeURIComponent(email)}`);
      if (res.success && Array.isArray(res.wishlist)) {
        const found = res.wishlist.some((g: Game) => String(g.id) === String(id));
        setIsInWishlist(found);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) { navigate('/'); return; }
    document.title = 'Game Details | GamexLK Store';
    setLoading(true);

    const auth = localStorage.getItem('userAuth');
    if (auth) {
      const userData = JSON.parse(auth);
      setUser(userData);
      checkWishlistStatus(userData.email);
    }

    api.get<any>(`/api/games/${id}`)
      .then((data: any) => {
        if (!data.success) throw new Error(data.error || 'Game not found');
        setGame(data.game);
        document.title = `${data.game.title} | GamexLK Store`;
        return api.get<any>(`/api/games?genre=${data.game.genre}`);
      })
      .then((d: any) => setRelated((d.games || []).filter((g: Game) => g.id !== id).slice(0, 4)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, navigate, checkWishlistStatus]);

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
    <main className="container mx-auto px-4 sm:px-8 lg:px-16 pt-24 min-h-screen">
      <div className="loading-state flex flex-col items-center justify-center py-20"><div className="spinner" /><p className="mt-4 text-secondary">Loading game...</p></div>
    </main>
  );

  if (error || !game) return (
    <main className="container mx-auto px-4 sm:px-8 lg:px-16 pt-24 min-h-screen">
      <div className="empty-state text-center py-20">
        <div className="icon text-5xl mb-4">😕</div>
        <h3 className="text-2xl font-bold mb-2">Game not found</h3>
        <p className="text-secondary mb-8">{error}</p>
        <a href="/" className="btn btn-primary">Back to Store</a>
      </div>
    </main>
  );

  const price = parseFloat(String(game.price));
  const trailerSrc = game.trailer && game.trailer.includes('youtube.com/watch')
    ? game.trailer.replace('watch?v=', 'embed/').split('&')[0]
    : game.trailer;

  return (
    <div className="game-detail-page">
      <style>{pageStyles}</style>
      {/* Ambient Background Layer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100vh',
        backgroundImage: `url(${game.image || '/default-game.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08,
        filter: 'blur(100px) saturate(2)',
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

      <main className="container section mobile-top-margin" style={{ paddingBottom: '6rem' }}>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Visuals Column (8/12) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Immersive Cover Image */}
            <div style={{ 
              position: 'relative', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)'
            }}>
              {game.image ? (
                <img 
                  src={game.image} 
                  alt={game.title} 
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '600px', objectFit: 'cover' }} 
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }} 
                />
              ) : (
                <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--gradient-hero)' }}>🎮</div>
              )}
              
              {/* Image Footer/Overlay Info */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-platform">{game.platform}</span>
                    <span className="badge badge-genre">{game.genre}</span>
                  </div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{game.title}</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StarRating rating={game.rating} />
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>{parseFloat(String(game.rating)).toFixed(1)} / 5.0</div>
                </div>
              </div>
            </div>

            {/* Content Tabs/Sections */}
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple-light)' }}>Detailed Information</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>Description</h3>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                    {game.description || 'No description available for this game.'}
                  </div>
                </div>

                {game.trailer && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Watch Trailer</h3>
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', background: 'black' }}>
                      <iframe 
                        src={trailerSrc} 
                        frameBorder="0" 
                        allowFullScreen 
                        style={{ width: '100%', aspectRatio: '16/9' }} 
                        title="Game Trailer" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Actions Column (4/12) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Purchase Card */}
            <div className="glass-card" style={{ 
              padding: '2rem', 
              borderRadius: 'var(--radius-xl)', 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Game</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {price === 0 ? <span className="text-gradient">FREE</span> : `LKR ${price.toLocaleString()}`}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '1.1rem' }} 
                  onClick={() => Cart.add(game, onToast)}
                >
                  🛒 Add to Cart
                </button>
                <button 
                  className={`btn btn-lg ${isInWishlist ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={toggleWishlist}
                  style={{ width: '100%', justifyContent: 'center', height: '56px' }}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <div className="space-y-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Publisher</span>
                    <span style={{ fontWeight: 600 }}>{game.publisher}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Release</span>
                    <span style={{ fontWeight: 600 }}>{new Date(game.releaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {game.tags && game.tags.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Tags</div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {game.tags.map(t => (
                      <span key={t} style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 10px', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '100px', 
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Delivery Notice (Moved Inside Card) */}
              <div style={{ 
                marginTop: '2rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center', 
                opacity: 0.5, 
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}>
                ✓ Instant digital delivery after purchase.
              </div>
            </div>

          </aside>
        </div>

        {/* Related Games Footer Section */}
        <section style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>You May Also Like</h2>
              <p style={{ color: 'var(--text-muted)' }}>Discover more {game.genre} games picked for you</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/products')}>View More</button>
          </div>
          
          <div className="games-grid">
            {related.length === 0
              ? <div className="empty-state" style={{ gridColumn: '1/-1' }}>No related games found.</div>
              : related.map(g => <GameCard key={g.id} game={g} onToast={onToast} />)}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GameDetailPage;
