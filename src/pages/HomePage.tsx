import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Game, GamesResponse } from '../types';
import GameCard from '../components/GameCard';
import SubHero from '../components/SubHero';
import BannerCarousel from '../components/BannerCarousel';
import PlatformAnimationContainer from '../components/PlatformAnimationContainer';

interface HomePageProps {
  onToast: (msg: string, type: string) => void;
}



const HOMEPAGE_BANNERS = [
  { id: 'b1', imageUrl: 'https://i.ibb.co/SD49mKhf/5b55be116bb9.webp' },
  { id: 'b2', imageUrl: 'https://i.ibb.co/JWQS9bhR/6cb6eb335400.webp' },
  { id: 'b3', imageUrl: 'https://i.ibb.co/23zQNsyg/6d4e9d0b20b2.webp' },
  { id: 'b4', imageUrl: 'https://i.ibb.co/QFs5NBJ0/5217f9847876.webp' }
];

const HomePage: React.FC<HomePageProps> = ({ onToast }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState('');

  const isLoggedIn = !!localStorage.getItem('authToken');

  const loadGames = useCallback(async (s: string, g: string, p: string, so: string) => {
    setError('');
    try {
      const params = new URLSearchParams({ genre: g || 'all', platform: p || 'all', search: s, sort: so || 'newest' });
      const data = await api.get<GamesResponse>(`/api/games?${params}`);
      setGames(data.games || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    document.title = 'GamexLK Store | Buy Digital Games Sri Lanka #1 Store';
    loadGames('', 'all', 'all', 'newest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Banner Carousel */}
      <BannerCarousel banners={HOMEPAGE_BANNERS} />

      {/* Platforms Animation */}
      <PlatformAnimationContainer />

      {/* Games Grid */}
      <section id="store">
        <SubHero 
          title="Latest Products"
          subtitle="Discover curated collections and unbeatable prices."
          breadcrumbItems={[
            { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Store' }
          ]}
        />
      </section>
      <main className="container section" style={{ paddingBottom: '4rem' }}>
        <div className="games-grid">
          {error ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => loadGames('', 'all', 'all', 'newest')}>Try Again</button>
            </div>
          ) : games.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="icon">🎮</div>
              <h3>No games found</h3>
              <p>Try adjusting your search or filters{isLoggedIn ? ', or ' : '.'}{isLoggedIn && <a href="/add-game" style={{ color: 'var(--accent-purple)' }}>add a new game</a>}</p>
            </div>
          ) : (
            games.slice(0, 5).map((g) => <GameCard key={g.id} game={g} onToast={onToast} />)
          )}
        </div>
        
        {games.length > 5 && (
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/products')}
              style={{ borderRadius: '50px', padding: '0.8rem 2.5rem' }}
            >
              View All Products
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
