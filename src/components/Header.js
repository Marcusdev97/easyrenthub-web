// src/components/Header.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../images/logo.png';
import bannerImage from '../images/banner.png';
import '../styles/Header.css'; // Import the CSS file for styling

const Header = () => {
  const location = useLocation(); // Get current route

  return (
    <header className="header">
      {/* Left Side - Logo / Banner */}
      <div className="logo-container">
        <Link to="/">
          <picture>
            <source media="(max-width: 768px)" srcSet={logoImage} />
            <source media="(min-width: 769px)" srcSet={bannerImage} />
            <img
              src={bannerImage} // Fallback image
              alt="Logo"
              className="header-image"
            />
          </picture>
        </Link>
      </div>

      {/* Right Side - Navigation Links */}
      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          主页
        </Link>
        <Link
          to="/properties"
          className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}
        >
          房源
        </Link>
        {/* Uncomment if needed */}
        {/* <Link
          to="/contact"
          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          联络我们
        </Link> */}
      </nav>
    </header>
  );
};

export default Header;
