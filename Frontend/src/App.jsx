import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null); // New State for result

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setThumbnailUrl(null); // Reset when new file is picked
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
        // 🔥 Trigger the Polling logic here
        fetchThumbnail(fileToUpload.name);
      } else {
        console.error('S3 Upload Failed');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // 🕵️ Check if the thumbnail is ready in S3
  const fetchThumbnail = (fileName) => {
    // Construct the expected thumbnail URL
    // Format: https://BUCKET_NAME.s3.REGION.amazonaws.com/thumbnails/FILENAME
    const bucketUrl = `https://your-bucket-name.s3.us-east-1.amazonaws.com/thumbnails/${fileName}`;
    
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const check = await fetch(bucketUrl, { method: 'HEAD' });
        if (check.ok) {
          setThumbnailUrl(bucketUrl);
          clearInterval(interval);
        }
      } catch (e) {
        console.log("Still processing...",e);
      }
      

      if (attempts > 10) clearInterval(interval); // Stop after 20 seconds
    }, 2000);
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

      <div className="right-side">
        {/* 🔥 Display the Result here */}
        {thumbnailUrl ? (
          <div className="result-card">
            <h3>Result Generated</h3>
            <img src={thumbnailUrl} alt="Thumbnail" className="preview-img" />
            <a href={thumbnailUrl} download className="download-btn">Download Thumbnail</a>
          </div>
        ) : (
          isUploading && <div className="loader">Processing your image...</div>
        )}
      </div>
    </div>
  );
}

export default App;