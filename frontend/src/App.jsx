import React from 'react';
import Navbar from './Navbar';
import FileUpload from './FileUpload';
import './App.css';

function App() {
  const handleUpload = (files) => {
    // Placeholder for upload logic
    console.log('Files to upload:', files);
  };

  return (
    <div className="App dark-bg">
      <Navbar />
      <main className="main-content">
        <section className="intro-section">
          <h1>Question Clustering Webapp</h1>
          <p className="subtitle">Upload past question papers (.txt or images) and cluster semantically similar questions automatically.</p>
        </section>
        <section className="upload-section">
          <FileUpload onUpload={handleUpload} />
        </section>
      </main>
    </div>
  );
}

export default App;
