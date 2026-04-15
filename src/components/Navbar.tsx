import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cart } from '../utils/cart';
import { auth } from '../firebase';

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
      const height = (isScrolled) ? '54px' : '60px';
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
          height: 60px;
          z-index: 1000;
          background: rgba(5, 5, 16, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease-in-out;
        }

        .navbar.scrolled {
          background: rgba(5, 5, 16, 1);
          height: 54px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
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
          gap: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          letter-spacing: 0.5px;
        }

        .logo-img {
          height: 22px;
          width: auto;
        }

        .highlight {
          color: var(--accent-cyan);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
          list-style: none;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: white;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .cart-btn svg {
            width: 18px;
            height: 18px;
        }

        .cart-btn:hover {
          color: white;
        }

        .cart-count {
          position: absolute;
          top: 0px;
          right: -2px;
          background: var(--accent-cyan);
          color: #000;
          font-size: 0.55rem;
          font-weight: 800;
          min-width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .navbar {
            height: 60px;
          }
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            height: auto;
            padding: 1rem 0;
            background: #050510;
            flex-direction: column;
            justify-content: center;
            gap: 1.5rem;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          }

          .nav-links.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
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
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Store</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {user ? (
            <Link to="/profile" className="cart-btn" aria-label="My Profile" style={{ padding: 0, width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              {auth.currentUser?.photoURL || user.avatar ? (
                <img src={auth.currentUser?.photoURL || user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1rem' }}>👤</span>
              )}
            </Link>
          ) : (
            <Link to="/signin" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '0px' }}>Sign In</Link>
          )}

          <button className="cart-btn" onClick={() => navigate('/checkout')} aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
