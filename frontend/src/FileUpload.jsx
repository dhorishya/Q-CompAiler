import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiFileText, FiImage, FiX } from 'react-icons/fi';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(file =>
      file.type === 'text/plain' || file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleRemove = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = () => {
    setUploading(true);
    setProgress(0);
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setProgress(100);
          if (onUpload) onUpload(files);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-area-modern${dragActive ? ' active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".txt,image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <FiUploadCloud size={48} className="upload-icon" />
        <p className="drop-text">
          Drag & drop <span className="accent">.txt</span> or <span className="accent">image</span> files here,<br /> or <span className="browse-link">browse</span>
        </p>
      </div>
      {files.length > 0 && (
        <div className="file-list-modern">
          <h4>Selected files:</h4>
          <ul>
            {files.map((file, idx) => (
              <li key={idx} className="file-item">
                {file.type.startsWith('image/') ? (
                  <span className="file-thumb">
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                  </span>
                ) : (
                  <span className="file-thumb file-icon"><FiFileText size={24} /></span>
                )}
                <span className="file-name">{file.name}</span>
                <button className="remove-btn" onClick={e => { e.stopPropagation(); handleRemove(idx); }} title="Remove">
                  <FiX size={18} />
                </button>
              </li>
            ))}
          </ul>
          <button className="upload-btn-modern" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {uploading && (
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 