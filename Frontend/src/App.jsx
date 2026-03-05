import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="main-wrapper">
      
      <div className="left-side">
        <div className="content-box">
          <h1>Create Stunning Thumbnails</h1>
          <p>
            Process your media through our high-speed serverless 
            infrastructure. Simple, fast, and scalable.
          </p>
          
          <div className="upload-container">
            <label htmlFor="file-upload" className="shiny-button">
              {file ? "Change File" : "Upload Media"}
            </label>
            <input 
              type="file" 
              id='file-upload' 
              onChange={handleFile} 
              accept="image/*,video/*" 
            />
          </div>

          {file && (
            <div className="file-status">
              <span className="pulse-icon"></span>
              <span>Ready: <strong>{file.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: 60% width with Background Image */}
      <div className="right-side">
        {/* The background is handled in CSS */}
      </div>
    </div>
  );
}

export default App;