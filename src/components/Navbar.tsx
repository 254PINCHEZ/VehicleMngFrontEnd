import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
// import logo from "../assets/vehicle-logo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand Name */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-logo">
            {/* <img src={} alt="VehicleMNG Logo" className="logo-image" /> */}
          </div>
          <span className="brand-name">TURAGA RENTALS</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </div>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className="nav-link" 
            onClick={closeMenu}
          >
            {/* Home
          </Link>
          <Link 
            to="/inventory" 
            className="nav-link" 
            onClick={closeMenu}
          > */}
            Available Vehicle
          </Link>
          <Link 
            to="/how-it-works" 
            className="nav-link" 
            onClick={closeMenu}
          >
            How It Works
          </Link>
          <Link 
            to="/my-bookings" 
            className="nav-link" 
            onClick={closeMenu}
          >
            My Bookings
          </Link>
          <Link 
            to="/about" 
            className="nav-link" 
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="nav-link" 
            onClick={closeMenu}
          >
            Contact
          </Link>
        </div>

        {/* User Actions */}
        {/* <div className="navbar-actions">
          <Link to="/login" className="nav-login-btn">
            Sign In
          </Link>
          <Link to="/register" className="nav-register-btn">
            Register
          </Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;