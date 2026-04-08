import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserLoginPageProps {
    onToast: (msg: string, type: string) => void;
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ onToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign In | GamexLK Store';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('userAuth', JSON.stringify({ email: user.email, uid: user.uid }));
            window.dispatchEvent(new Event('authUpdated'));
            onToast('Welcome back!', 'success');
            navigate('/');
        } catch (error: any) {
            onToast(error.message || 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider); 
            const user = result.user;

            // Check if user document exists in Firestore, if not create it
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString(),
                    role: 'user'
                });
            }

            localStorage.setItem('userAuth', JSON.stringify({ email: user.email, uid: user.uid }));
            window.dispatchEvent(new Event('authUpdated'));
            onToast('Successfully signed in with Google!', 'success');
            navigate('/');
        } catch (error: any) {
            onToast(error.message || 'Google sign-in failed', 'error');
        } finally {
            setLoading(false);
        }
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
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ padding: '0 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                        disabled={loading}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18 }} />
                        Sign in with Google
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