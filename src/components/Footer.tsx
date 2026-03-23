import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <h3>Game<span className="highlight">xlk</span></h3>
          <p>
            Your trusted destination for digital games.
            Experience the next level of gaming with curated collections, instant delivery, and secure payments.
          </p>
        </div>

        {/* Links Column */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products?sort=newest">New Releases</Link></li>
            <li><Link to="/products?sort=rating">Top Rated</Link></li>
            <li><Link to="/products?sort=price-asc">Best Deals</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <Link to="/about">About Us</Link>
            <li><Link to="/signin">User Sign In</Link></li>
            <li><Link to="/login">Admin Login</Link></li>
            <li><a href="mailto:support@gamexlk.com">Contact Support</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
            Email: support@gamexlk.com
          </p>
          <p style={{ color: '#94a3b8' }}>
            Colombo, Sri Lanka
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Gamexlk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
