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

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      
      const isMobile = window.innerWidth <= 900;
      const height = (isMobile || isScrolled) ? '64px' : '72px';
      document.documentElement.style.setProperty('--navbar-height', height);
    };
    
    // Set initial height
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('cartUpdated', update);
      window.removeEventListener('authUpdated', updateAuth);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 72px;
          z-index: 1000;
          background: rgba(5, 5, 16, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
          background: rgba(5, 5, 16, 0.98);
          height: 64px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .navbar-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .logo-img {
          height: 28px;
          width: auto;
          transition: transform var(--transition);
        }

        .highlight {
          color: var(--accent-purple);
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
          position: relative;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: white;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          width: 4px;
          height: 4px;
          background: var(--accent-purple);
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s ease;
          font-size: 1.25rem;
        }

        .cart-btn:hover {
          color: white;
        }

        .cart-count {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--accent-purple);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 2px solid var(--bg-primary);
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 900px) {
          .navbar {
            height: var(--navbar-height, var(--navbar-default-height));
            top: 0;
          }
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: var(--navbar-height, 72px);
            left: 0;
            width: 100%;
            height: calc(100vh - var(--navbar-height, 72px));
            background: rgba(5, 5, 16, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
          }

          .nav-links.active {
            transform: translateX(0);
          }

          .navbar.scrolled .nav-links {
            top: 64px;
            height: calc(100vh - 64px);
          }

          .mobile-only {
            display: block;
          }
        }
      `}</style>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img
            src="https://i.ibb.co/4gdjwSnX/ce86813e11e7.webp"
            alt="Gamexlk Logo"
            className="logo-img"
          />
          <span>Gamex<span className="highlight">LK</span></span>
        </Link>

        {/* Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
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
    </>
  );
};

export default Navbar;
