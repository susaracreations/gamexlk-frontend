import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Game } from '../types';

interface AdminDashboardPageProps {
    onToast: (msg: string, type: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onToast }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'games' | 'orders'>('games');
    const navigate = useNavigate();

    const loadGames = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<any>('/api/games?sort=newest');
            if (data.success) {
                setGames(data.games);
            }
        } catch (err: any) {
            onToast('Failed to load games', 'error');
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<any>('/api/orders');
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err: any) {
            onToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    useEffect(() => {
        document.title = 'Admin Dashboard | GamexLK Store';
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
            return;
        }
        if (activeTab === 'games') loadGames();
        else loadOrders();
    }, [navigate, loadGames, loadOrders, activeTab]);

    const handleDelete = async (id: string) => {
        try {
            const data = await api.del<any>(`/api/games/${id}`);
            if (data.success) {
                onToast('Game deleted successfully', 'success');
                setGames(games.filter(g => g.id !== id));
                setShowDeleteModal(null);
            } else {
                onToast(data.error || 'Failed to delete', 'error');
            }
        } catch (err: any) {
            onToast(err.message, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        onToast('Logged out successfully', 'info');
        navigate('/login');
    };

    return (
        <main className="container section" style={{ paddingTop: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your game inventory</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${activeTab === 'games' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('games')}>Games</button>
                    <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('orders')}>Orders</button>
                    {activeTab === 'games' && <Link to="/add-game" className="btn btn-primary">＋ Add Game</Link>}
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {activeTab === 'games' ? (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div className="loading-state" style={{ padding: '3rem' }}>
                            <div className="spinner" />
                            <p style={{ marginTop: '1rem' }}>Loading inventory...</p>
                        </div>
                    ) : games.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem' }}>📂</div>
                            <h3>No games found</h3>
                            <p>Get started by adding your first game.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Game</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Added</th>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {games.map(game => (
                                        <tr key={game.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                                                    <img
                                                        src={game.image || '/default-game.svg'}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => (e.target as HTMLImageElement).src = '/default-game.svg'}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{game.title}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{game.publisher}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 500 }}>
                                                {parseFloat(String(game.price)) === 0 ? (
                                                    <span style={{ color: 'var(--accent-green)' }}>FREE</span>
                                                ) : (
                                                    `LKR ${parseFloat(String(game.price)).toFixed(2)}`
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <span className="badge badge-platform">{game.platform}</span>
                                                    <span className="badge badge-genre" style={{ opacity: 0.8 }}>{game.genre}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {new Date(game.releaseDate || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => navigate(`/add-game?edit=${game.id}`)}
                                                        title="Edit Game"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => setShowDeleteModal(game.id)}
                                                        title="Delete Game"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div className="loading-state" style={{ padding: '3rem' }}>
                            <div className="spinner" />
                            <p style={{ marginTop: '1rem' }}>Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem' }}>🧾</div>
                            <h3>No orders found</h3>
                            <p>Orders placed by customers will appear here.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Customer</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contacts</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Order Items</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}<br />
                                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{new Date(order.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 600 }}>{order.buyerName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.buyerEmail}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                <div title="WhatsApp">📞 {order.buyerWhatsapp}</div>
                                                {order.buyerDiscord && <div title="Discord" style={{ color: '#5865F2' }}>👾 {order.buyerDiscord}</div>}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    {order.items?.map((item: any, i: number) => (
                                                        <li key={i}>{item.title}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                                                LKR {parseFloat(order.totalAmount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(null); }}>
                    <div className="modal">
                        <h2 style={{ marginBottom: '1rem' }}>Confirm Delete</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Are you sure you want to delete this game? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => { if (showDeleteModal) handleDelete(showDeleteModal); }}>Delete Game</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminDashboardPage;