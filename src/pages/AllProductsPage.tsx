import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, debounce } from '../utils/api';
import { Game, GamesResponse } from '../types';
import GameCard from '../components/GameCard';
import SubHero from '../components/SubHero';

interface AllProductsPageProps {
    onToast: (msg: string, type: string) => void;
}

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Fighting', 'Horror', 'Simulation', 'Puzzle', 'FPS', 'MOBA', 'Other'];
const PLATFORMS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Multi-platform'];

const AllProductsPage: React.FC<AllProductsPageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || 'all');
    const [platform, setPlatform] = useState(searchParams.get('platform') || 'all');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    const loadGames = useCallback(async (s: string, g: string, p: string, so: string) => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({ genre: g || 'all', platform: p || 'all', search: s, sort: so || 'newest' });
            setSearchParams(params);
            const data = await api.get<GamesResponse>(`/api/games?${params}`);
            setGames(data.games || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [setSearchParams]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedLoad = useCallback(debounce((val: string) => loadGames(val, genre, platform, sort), 350), [loadGames, genre, platform, sort]);

    useEffect(() => {
        document.title = 'All Products | GamexLK Store';
        loadGames(search, genre, platform, sort);
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
            <SubHero 
                title="All Products"
                subtitle="Explore our vast collection of digital games and software from top publishers."
                breadcrumbItems={[
                    { label: 'Home', onClick: () => navigate('/') },
                    { label: 'All Products' }
                ]}
            />
            <main className="container section" style={{ minHeight: '90vh' }}>
                <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div className="filters-inner">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input type="text" value={search} onChange={handleSearch} placeholder="Search games..." autoComplete="off" />
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
                        {loading ? 'Loading...' : `${games.length} games`}
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
                        <p>Try adjusting your filters.</p>
                    </div>
                ) : (
                    games.map((g) => <GameCard key={g.id} game={g} onToast={onToast} />)
                )}
            </div>
        </main>
    </>
  );
};

export default AllProductsPage;