import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SubHero from '../components/SubHero';

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

            // Check profile status
            if (user.email) {
                const userRef = doc(db, 'users', user.email);
                const userDoc = await getDoc(userRef);
                
                localStorage.setItem('userAuth', JSON.stringify({ email: user.email, uid: user.uid }));
                window.dispatchEvent(new Event('authUpdated'));
                
                if (!userDoc.exists() || !userDoc.data().onboardingComplete) {
                    onToast('Almost there! Please complete your profile.', 'info');
                    navigate('/onboarding');
                } else {
                    onToast('Welcome back!', 'success');
                    navigate('/');
                }
            }
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

            if (user.email) {
                try {
                    // Use email as doc ID as requested
                    const userRef = doc(db, 'users', user.email);
                    const userDoc = await getDoc(userRef);

                    localStorage.setItem('userAuth', JSON.stringify({ email: user.email, uid: user.uid }));
                    window.dispatchEvent(new Event('authUpdated'));

                    if (!userDoc.exists() || !userDoc.data().onboardingComplete) {
                        onToast('Success! Click to complete your profile.', 'success');
                        navigate('/onboarding');
                    } else {
                        onToast('Welcome back!', 'success');
                        navigate('/');
                    }
                } catch (dbError: any) {
                    console.error("🔥 Firestore Permission Error:", dbError);
                    if (dbError.code === 'permission-denied') {
                        onToast('Database access denied. Please check Firestore Security Rules.', 'error');
                    } else {
                        onToast('Signed in, but failed to load profile.', 'warning');
                    }
                    // Fallback: Proceed with login but warn about profile
                    localStorage.setItem('userAuth', JSON.stringify({ email: user.email, uid: user.uid }));
                    window.dispatchEvent(new Event('authUpdated'));
                    navigate('/');
                }
            }
        } catch (authError: any) {
            console.error("🔑 Google Auth Error:", authError);
            onToast(authError.message || 'Google sign-in failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SubHero 
                title="Welcome Back"
                subtitle="Sign in to your account to access your digital library, track orders, and manage your profile."
                breadcrumbItems={[
                    { label: 'Home', onClick: () => navigate('/') },
                    { label: 'Sign In' }
                ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', paddingBottom: '80px', marginTop: '40px' }}>
                <div className="login-card">
                    <div className="login-header">
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Sign in to access your library</p>
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
    </>
    );
};

export default UserLoginPage;