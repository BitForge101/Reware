import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <nav className="home-nav">
          <div className="logo-section">
            <h1 className="logo-text">ReWear</h1>
            <span className="logo-tagline">Sustainable Fashion Exchange</span>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Give Your Clothes a <span className="highlight">Second Life</span>
          </h1>
          <p className="hero-subtitle">
            Join the sustainable fashion revolution. Swap, trade, and discover amazing pre-loved clothing while earning points and helping the planet.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="cta-btn primary">
              Start Swapping
            </Link>
            <Link to="/login" className="cta-btn secondary">
              Browse Items
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="clothing-showcase">
              <div className="clothing-item">👕</div>
              <div className="clothing-item">👗</div>
              <div className="clothing-item">👔</div>
              <div className="clothing-item">👖</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How ReWear Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>List an Item</h3>
              <p>Upload photos and details of clothes you no longer wear. Set your preferred swap terms or point value.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Browse Items</h3>
              <p>Discover amazing pre-loved clothing from our community. Filter by size, style, brand, and location.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Start Swapping</h3>
              <p>Request swaps with other users or redeem items using your earned points. Chat and negotiate directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Why Choose ReWear?</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🌱</div>
                  <div>
                    <h4>Eco-Friendly</h4>
                    <p>Reduce textile waste and promote sustainable fashion practices</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <div>
                    <h4>Save Money</h4>
                    <p>Get designer clothes at a fraction of the original price</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✨</div>
                  <div>
                    <h4>Unique Finds</h4>
                    <p>Discover one-of-a-kind pieces and vintage treasures</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🏆</div>
                  <div>
                    <h4>Earn Points</h4>
                    <p>Get rewarded for every successful swap and listing</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="stats-card">
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Items Swapped</div>
                </div>
                <div className="stat">
                  <div className="stat-number">2M+</div>
                  <div className="stat-label">CO₂ Saved (kg)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Sustainable Fashion Journey?</h2>
            <p>Join thousands of fashion-conscious users who are making a difference</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn primary large">
                Create Free Account
              </Link>
              <Link to="/login" className="cta-btn secondary large">
                I Already Have an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ReWear</h3>
              <p>Making fashion sustainable, one swap at a time.</p>
            </div>
            <div className="footer-section">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/safety">Safety</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
