import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import UploadCard from './UploadCard';
import './App.css';
import './HeroSection.css';
import './UploadCard.css';

function App() {
  

  return (
    <div className="App dark-bg">
      <Navbar />
      <main className="main-content">
        <HeroSection />
        <UploadCard  />
      </main>
    </div>
  );
}

export default App;