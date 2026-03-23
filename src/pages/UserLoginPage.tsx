import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface UserLoginPageProps {
    onToast: (msg: string, type: string) => void;
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ onToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign In — Gamexlk Store';
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock login implementation
        setTimeout(() => {
            setLoading(false);
            localStorage.setItem('userAuth', JSON.stringify({ email }));
            window.dispatchEvent(new Event('authUpdated'));
            onToast('Welcome back! (Demo)', 'success');
            navigate('/');
        }, 1000);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', paddingTop: '40px' }}>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon" style={{ background: 'var(--bg-card)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', border: '1px solid var(--glass-border)' }}>👤</div>
                    <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your library</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="name@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label className="form-label">Password</label>
                            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textDecoration: 'none' }}>Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        New to Gamexlk? <Link to="/signup" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;