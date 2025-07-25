import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-icon">
      <FiBarChart2 size={56} />
    </div>
    <h1 className="hero-title">Intelligent Question Clustering</h1>
    <p className="hero-subtitle">
      Upload your questions and let our AI automatically group them into meaningful clusters for better organization and analysis.
    </p>
  </section>
);

export default HeroSection; 