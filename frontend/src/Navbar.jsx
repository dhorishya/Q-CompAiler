import React from 'react';
import Logo from './Logo';
import { FiInfo } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar-glass">
    <div className="navbar-content">
      <div className="logo-area">
        <Logo size={36} />
        <div className="project-title-block">
          <span className="project-name">Q-CompAiler</span>
          <span className="project-subtitle">AI-POWERED QUESTION CLUSTERING</span>
        </div>
      </div>
      <div className="navbar-info">
        <FiInfo size={22} title="About" />
      </div>
    </div>
  </nav>
);

export default Navbar; 