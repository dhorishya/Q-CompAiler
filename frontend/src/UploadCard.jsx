import React, { useRef, useState } from 'react';
import { FiFileText, FiUploadCloud } from 'react-icons/fi';
import './UploadCard.css';

const UploadCard = () => {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.txt')) {
      setFile(selected);
    } else {
      setFile(null);
      alert('Please select a .txt file.');
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {

    console.log('File:', file);
    if (!file || file.length === 0) {
      console.log('No file selected');
      return;
    };

    console.log('File name hereeer:', file.name);
    // const file = file[0];

    // Make sure it's a .txt file
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    try {
      // Read file contents as plain text
      const text = await file.text();

      // Send POST request to your FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/cluster_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Error from backend:', errData);
        alert(`Error: ${errData.error}`);
        return;
      }

      const result = await response.json();
      console.log('Clustering result:', result);

      // Optional: handle/display the clusters here
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload and cluster questions.');
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-card-icon">
        <FiFileText size={40} />
      </div>
      <h2 className="upload-card-title">Upload Your Questions</h2>
      <p className="upload-card-desc">
        Select a <span className="accent">.txt</span> file containing your questions, with each question on a separate line.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="choose-file-btn" onClick={handleButtonClick}>
        <FiUploadCloud size={18} style={{ marginRight: 8 }} />
        Choose File
      </button>
      {file && <div className="selected-file">{file.name}</div>}
      <button
        className="upload-btn-modern"
        onClick={handleUpload}
        disabled={!file}
        style={{ marginTop: '1.2rem' }}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadCard; 