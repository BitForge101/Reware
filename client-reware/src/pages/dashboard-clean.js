import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard.css';
import blazer from '../images/blazer.jpeg';
import dress from '../images/dress.jpeg'
import shirt from '../images/shirt.jpeg';
import suit from '../images/suit.jpg';
import tshirt from '../images/t-shirt.jpeg';
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
    const initializeDashboard = async () => {
      await checkAuthentication();
      await fetchDashboardData();
    };

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
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Sample data for demonstration when backend data is not available
  const sampleCategories = [
    'Shirts', 'Dresses', 'Pants', 'Blazers', 'T-Shirts', 'Suits'
  ];

  const sampleProducts = [
    { id: 1, name: 'Elegant Blazer', image: blazer, category: 'Blazers' },
    { id: 2, name: 'Summer Dress', image: dress, category: 'Dresses' },
    { id: 3, name: 'Casual Shirt', image: shirt, category: 'Shirts' },
    { id: 4, name: 'Business Suit', image: suit, category: 'Suits' },
    { id: 5, name: 'Cotton T-Shirt', image: tshirt, category: 'T-Shirts' },
    { id: 6, name: 'Formal Pants', image: pant, category: 'Pants' },
    { id: 7, name: 'Night Dress', image: night, category: 'Dresses' },
    { id: 8, name: 'Women\'s Top', image: top, category: 'Shirts' }
  ];

  // Use backend data if available, otherwise fall back to sample data
  const displayCategories = categories.length > 0 ? categories : sampleCategories;
  const displayProducts = allItems.length > 0 ? allItems : sampleProducts;
  const displayFeatured = featuredItems.length > 0 ? featuredItems : sampleProducts.slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">ReWear</h1>
          <div className="header-actions">
            <span className="user-greeting">
              Welcome back, {user?.firstName || 'User'}!
            </span>
            <button onClick={showLocalStorageData} className="debug-button">
              Debug Info
            </button>
            <button onClick={handleLogout} className="logout-button">
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
              🔍 Search
            </button>
          </form>
        </section>

        {/* Featured Section */}
        <section className="featured-section">
          <h2>Featured Items</h2>
          <div className="featured-grid">
            {displayFeatured.map((item, index) => (
              <div
                key={item.id || index}
                className="featured-item"
                onClick={() => handleItemClick(item.id || index)}
              >
                <img
                  src={item.images ? getImageUrl(item) : item.image}
                  alt={item.name}
                  className="featured-image"
                />
                <div className="featured-info">
                  <h3>{item.name}</h3>
                  <p className="category">{item.category}</p>
                  {item.price && <p className="price">${item.price}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {displayCategories.map((category, index) => (
              <button
                key={category.name || category}
                className="category-card"
                onClick={() => handleCategoryClick(category.name || category)}
              >
                <span className="category-name">{category.name || category}</span>
                {category.count && <span className="category-count">({category.count} items)</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Recent Items Section */}
        <section className="recent-items-section">
          <h2>Recent Items</h2>
          <div className="products-grid">
            {displayProducts.map((item, index) => (
              <div
                key={item.id || index}
                className="product-card"
                onClick={() => handleItemClick(item.id || index)}
              >
                <img
                  src={item.images ? getImageUrl(item) : item.image}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h4>{item.name}</h4>
                  <p className="product-category">{item.category}</p>
                  {item.price && <p className="product-price">${item.price}</p>}
                  {item.description && <p className="product-description">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
