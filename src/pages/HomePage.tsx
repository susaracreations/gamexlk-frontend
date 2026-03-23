import React, { useState, useEffect, useCallback } from 'react';
import { api, debounce } from '../utils/api';
import { Game, GamesResponse, StatsResponse } from '../types';
import GameCard from '../components/GameCard';
import HeroCarousel from '../components/HeroCarousel';

interface HomePageProps {
  onToast: (msg: string, type: string) => void;
}

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Fighting', 'Horror', 'Simulation', 'Puzzle', 'FPS', 'MOBA', 'Other'];
const PLATFORMS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Multi-platform'];

const HomePage: React.FC<HomePageProps> = ({ onToast }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ total: number; genres: number; platforms: number } | null>(null);

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('newest');

  const isLoggedIn = !!localStorage.getItem('authToken');

  const loadGames = useCallback(async (s: string, g: string, p: string, so: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ genre: g || 'all', platform: p || 'all', search: s, sort: so || 'newest' });
      const data = await api.get<GamesResponse>(`/api/games?${params}`);
      setGames(data.games || []);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoad = useCallback(debounce((val: string) => loadGames(val, genre, platform, sort), 350), [loadGames, genre, platform, sort]);

  useEffect(() => {
    document.title = 'Home — Gamexlk Store';
    loadGames(search, genre, platform, sort);
    api.get<GamesResponse>('/api/games?sort=rating').then(d => setFeaturedGames((d.games || []).slice(0, 5))).catch(() => { });
    api.get<StatsResponse>('/api/stats').then(d => {
      if (d.success) setStats({ total: d.total, genres: d.genres.length, platforms: d.platforms.length });
    }).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedLoad(e.target.value);
  };

  const handleGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
    loadGames(search, e.target.value, platform, sort);
  };
  const handlePlatform = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(e.target.value);
    loadGames(search, genre, e.target.value, sort);
  };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    loadGames(search, genre, platform, e.target.value);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-headline">
                Your Next Adventure <br />
                <span className="text-gradient">Starts Here</span>
              </h1>
              <p className="hero-subtext">
                The ultimate destination for digital games. Discover curated collections, unbeatable prices, and instant delivery across all platforms.
              </p>
              <div className="hero-cta">
                <a href="#store" className="btn btn-primary btn-lg glow-on-hover">
                  Browse Collection
                </a>
              </div>
              {stats && (
                <div className="hero-stats-row">
                  <div className="stat-item">
                    <strong>{stats.total}+</strong> <span>Games</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <strong>{stats.platforms}</strong> <span>Platforms</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hero-visual">
              <HeroCarousel games={featuredGames} onToast={onToast} />
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <main className="container section" id="store">
        <h2 className="section-title">Our Products</h2>
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div className="filters-inner">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" value={search} onChange={handleSearch} placeholder="Search games, publishers..." autoComplete="off" />
            </div>
            <select className="filter-select" value={genre} onChange={handleGenre}>
              <option value="all">All Genres</option>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
            <select className="filter-select" value={platform} onChange={handlePlatform}>
              <option value="all">All Platforms</option>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="filter-select" value={sort} onChange={handleSort}>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
            <span className="filter-count">
              {loading ? 'Loading...' : games.length === total ? `${total} game${total !== 1 ? 's' : ''}` : `${games.length} of ${total} games`}
            </span>
          </div>
        </div>
        <div className="games-grid">
          {loading ? (
            <div className="loading-state" style={{ gridColumn: '1/-1' }}>
              <div className="spinner" />
              <p>Loading games...</p>
            </div>
          ) : error ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => loadGames(search, genre, platform, sort)}>Try Again</button>
            </div>
          ) : games.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="icon">🎮</div>
              <h3>No games found</h3>
              <p>Try adjusting your search or filters{isLoggedIn ? ', or ' : '.'}{isLoggedIn && <a href="/add-game" style={{ color: 'var(--accent-purple)' }}>add a new game</a>}</p>
            </div>
          ) : (
            games.map((g) => <GameCard key={g.id} game={g} onToast={onToast} />)
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
