import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadItem.css';

const UploadItem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        condition: '',
        size: '',
        brand: '',
        price: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically upload to your backend
        alert('Item uploaded successfully!');
        navigate('/user-dashboard');
    };

    const handleBack = () => {
        navigate('/user-dashboard');
    };

    return (
        <div className="upload-item-container">
            <div className="upload-header">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Dashboard
                </button>
                <h1>Upload New Item</h1>
            </div>

            <div className="upload-form-container">
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-section">
                        <h2>Item Details</h2>

                        <div className="form-group">
                            <label htmlFor="name">Item Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Vintage Blazer"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Pants">Pants</option>
                                    <option value="Blazers">Blazers</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Suits">Suits</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="condition">Condition *</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Condition</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="size">Size</label>
                                <input
                                    type="text"
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    placeholder="e.g., M, Large, 32"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="brand">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Nike, Zara"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Describe your item in detail..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Estimated Value ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Optional - for reference"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Photos</h2>
                        <div className="image-upload-area">
                            <div className="upload-placeholder">
                                <span className="upload-icon">📸</span>
                                <p>Click to upload photos</p>
                                <p className="upload-note">Add up to 5 photos of your item</p>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={handleBack}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Upload Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadItem;
