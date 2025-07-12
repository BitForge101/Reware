import React, { useState, useRef } from 'react';
import './photoUpload.css';

const PhotoUpload = ({ onUpload, maxFiles = 5, existingImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(existingImages);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (files.length + uploadedImages.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file, index) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/admin/items/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const newImages = [...uploadedImages, ...data.images];
        setUploadedImages(newImages);
        onUpload(newImages);
        alert('Images uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onUpload(newImages);
  };

  return (
    <div className="photo-upload-container">
      <div className="upload-section">
        <h3>Upload Photos</h3>
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="upload-progress">
              <div className="spinner"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📸</div>
              <p>Click or drag photos here to upload</p>
              <p className="upload-hint">
                Support: JPG, PNG, GIF (Max {maxFiles} files, 5MB each)
              </p>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-actions">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn btn-secondary"
          >
            Choose Files
          </button>
          <span className="file-count">
            {uploadedImages.length} / {maxFiles} images
          </span>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h4>Uploaded Images</h4>
          <div className="images-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-item">
                <img 
                  src={`http://localhost:5000${image.url}`} 
                  alt={`Upload ${index + 1}`}
                  className="uploaded-image"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-image"
                  title="Remove image"
                >
                  ×
                </button>
                <div className="image-info">
                  <p className="image-name">{image.originalName}</p>
                  <p className="image-size">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
