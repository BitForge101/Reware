import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';
import './itemForm.css';

const ItemForm = ({ item = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    price: item?.price || '',
    condition: item?.condition || 'excellent',
    size: item?.size || '',
    brand: item?.brand || '',
    color: item?.color || '',
    material: item?.material || '',
    tags: item?.tags?.join(', ') || '',
    status: item?.status || 'active',
    images: item?.images || []
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categories = [
    'Dresses', 'Shirts', 'Pants', 'Blazers', 'T-Shirts', 'Suits',
    'Jackets', 'Coats', 'Accessories', 'Shoes', 'Bags', 'Jewelry'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Noticeable wear' },
    { value: 'poor', label: 'Poor - Significant wear' }
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    '6', '8', '10', '12', '14', '16', '18',
    '28', '30', '32', '34', '36', '38', '40'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImagesUpload = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      const response = await fetch(`http://localhost:5000/api/admin/items${item ? `/${item._id}` : ''}`, {
        method: item ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSave(data.item);
        alert(`Item ${item ? 'updated' : 'created'} successfully!`);
      } else {
        alert(`Failed to ${item ? 'update' : 'create'} item: ${data.message}`);
      }
    } catch (error) {
      console.error('Save item error:', error);
      alert('An error occurred while saving the item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="item-form-container">
      <div className="item-form-header">
        <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
        <button 
          type="button" 
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter item name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Describe the item, its features, and condition"
                rows="4"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? 'error' : ''}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="form-section">
            <h3>Item Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="size">Size</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Brand name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Primary color"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g., Cotton, Polyester, Wool"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Separate tags with commas"
              />
              <small className="form-hint">
                Tags help customers find your item (e.g., vintage, casual, formal)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="form-section">
          <h3>Photos *</h3>
          <PhotoUpload
            onUpload={handleImagesUpload}
            maxFiles={5}
            existingImages={formData.images}
          />
          {errors.images && <span className="error-message">{errors.images}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
