import React from 'react';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar-glass">
    <div className="navbar-content">
      <div className="logo-area">
        <Logo size={36} />
        <span className="project-name">Q-CompAiler</span>
      </div>
    </div>
  </nav>
);

export default Navbar; 