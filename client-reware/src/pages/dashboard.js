import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get current user data or create mock data if not available
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Set mock user data for testing/demo purposes
      setUser({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        username: 'demouser',
        _id: 'demo123',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        points: 25
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear any stored data and redirect to login
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search functionality here
  };

  const showLocalStorageData = () => {
    console.log('=== LOCAL STORAGE DATA ===');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User Data:', localStorage.getItem('user'));
    console.log('Parsed User:', JSON.parse(localStorage.getItem('user') || '{}'));
    console.log('All Local Storage:', localStorage);
    
    // Also show in alert for quick viewing
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    alert(`Local Storage Data:
    
Token: ${localStorage.getItem('token') ? 'Present' : 'Not found'}
User: ${userData.firstName} ${userData.lastName}
Email: ${userData.email}
Username: ${userData.username}
User ID: ${userData._id}`);
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Sample data for demonstration
  const categories = [
    'Shirts', 'Dresses', 'Pants', 'Blazers', 'T-Shirts', 'Suits'
  ];

  const products = [
    { id: 1, name: 'Elegant Blazer', image: '/images/blazer.jpeg', category: 'Blazers' },
    { id: 2, name: 'Summer Dress', image: '/images/dress.jpeg', category: 'Dresses' },
    { id: 3, name: 'Casual Shirt', image: '/images/shirt.jpeg', category: 'Shirts' },
    { id: 4, name: 'Business Suit', image: '/images/suit.jpg', category: 'Suits' },
    { id: 5, name: 'Cotton T-Shirt', image: '/images/t-shirt.jpeg', category: 'T-Shirts' },
    { id: 6, name: 'Formal Pants', image: '/images/pant.jpg', category: 'Pants' },
    { id: 7, name: 'Night Dress', image: '/images/night.jpeg', category: 'Dresses' },
    { id: 8, name: 'Women\'s Top', image: '/images/top.jpeg', category: 'Shirts' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <h1 className="dashboard-title">ReWear</h1>
          <div className="header-actions">
            <button 
              onClick={showLocalStorageData}
              className="debug-button"
              title="Show Local Storage Data"
            >
              📊 Debug
            </button>
            <span className="user-greeting">Hello, {user.firstName}!</span>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for clothing items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </div>

        {/* Featured Images Section */}
        <div className="images-section">
          <h2>Featured Collections</h2>
          <div className="featured-images">
            <div className="featured-image">
              <img src="/images/blazer.jpeg" alt="Blazers Collection" />
              <div className="image-overlay">Blazers</div>
            </div>
            <div className="featured-image">
              <img src="/images/dress.jpeg" alt="Dresses Collection" />
              <div className="image-overlay">Dresses</div>
            </div>
            <div className="featured-image">
              <img src="/images/shirt.jpeg" alt="Shirts Collection" />
              <div className="image-overlay">Shirts</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="categories-section">
          <h2>Categories</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Listings */}
        <div className="products-section">
          <h2>Product Listings</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <button className="product-action-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
