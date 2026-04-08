import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import SubHero from '../components/SubHero';

interface UserProfilePageProps {
    onToast: (msg: string, type: string) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string; avatar?: string }>({ email: '' });
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    useEffect(() => {
        document.title = 'My Profile | GamexLK Store';
        const auth = localStorage.getItem('userAuth');
        if (!auth) {
            navigate('/signin');
            return;
        }
        try {
            setUser(JSON.parse(auth));
        } catch {
            setUser({ email: 'User' });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userAuth');
        window.dispatchEvent(new Event('authUpdated'));
        onToast('Logged out successfully', 'info');
        navigate('/');
    };

    const loadOrders = async () => {
        if (!user.email) return;
        setActiveTab('orders');
        setLoadingOrders(true);
        try {
            const res = await api.get<any>(`/api/my-orders?email=${encodeURIComponent(user.email)}`);
            if (res.success) {
                setOrders(res.orders);
            } else {
                onToast(res.error || 'Failed to load orders', 'error');
            }
        } catch (err: any) {
            console.error('Orders API Error:', err);
            if (err.message && (err.message.includes('Unexpected token <') || err.message.includes('valid JSON'))) {
                onToast('API not found. Please restart your backend server!', 'error');
            } else {
                onToast(err.message || 'Failed to connect to server', 'error');
            }
        } finally {
            setLoadingOrders(false);
        }
    };

    const loadWishlist = async () => {
        if (!user.email) return;
        setActiveTab('wishlist');
        setLoadingWishlist(true);
        try {
            const res = await api.get<any>(`/api/wishlist?email=${encodeURIComponent(user.email)}`);
            if (res.success) {
                setWishlist(res.wishlist);
            } else {
                onToast(res.error || 'Failed to load wishlist', 'error');
            }
        } catch (err: any) {
            onToast(err.message || 'Failed to connect to server', 'error');
        } finally {
            setLoadingWishlist(false);
        }
    };

    const removeFromWishlist = async (gameId: string) => {
        if (!user.email) return;
        try {
            const res = await api.del<any>(`/api/wishlist/${gameId}?email=${encodeURIComponent(user.email)}`);
            if (res.success) {
                setWishlist(prev => prev.filter(item => item.id !== gameId));
                onToast('Removed from wishlist', 'success');
            }
        } catch (err: any) {
            onToast(err.message || 'Failed to remove', 'error');
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 512 * 1024) { // Limit to 512KB for localStorage
            onToast('Image is too large (max 500KB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            const updatedUser = { ...user, avatar: result };
            setUser(updatedUser);
            localStorage.setItem('userAuth', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('authUpdated'));
            onToast('Profile photo updated', 'success');
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <SubHero 
                title="My Profile"
                subtitle="Manage your orders, wishlist, and profile settings."
                breadcrumbItems={[
                    { label: 'Home', onClick: () => navigate('/') },
                    { label: 'Account' }
                ]}
            />
            <main className="container section" style={{ minHeight: '80vh' }}>
            {activeTab === 'profile' && (
                <div className="glass-card" style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative', width: 80, height: 80 }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                                {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                            </div>
                            <label htmlFor="avatarInput" style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--accent-purple)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--bg-primary)', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>✏️</label>
                            <input id="avatarInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{user.email || 'Gamer'}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={loadOrders}>📦 My Orders</button>
                        <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={loadWishlist}>❤️ Wishlist</button>
                        <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onToast('Settings feature coming soon!', 'info')}>⚙️ Settings</button>
                        <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                        <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>← Back</button>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>My Orders</h2>
                    </div>

                    {loadingOrders ? (
                        <div className="loading-state"><div className="spinner" /><p style={{ marginTop: '1rem' }}>Loading...</p></div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '2rem' }}>📦</div>
                            <p>No orders found for {user.email}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Order #{order.id.split('-')[0]}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--accent-green)' }}>LKR {parseFloat(order.totalAmount).toFixed(2)}</div>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {order.items?.map((item: any, i: number) => (
                                                <li key={i} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>• {item.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'wishlist' && (
                <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>← Back</button>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>My Wishlist</h2>
                    </div>

                    {loadingWishlist ? (
                        <div className="loading-state"><div className="spinner" /><p style={{ marginTop: '1rem' }}>Loading...</p></div>
                    ) : wishlist.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '2rem' }}>❤️</div>
                            <p>Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {wishlist.map(game => (
                                <div key={game.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                    <img src={game.image} alt={game.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                                    <div style={{ padding: '1rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>LKR {game.price}</span>
                                            <button className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => removeFromWishlist(game.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    </>
  );
};

export default UserProfilePage;