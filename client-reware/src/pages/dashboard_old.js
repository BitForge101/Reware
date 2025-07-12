import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token, redirect to login
        navigate('/login');
        return;
      }

      try {
        // Verify token with backend by fetching user profile
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // Token is valid and user exists in database
            setUser(data.user);
          } else {
            // Invalid response, clear storage and redirect
            localStorage.clear();
            navigate('/login');
          }
        } else {
          // Token is invalid or expired, clear storage and redirect
          localStorage.clear();
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Network error or server error, clear storage and redirect
        localStorage.clear();
        navigate('/login');
      }
    };

    checkAuthentication();
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
  const demoCategories = [
    'Shirts', 'Dresses', 'Pants', 'Blazers', 'T-Shirts', 'Suits'
  ];

  const products = [
    { id: 1, name: 'Elegant Blazer', image:blazer, category: 'Blazers' },
    { id: 2, name: 'Summer Dress', image: dress, category: 'Dresses' },
    { id: 3, name: 'Casual Shirt', image: shirt, category: 'Shirts' },
    { id: 4, name: 'Business Suit', image: suit, category: 'Suits' },
    { id: 5, name: 'Cotton T-Shirt', image: tshirt, category: 'T-Shirts' },
    { id: 6, name: 'Formal Pants', image: pant, category: 'Pants' },
    { id: 7, name: 'Night Dress', image: night, category: 'Dresses' },
    { id: 8, name: 'Women\'s Top', image: top, category: 'Shirts' }

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
              <img src={blazer} alt="Blazers Collection" />
              <div className="image-overlay">Blazers</div>
            </div>
            <div className="featured-image">
              <img src={dress} alt="Dresses Collection" />
              <div className="image-overlay">Dresses</div>
            </div>
            <div className="featured-image">
              <img src={shirt} alt="Shirts Collection" />
              <div className="image-overlay">Shirts</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="categories-section">
          <h2>Categories</h2>
          <div className="categories-grid">
            {demoCategories.map((category, index) => (
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
