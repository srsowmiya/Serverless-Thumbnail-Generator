import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload) => {
    
    if (!fileToUpload) return;
    
    setIsUploading(true);

    try {
     
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: fileToUpload.name,
          filetype: fileToUpload.type
        })
      });

      if (!response.ok) throw new Error('Failed to get the upload url');
      
      const data = await response.json();
      
     
      const s3Url = data.uploadUrl; 

   
      const uploadResponse = await fetch(s3Url, {
        method: 'PUT',
        headers: { 'Content-Type': fileToUpload.type },
        body: fileToUpload
      });

      if (uploadResponse.ok) {
        alert('File uploaded successfully!');
      } else {
        console.error('S3 Upload Failed');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="left-side">
        <div className="content-box">
          <h1>Create Stunning Thumbnails</h1>
          <p>Simple, fast, and scalable serverless infrastructure.</p>
          
          <div className="upload-container">
            <label htmlFor="file-upload" className="shiny-button">
              {isUploading ? "Uploading..." : (file ? "Change File" : "Upload Media")}
            </label>
            <input 
              type="file" 
              id='file-upload' 
              onChange={handleFile} 
              accept="image/*,video/*" 
              disabled={isUploading}
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
      <div className="right-side"></div>
    </div>
  );
}

export default App;