import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard-clean.css';
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

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
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
        console.log('Profile response:', data);
        
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.clear();
          navigate('/login');
        }
      } else {
        console.error('Profile fetch failed:', response.status);
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
      // Mock featured items with real images
      const mockFeaturedItems = [
        {
          id: 1,
          name: 'Elegant Blazer',
          category: 'Blazers',
          price: 89,
          image: blazer,
          description: 'Professional blazer perfect for business meetings'
        },
        {
          id: 2,
          name: 'Summer Dress',
          category: 'Dresses',
          price: 65,
          image: dress,
          description: 'Light and comfortable dress for summer occasions'
        },
        {
          id: 3,
          name: 'Classic Shirt',
          category: 'Shirts',
          price: 45,
          image: shirt,
          description: 'Versatile shirt suitable for any occasion'
        },
        {
          id: 4,
          name: 'Business Suit',
          category: 'Suits',
          price: 220,
          image: suit,
          description: 'Complete business suit with jacket and trousers'
        }
      ];

      // Mock categories
      const mockCategories = [
        { name: 'Blazers', count: 15, image: blazer },
        { name: 'Dresses', count: 28, image: dress },
        { name: 'Shirts', count: 22, image: shirt },
        { name: 'Suits', count: 12, image: suit },
        { name: 'T-Shirts', count: 35, image: tshirt },
        { name: 'Pants', count: 18, image: pant },
        { name: 'Night Wear', count: 8, image: night },
        { name: 'Tops', count: 25, image: top }
      ];

      // Extended items list
      const mockAllItems = [
        ...mockFeaturedItems,
        {
          id: 5,
          name: 'Casual T-Shirt',
          category: 'T-Shirts',
          price: 25,
          image: tshirt,
          description: 'Comfortable cotton t-shirt for daily wear'
        },
        {
          id: 6,
          name: 'Formal Pants',
          category: 'Pants',
          price: 55,
          image: pant,
          description: 'Elegant formal pants for professional look'
        },
        {
          id: 7,
          name: 'Night Dress',
          category: 'Night Wear',
          price: 35,
          image: night,
          description: 'Comfortable sleepwear for peaceful nights'
        },
        {
          id: 8,
          name: 'Trendy Top',
          category: 'Tops',
          price: 40,
          image: top,
          description: 'Fashionable top perfect for casual outings'
        }
      ];

      setFeaturedItems(mockFeaturedItems);
      setCategories(mockCategories);
      setAllItems(mockAllItems);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleUserGreetingClick = () => {
    navigate('/user-dashboard');
  };

  const handleDebugDatabase = () => {
    console.log('Debug: Current user data:', user);
    console.log('Debug: Featured items:', featuredItems);
    console.log('Debug: Categories:', categories);
    console.log('Debug: All items:', allItems);
    alert('Debug information logged to console. Check browser developer tools.');
  };

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = allItems;
    
    if (filterCategory !== 'all') {
      filtered = allItems.filter(item => item.category === filterCategory);
    }
    
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your personalized dashboard...</p>
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

  const filteredItems = getFilteredAndSortedItems();

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      {/* Floating Background Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Enhanced Header */}
      <header className={`dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="dashboard-nav">
          <div className="nav-left">
            <h1 className="dashboard-title">
              <span className="title-icon">🌟</span>
              Reware Dashboard
              <div className="title-glow"></div>
            </h1>
          </div>
          
          <div className="nav-center">
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">👕</div>
                <div className="stat-value">{allItems.length}</div>
                <div className="stat-label">Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{featuredItems.length}</div>
                <div className="stat-label">Featured</div>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.firstName?.[0] || 'U'}
              </div>
              <span 
                className="clickable-greeting" 
                onClick={handleUserGreetingClick}
                title="Go to User Dashboard"
              >
                Welcome back, {user?.firstName || 'User'}!
              </span>
            </div>
            <button className="debug-button" onClick={handleDebugDatabase}>
              🔍 Debug
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-content">
        {/* Search Section with Enhanced UI */}
        <section className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for items, categories, or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </section>

        {/* Enhanced Search Filters */}
        <section className="search-filters glass">
          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select 
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                📊 Grid
              </button>
              <button 
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
              <button 
                className={`view-button ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
              >
                🃏 Cards
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Carousel for Featured Items */}
        <section className="carousel-container glass">
          <div className="carousel-header">
            <h2 className="carousel-title gradient-text">✨ Featured Items</h2>
            <div className="carousel-nav">
              <button className="nav-button" onClick={prevSlide}>
                ←
              </button>
              <button className="nav-button" onClick={nextSlide}>
                →
              </button>
            </div>
          </div>
          
          <div className="carousel-track" style={{
            transform: `translateX(-${currentSlide * 320}px)`
          }}>
            {featuredItems.map((item) => (
              <div key={item.id} className="carousel-slide">
                <div className="featured-item glow-on-hover">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="featured-image"
                  />
                  <div className="featured-info">
                    <span className="category">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p className="price">${item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section className="categories-section">
          <h2 className="gradient-text">🏷️ Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.name} className="category-card glow-on-hover">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-image"
                />
                <div className="category-content">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Products Grid */}
        <section className="products-container">
          <h2 className="gradient-text">🛍️ All Items</h2>
          <div className={`products-grid ${viewMode}-view`}>
            {filteredItems.map((item) => (
              <div key={item.id} className="product-card">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="product-image"
                />
                <div className="product-info">
                  <h4 className="product-name">{item.name}</h4>
                  <span className="product-category">{item.category}</span>
                  <div className="product-stats">
                    <span className="product-rating">⭐⭐⭐⭐⭐</span>
                    <span className="product-price">${item.price}</span>
                  </div>
                  <p className="product-description">{item.description}</p>
                  <div className="product-actions">
                    <button className="action-button">💝 Add to Wishlist</button>
                    <button className="action-button primary">🛒 Buy Now</button>
                  </div>
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
