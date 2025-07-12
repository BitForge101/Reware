import React, { useEffect, useState, useRef } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, card
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dashboardRef = useRef(null);

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    const initializeDashboard = async () => {
      await checkAuthentication();
      await fetchDashboardData();
    };

    initializeDashboard();

    // Enhanced scroll and mouse tracking
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Auto-rotate featured items
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(slideInterval);
    };
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
    // Add ripple effect animation
    const clickElement = document.elementFromPoint(mousePosition.x, mousePosition.y);
    if (clickElement) {
      clickElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        clickElement.style.transform = 'scale(1)';
      }, 150);
    }
    // Navigate to item detail page
  };

  const handleQuickView = (item, e) => {
    e.stopPropagation();
    // Quick view modal functionality
    alert(`Quick View: ${item.name}\nCategory: ${item.category}\nPrice: $${item.price || 'N/A'}`);
  };

  const handleAddToWishlist = (item, e) => {
    e.stopPropagation();
    // Add to wishlist functionality
    alert(`Added ${item.name} to wishlist!`);
  };

  const filterAndSortProducts = (products) => {
    let filtered = products;
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }
    
    return filtered;
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
    { 
      id: 1, 
      name: 'Elegant Blazer', 
      image: blazer, 
      category: 'Blazers', 
      price: 89, 
      views: 124, 
      likes: 23,
      description: 'Premium quality blazer perfect for business meetings',
      tags: ['formal', 'premium', 'business'],
      rating: 4.8,
      reviews: 15
    },
    { 
      id: 2, 
      name: 'Summer Dress', 
      image: dress, 
      category: 'Dresses', 
      price: 65, 
      views: 98, 
      likes: 31,
      description: 'Light and breezy summer dress for casual outings',
      tags: ['casual', 'summer', 'comfortable'],
      rating: 4.6,
      reviews: 22
    },
    { 
      id: 3, 
      name: 'Casual Shirt', 
      image: shirt, 
      category: 'Shirts', 
      price: 45, 
      views: 76, 
      likes: 18,
      description: 'Versatile casual shirt for everyday wear',
      tags: ['casual', 'everyday', 'versatile'],
      rating: 4.4,
      reviews: 12
    },
    { 
      id: 4, 
      name: 'Business Suit', 
      image: suit, 
      category: 'Suits', 
      price: 199, 
      views: 156, 
      likes: 42,
      description: 'Professional business suit for important occasions',
      tags: ['formal', 'business', 'professional'],
      rating: 4.9,
      reviews: 28
    },
    { 
      id: 5, 
      name: 'Cotton T-Shirt', 
      image: tshirt, 
      category: 'T-Shirts', 
      price: 25, 
      views: 89, 
      likes: 25,
      description: '100% cotton comfortable t-shirt',
      tags: ['casual', 'cotton', 'comfortable'],
      rating: 4.3,
      reviews: 19
    },
    { 
      id: 6, 
      name: 'Formal Pants', 
      image: pant, 
      category: 'Pants', 
      price: 55, 
      views: 67, 
      likes: 14,
      description: 'Classic formal pants for office wear',
      tags: ['formal', 'office', 'classic'],
      rating: 4.5,
      reviews: 16
    },
    { 
      id: 7, 
      name: 'Night Dress', 
      image: night, 
      category: 'Dresses', 
      price: 78, 
      views: 112, 
      likes: 29,
      description: 'Elegant evening dress for special occasions',
      tags: ['evening', 'elegant', 'special'],
      rating: 4.7,
      reviews: 21
    },
    { 
      id: 8, 
      name: 'Women\'s Top', 
      image: top, 
      category: 'Shirts', 
      price: 38, 
      views: 93, 
      likes: 20,
      description: 'Stylish women\'s top for modern look',
      tags: ['stylish', 'modern', 'trendy'],
      rating: 4.4,
      reviews: 17
    }
  ];

  // Use backend data if available, otherwise fall back to sample data
  const displayCategories = categories.length > 0 ? categories : sampleCategories;
  const displayProducts = allItems.length > 0 ? allItems : sampleProducts;
  const displayFeatured = featuredItems.length > 0 ? featuredItems : sampleProducts.slice(0, 3);
  const filteredProducts = filterAndSortProducts(displayProducts);

  return (
    <div 
      className="dashboard-container" 
      ref={dashboardRef}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      }}
    >
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Enhanced Header */}
      <header className={`dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="dashboard-nav">
          <div className="nav-left">
            <h1 className="dashboard-title">
              <span className="title-icon">👕</span>
              ReWear
              <span className="title-glow"></span>
            </h1>
          </div>
          
          <div className="nav-center">
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <span className="stat-value">{displayProducts.length}</span>
                <span className="stat-label">Items</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-value">1.2k</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔄</span>
                <span className="stat-value">350</span>
                <span className="stat-label">Swaps</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.firstName?.[0] || 'U'}
              </div>
              <span 
                className="user-greeting clickable-greeting"
                onClick={() => navigate('/user-dashboard')}
                title="Go to User Dashboard"
              >
                Welcome, {user?.firstName || 'User'}!
              </span>
            </div>
            <button onClick={showLocalStorageData} className="debug-button">
              🔍 Debug
            </button>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Enhanced Search Section */}
        <section className="search-section">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover amazing fashion items..."
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>
            
            {/* Advanced Filters */}
            <div className="filter-controls">
              <div className="filter-group">
                <label>Category:</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {displayCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              
              <div className="view-mode-controls">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  ⊞
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  ☰
                </button>
                <button 
                  className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Card View"
                >
                  ⊡
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Section */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">✨ Featured Items</h2>
            <div className="slide-indicators">
              {[0, 1, 2].map(index => (
                <button
                  key={index}
                  className={`slide-indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="featured-carousel">
            <div 
              className="featured-grid"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {displayFeatured.map((item, index) => (
                <div
                  key={item.id || index}
                  className="featured-item"
                  onClick={() => handleItemClick(item.id || index)}
                >
                  <div className="featured-image-wrapper">
                    <img
                      src={item.images ? getImageUrl(item) : item.image}
                      alt={item.name}
                      className="featured-image"
                    />
                    <div className="featured-overlay">
                      <button 
                        className="quick-action-btn"
                        onClick={(e) => handleQuickView(item, e)}
                      >
                        👁️ Quick View
                      </button>
                      <button 
                        className="quick-action-btn"
                        onClick={(e) => handleAddToWishlist(item, e)}
                      >
                        ❤️ Wishlist
                      </button>
                    </div>
                    {item.rating && (
                      <div className="rating-badge">
                        ⭐ {item.rating}
                      </div>
                    )}
                  </div>
                  <div className="featured-info">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    {item.price && <p className="price">${item.price}</p>}
                    {item.description && (
                      <p className="description">{item.description}</p>
                    )}
                    <div className="item-stats">
                      <span className="stat">👁️ {item.views || 0}</span>
                      <span className="stat">❤️ {item.likes || 0}</span>
                      <span className="stat">💬 {item.reviews || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section className="categories-section">
          <h2 className="section-title">🏷️ Shop by Category</h2>
          <div className="categories-grid">
            {displayCategories.map((category, index) => (
              <button
                key={category.name || category}
                className="category-card"
                onClick={() => handleCategoryClick(category.name || category)}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="category-icon">
                  {category === 'Shirts' && '👔'}
                  {category === 'Dresses' && '👗'}
                  {category === 'Pants' && '👖'}
                  {category === 'Blazers' && '🧥'}
                  {category === 'T-Shirts' && '👕'}
                  {category === 'Suits' && '🤵'}
                </div>
                <span className="category-name">{category.name || category}</span>
                {category.count && <span className="category-count">({category.count} items)</span>}
                <div className="category-glow"></div>
              </button>
            ))}
          </div>
        </section>

        {/* Enhanced Recent Items Section */}
        <section className="recent-items-section">
          <div className="section-header">
            <h2 className="section-title">🆕 Recent Items ({filteredProducts.length})</h2>
            <div className="section-actions">
              <button className="view-all-btn">View All →</button>
            </div>
          </div>
          
          <div className={`products-grid ${viewMode}-view`}>
            {filteredProducts.map((item, index) => (
              <div
                key={item.id || index}
                className="product-card"
                onClick={() => handleItemClick(item.id || index)}
                style={{ '--index': index }}
              >
                <div className="product-image-wrapper">
                  <img
                    src={item.images ? getImageUrl(item) : item.image}
                    alt={item.name}
                    className="product-image"
                  />
                  <div className="product-overlay">
                    <button 
                      className="overlay-btn quick-view"
                      onClick={(e) => handleQuickView(item, e)}
                      title="Quick View"
                    >
                      👁️
                    </button>
                    <button 
                      className="overlay-btn add-wishlist"
                      onClick={(e) => handleAddToWishlist(item, e)}
                      title="Add to Wishlist"
                    >
                      ❤️
                    </button>
                  </div>
                  
                  {/* Status badges */}
                  {item.tags && item.tags.includes('premium') && (
                    <div className="badge premium-badge">Premium</div>
                  )}
                  {item.views > 100 && (
                    <div className="badge trending-badge">🔥 Trending</div>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="product-header">
                    <h4 className="product-name">{item.name}</h4>
                    {item.rating && (
                      <div className="product-rating">
                        ⭐ {item.rating}
                      </div>
                    )}
                  </div>
                  
                  <p className="product-category">📂 {item.category}</p>
                  
                  {item.price && (
                    <div className="price-section">
                      <span className="product-price">${item.price}</span>
                      <span className="price-label">Best Price</span>
                    </div>
                  )}
                  
                  {item.description && (
                    <p className="product-description">{item.description.slice(0, 80)}...</p>
                  )}
                  
                  <div className="product-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{item.views || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{item.likes || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">{item.reviews || 0}</span>
                    </span>
                  </div>
                  
                  {item.tags && (
                    <div className="product-tags">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No items found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
