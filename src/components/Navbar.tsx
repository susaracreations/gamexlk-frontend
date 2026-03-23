import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cart } from '../utils/cart';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(Cart.count());
  const [user, setUser] = useState<{ email: string; avatar?: string } | null>(() => {
    const auth = localStorage.getItem('userAuth');
    try { return auth ? JSON.parse(auth) : null; } catch { return null; }
  });
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      setCartCount(Cart.count());
    };
    const updateAuth = () => {
      const auth = localStorage.getItem('userAuth');
      try { setUser(auth ? JSON.parse(auth) : null); } catch { setUser(null); }
    };
    window.addEventListener('cartUpdated', update);
    window.addEventListener('authUpdated', updateAuth);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cartUpdated', update);
      window.removeEventListener('authUpdated', updateAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">Game<span className="highlight">xlk</span></Link>

        {/* Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/checkout" className="mobile-only">Cart ({cartCount})</Link>
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {user ? (
            <Link to="/profile" className="cart-btn" aria-label="My Profile" style={{ padding: 0, width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.5rem' }}>👤</span>
              )}
            </Link>
          ) : (
            <Link to="/signin" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>Sign In</Link>
          )}

          <button className="cart-btn" onClick={() => navigate('/checkout')} aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
