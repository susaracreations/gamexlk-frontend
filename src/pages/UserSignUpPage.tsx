// User Registration Page
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface UserSignUpPageProps {
    onToast: (msg: string, type: string) => void;
}

const UserSignUpPage: React.FC<UserSignUpPageProps> = ({ onToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Create Account — Gamexlk Store';
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            onToast('Passwords do not match', 'error');
            return;
        }

        if (formData.password.length < 6) {
            onToast('Password must be at least 6 characters', 'error');
            return;
        }

        setLoading(true);

        // Mock registration
        setTimeout(() => {
            setLoading(false);
            onToast('Account created successfully! Please sign in.', 'success');
            navigate('/signin');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="login-card">
                <div className="login-header">
                    <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Join Gamexlk today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Full Name</label>
                        <input name="name" type="text" className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Email Address</label>
                        <input name="email" type="email" className="form-control" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Password</label>
                        <input name="password" type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Confirm Password</label>
                        <input name="confirmPassword" type="password" className="form-control" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Already have an account? <Link to="/signin" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignUpPage;