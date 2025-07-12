import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard.css';
import blazer from '../images/blazer.jpeg';
import dress from '../images/dress.jpeg'
import shirt from '../images/shirt.jpeg';
import suit from '../images/suit.jpg';
import tshirt from '../images/tshirt.jpeg';
import pant from '../images/pant.jpg';
import night from '../images/night.jpeg';
import top from '../images/top.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
<<<<<<< Updated upstream
    const checkAuthentication = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        // No token, redirect to login
        navigate('/login');
        return;
      }
=======
    const initializeDashboard = async () => {
      await checkAuthentication();
      await fetchDashboardData();
    };
>>>>>>> Stashed changes

    initializeDashboard();
  }, [navigate]);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.clear();
          navigate('/login');
        }
      } else {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured items
      const featuredResponse = await fetch(`${API_BASE}/items/featured?limit=6`);
      const featuredData = await featuredResponse.json();
      
      if (featuredData.success) {
        setFeaturedItems(featuredData.data);
      }

      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE}/items/categories`);
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      // Fetch recent items for the general grid
      const itemsResponse = await fetch(`${API_BASE}/items?limit=12&sortBy=createdAt&sortOrder=desc`);
      const itemsData = await itemsResponse.json();
      
      if (itemsData.success) {
        setAllItems(itemsData.data);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to a search results page or filter current items
      console.log('Searching for:', searchQuery);
      // You can implement search navigation here
    }
  };

  const handleCategoryClick = (categoryName) => {
    console.log('Category clicked:', categoryName);
    // Navigate to category page or filter items
  };

  const handleItemClick = (itemId) => {
    console.log('Item clicked:', itemId);
    // Navigate to item detail page
  };

  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      const imageUrl = item.images[0].url;
      // Check if it's a relative path or absolute URL
      if (imageUrl.startsWith('/images/')) {
        // For local images in the public folder
        return process.env.PUBLIC_URL + imageUrl;
      } else if (imageUrl.startsWith('http')) {
        // For external URLs (Cloudinary, etc.)
        return imageUrl;
      } else {
        // Fallback for relative paths
        return process.env.PUBLIC_URL + '/images/' + imageUrl;
      }
    }
    // Default fallback image
    return process.env.PUBLIC_URL + '/images/default-item.jpg';
  };

  const showLocalStorageData = () => {
    console.log('=== LOCAL STORAGE DATA ===');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User Data:', localStorage.getItem('user'));
    console.log('Parsed User:', JSON.parse(localStorage.getItem('user') || '{}'));
<<<<<<< Updated upstream
    console.log('All Local Storage:', localStorage);

    // Also show in alert for quick viewing
=======
    
>>>>>>> Stashed changes
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    alert(`Local Storage Data:
    
Token: ${localStorage.getItem('token') ? 'Present' : 'Not found'}
User: ${userData.firstName} ${userData.lastName}
Email: ${userData.email}
Username: ${userData.username}
User ID: ${userData._id}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-loading">
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

<<<<<<< Updated upstream
  // Sample data for demonstration
  const categories = [
    'Shirts', 'Dresses', 'Pants', 'Blazers', 'T-Shirts', 'Suits'
  ];

  const products = [
    { id: 1, name: 'Elegant Blazer', image: blazer, category: 'Blazers' },
    { id: 2, name: 'Summer Dress', image: dress, category: 'Dresses' },
    { id: 3, name: 'Casual Shirt', image: shirt, category: 'Shirts' },
    { id: 4, name: 'Business Suit', image: suit, category: 'Suits' },
    { id: 5, name: 'Cotton T-Shirt', image: tshirt, category: 'T-Shirts' },
    { id: 6, name: 'Formal Pants', image: pant, category: 'Pants' },
    { id: 7, name: 'Night Dress', image: night, category: 'Dresses' },
    { id: 8, name: 'Women\'s Top', image: top, category: 'Shirts' }

  ];

=======
>>>>>>> Stashed changes
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">ReWear</h1>
          <div className="header-actions">
<<<<<<< Updated upstream
            <button
              onClick={showLocalStorageData}
              className="debug-button"
              title="Show Local Storage Data"
            >
              📊 Debug
            </button>
            <span
              className="user-greeting clickable-username"
              onClick={() => navigate('/user-dashboard')}
              title="Click to view your profile"
            >
              Hello, {user.firstName}!
            </span>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
=======
            <span className="user-greeting">
              Welcome back, {user.firstName}!
            </span>
            <button onClick={showLocalStorageData} className="debug-button">
              Debug Info
            </button>
            <button onClick={handleLogout} className="logout-button">
>>>>>>> Stashed changes
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Search Section */}
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items, brands, categories..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </section>

        {/* Featured Items Section */}
        {featuredItems.length > 0 && (
          <section className="images-section">
            <h2>Featured Items</h2>
            <div className="featured-images">
              {featuredItems.map((item) => (
                <div
                  key={item._id}
                  className="featured-image"
                  onClick={() => handleItemClick(item._id)}
                >
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = process.env.PUBLIC_URL + '/images/default-item.jpg';
                    }}
                  />
                  <div className="image-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.pointsValue} Points</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="categories-section">
            <h2>Shop by Category</h2>
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.name)}
                  style={{ borderColor: category.color }}
                >
                  <div className="category-icon" style={{ color: category.color }}>
                    {category.icon}
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Items Section */}
        {allItems.length > 0 && (
          <section className="products-section">
            <h2>Recent Items</h2>
            <div className="products-grid">
              {allItems.map((item) => (
                <div
                  key={item._id}
                  className="product-card"
                  onClick={() => handleItemClick(item._id)}
                >
                  <div className="product-image">
                    <img
                      src={getImageUrl(item)}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = process.env.PUBLIC_URL + '/images/default-item.jpg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{item.title}</h3>
                    <p className="product-category">{item.category}</p>
                    <div className="product-details">
                      <span className="product-condition">{item.condition}</span>
                      {item.size && item.size !== 'Not Applicable' && (
                        <span className="product-size">Size: {item.size}</span>
                      )}
                    </div>
                    <div className="product-owner">
                      By: {item.owner?.firstName} {item.owner?.lastName}
                    </div>
                    <button className="product-action-btn">
                      {item.pointsValue} Points - View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {featuredItems.length === 0 && allItems.length === 0 && (
          <section className="empty-state">
            <h2>No Items Available</h2>
            <p>Be the first to list an item!</p>
            <button className="cta-button">List Your First Item</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
