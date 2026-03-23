import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfilePageProps {
    onToast: (msg: string, type: string) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string; avatar?: string }>({ email: '' });

    useEffect(() => {
        document.title = 'My Profile — Gamexlk Store';
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
        <main className="container section" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <h1 className="section-title">My Profile</h1>
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
                    <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onToast('Orders feature coming soon!', 'info')}>📦 My Orders</button>
                    <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onToast('Wishlist feature coming soon!', 'info')}>❤️ Wishlist</button>
                    <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onToast('Settings feature coming soon!', 'info')}>⚙️ Settings</button>
                    <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                    <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </main>
    );
};

export default UserProfilePage;