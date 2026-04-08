import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

interface LoginPageProps {
  onToast: (msg: string, type: string) => void;
}

const AdminLoginPage: React.FC<LoginPageProps> = ({ onToast }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Login | GamexLK Store';
    if (localStorage.getItem('authToken')) navigate('/admin');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<any>('/api/login', { password });
      if (res.success) {
        localStorage.setItem('authToken', res.token);
        navigate('/admin');
      } else {
        onToast(res.error || 'Invalid password', 'error');
      }
    } catch {
      onToast('Login failed. Is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1>Admin Login</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter password to manage games</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
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
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Back to Store</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;