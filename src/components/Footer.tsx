import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <h3 className="footer-brand">
            <img src="https://i.ibb.co/4gdjwSnX/ce86813e11e7.webp" alt="Gamexlk Logo" className="logo-img" />
            <span>Gamex<span className="highlight">LK</span></span>
          </h3>
          <p>
            Your trusted destination for digital games.
            Experience the next level of gaming with curated collections, instant delivery, and secure payments.
          </p>
          {/* Optional: Social Media Links */}
          <div className="social-links">
            {/* Add your social media icons/links here, e.g.: */}
            {/* <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a> */}
            {/* <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a> */}
          </div>
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
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/userlogin">User Sign In</Link></li>
            <li><a href="mailto:support@gamexlk.com">Contact Support</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p className="contact-info">Email: [EMAIL_ADDRESS]</p>
          <p className="contact-info">Sri Lanka</p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Gamexlk. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
            Website developed & published by{' '}
            <a href="https://susaracreations.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-purple-light)', fontWeight: 600 }}>Susara Creations</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
