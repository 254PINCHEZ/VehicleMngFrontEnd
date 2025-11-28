import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="vehicle-footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section footer-company">
          <h3 className="footer-title">VEHICLEMNG RENTALS</h3>
          <p className="footer-description">
            Your trusted partner for vehicle rentals in Kenya. 
            We provide quality two-wheelers and four-wheelers with transparent pricing and excellent customer service.
          </p>
          <div className="footer-contact-info">
            <p className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:rentals@vehiclemng.com" className="footer-link">
                rentals@vehiclemng.com
              </a>
            </p>
            <p className="contact-item">
              <span className="contact-icon">📞</span>
              <a href="tel:+254700000000" className="footer-link">
                +254 700 000 000
              </a>
            </p>
            <p className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="footer-address">
                Nairobi, Kenya<br />
                Multiple pickup locations
              </span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h3 className="footer-title">Quick Links</h3>
          <nav className="footer-nav">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/inventory" className="footer-link">Rent a Vehicle</Link>
            <Link to="/how-it-works" className="footer-link">How It Works</Link>
            <Link to="/my-bookings" className="footer-link">My Bookings</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </nav>
        </div>

        {/* Vehicle Categories */}
        <div className="footer-section footer-categories">
          <h3 className="footer-title">Rental Categories</h3>
          <div className="footer-nav">
            <Link to="/inventory?type=four-wheeler" className="footer-link">🚗 Four Wheelers</Link>
            <Link to="/inventory?type=two-wheeler" className="footer-link">🏍️ Two Wheelers</Link>
            <Link to="/inventory?fuel=electric" className="footer-link">⚡ Electric Vehicles</Link>
            <Link to="/inventory?category=luxury" className="footer-link">⭐ Luxury Vehicles</Link>
            <Link to="/inventory?category=economy" className="footer-link">💰 Economy Options</Link>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="footer-section footer-social">
          <h3 className="footer-title">Connect With Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-icon">
              <span className="social-icon-inner">📘</span>
              Facebook
            </a>
            <a href="#" aria-label="Instagram" className="social-icon">
              <span className="social-icon-inner">📷</span>
              Instagram
            </a>
            <a href="#" aria-label="Twitter" className="social-icon">
              <span className="social-icon-inner">🐦</span>
              Twitter
            </a>
            <a href="#" aria-label="LinkedIn" className="social-icon">
              <span className="social-icon-inner">💼</span>
              LinkedIn
            </a>
          </div>
          
          <div className="newsletter">
            <h4 className="newsletter-title">Rental Updates</h4>
            <p className="newsletter-text">Get deals and new vehicle alerts</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            &copy; {currentYear} <strong>VEHICLEMNG RENTALS</strong>. All rights reserved. | 
            Created with ❤️ by Peter Mungai
          </p>
          <div className="footer-legal">
            <Link to="/rental-terms" className="legal-link">Rental Terms</Link>
            <Link to="/privacy" className="legal-link">Privacy Policy</Link>
            <Link to="/faq" className="legal-link">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;