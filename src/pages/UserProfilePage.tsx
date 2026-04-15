import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { db, auth } from '../firebase';
import SubHero from '../components/SubHero';
import Loader from '../components/Loader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserProfilePageProps {
    onToast: (msg: string, type: string) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string; avatar?: string }>({ email: '' });
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings'>('profile');
    
    // Profile Data from Firestore
    const [profileData, setProfileData] = useState({
        name: '',
        whatsapp: '',
        discord: ''
    });

    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        document.title = 'My Profile | GamexLK Store';
        const auth = localStorage.getItem('userAuth');
        if (!auth) {
            navigate('/signin');
            return;
        }
        try {
            const userData = JSON.parse(auth);
            setUser(userData);
            // Auto-load basic profile info into local state
            fetchProfileData(userData.email);
        } catch {
            navigate('/signin');
        }
    }, [navigate]);

    const fetchProfileData = async (email: string) => {
        if (!email) return;
        try {
            const userRef = doc(db, 'users', email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setProfileData({
                    name: data.name || '',
                    whatsapp: data.whatsapp || '',
                    discord: data.discord || ''
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

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
            onToast(err.message || 'Failed to connect to server', 'error');
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

    const loadSettings = async () => {
        setActiveTab('settings');
        setLoadingSettings(true);
        await fetchProfileData(user.email);
        setLoadingSettings(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.email) return;

        setSavingSettings(true);
        try {
            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, {
                name: profileData.name,
                whatsapp: profileData.whatsapp,
                discord: profileData.discord,
                updatedAt: new Date().toISOString()
            });
            onToast('Profile updated successfully!', 'success');
            setActiveTab('profile');
        } catch (err: any) {
            onToast(err.message || 'Failed to update profile', 'error');
        } finally {
            setSavingSettings(false);
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

        if (file.size > 512 * 1024) {
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
        <div className="fade-in">
            <style>{`
                .profile-name {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 0.25rem;
                }
                .profile-avatar-container {
                    width: 90px;
                    height: 90px;
                    font-size: 3rem;
                }
                .avatar-edit-badge {
                    width: 32px;
                    height: 32px;
                    font-size: 1rem;
                }
                @media (max-width: 768px) {
                    .profile-name { font-size: 1.4rem; }
                    .profile-header { gap: 1rem !important; }
                    .profile-avatar-container {
                        width: 70px; height: 70px; font-size: 2.2rem;
                    }
                    .avatar-edit-badge { width: 26px; height: 26px; font-size: 0.8rem; }
                }
            `}</style>
            <SubHero 
                title={activeTab === 'profile' ? "My Profile" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                subtitle="Manage your orders, wishlist, and profile settings."
                breadcrumbItems={[
                    { label: 'Home', onClick: () => navigate('/') },
                    { label: 'Account', onClick: () => setActiveTab('profile') },
                    { label: activeTab !== 'profile' ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : '' }
                ].filter(i => i.label !== '')}
            />
            <main className="container section" style={{ minHeight: '80vh' }}>
            
            {activeTab === 'profile' && (
                <div className="glass-card" style={{ padding: '2.5rem', maxWidth: 600, margin: '0 auto' }}>
                    <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="profile-avatar-container" style={{ position: 'relative', flexShrink: 0 }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'inherit', boxShadow: 'var(--shadow-lg)' }}>
                                {auth.currentUser?.photoURL || user.avatar ? (
                                    <img src={auth.currentUser?.photoURL || user.avatar || ''} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    '👤'
                                )}
                            </div>
                            <label htmlFor="avatarInput" className="avatar-edit-badge" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid var(--bg-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: '0.2s' }}>✏️</label>
                            <input id="avatarInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                        </div>
                        <div>
                            <h2 className="profile-name">{profileData.name || 'Gamer'}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{user.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-lg" style={{ justifyContent: 'flex-start', padding: '1rem 1.5rem' }} onClick={loadOrders}>
                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>📦</span> My Orders
                        </button>
                        <button className="btn btn-secondary btn-lg" style={{ justifyContent: 'flex-start', padding: '1rem 1.5rem' }} onClick={loadWishlist}>
                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>❤️</span> Wishlist
                        </button>
                        <button className="btn btn-secondary btn-lg" style={{ justifyContent: 'flex-start', padding: '1rem 1.5rem' }} onClick={loadSettings}>
                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>⚙️</span> Settings
                        </button>
                        
                        <div style={{ borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                        
                        <button className="btn btn-danger" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>← Back</button>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Profile Settings</h2>
                    </div>

                    {loadingSettings ? <Loader message="Fetching your info..." /> : (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profileData.name}
                                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={profileData.whatsapp}
                                    onChange={e => setProfileData({...profileData, whatsapp: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Discord Username (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profileData.discord}
                                    onChange={e => setProfileData({...profileData, discord: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg" 
                                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                                disabled={savingSettings}
                            >
                                {savingSettings ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>← Back</button>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>My Orders</h2>
                    </div>

                    {loadingOrders ? (
                        <Loader message="Fetching orders..." />
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                            <p style={{ color: 'var(--text-secondary)' }}>No orders found for your account.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {orders.map(order => (
                                <div key={order.id} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Order #{order.id.split('-')[0].toUpperCase()}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--accent-purple-light)' }}>LKR {parseFloat(order.totalAmount).toFixed(2)}</div>
                                            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '0.7rem' }}>COMPLETED</span>
                                        </div>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {order.items?.map((item: any, i: number) => (
                                                <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {item.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'wishlist' && (
                <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>← Back</button>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>My Wishlist</h2>
                    </div>

                    {loadingWishlist ? (
                        <Loader message="Fetching wishlist..." />
                    ) : wishlist.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Your wishlist is currently empty.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            {wishlist.map(game => (
                                <div key={game.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                                    <img src={game.image} alt={game.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                                    <div style={{ padding: '1.25rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'white', fontWeight: 800 }}>LKR {game.price}</span>
                                            <button className="btn btn-danger btn-sm" onClick={() => removeFromWishlist(game.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
  );
};

export default UserProfilePage;