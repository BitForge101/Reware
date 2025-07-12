import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [uploadedItems, setUploadedItems] = useState([]);
    const [ongoingSwaps, setOngoingSwaps] = useState([]);
    const [completedSwaps, setCompletedSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
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
                        setUser(data.user);
                        // Load user's listings and purchases here
                        loadUserData(data.user._id);
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

        checkAuthentication();
    }, [navigate]);

    const loadUserData = (userId) => {
        // Mock data for uploaded items
        setUploadedItems([
            {
                id: 1,
                name: 'Vintage Blazer',
                image: '/placeholder1.jpg',
                status: 'Active',
                views: 45,
                likes: 12,
                uploadDate: '2024-01-20',
                category: 'Blazers',
                price: 89
            },
            {
                id: 2,
                name: 'Summer Dress',
                image: '/placeholder2.jpg',
                status: 'Sold',
                views: 78,
                likes: 23,
                uploadDate: '2024-01-15',
                category: 'Dresses',
                price: 65
            },
            {
                id: 3,
                name: 'Casual Shirt',
                image: '/placeholder3.jpg',
                status: 'Active',
                views: 32,
                likes: 8,
                uploadDate: '2024-01-18',
                category: 'Shirts',
                price: 45
            },
            {
                id: 4,
                name: 'Business Suit',
                image: '/placeholder4.jpg',
                status: 'Pending',
                views: 91,
                likes: 34,
                uploadDate: '2024-01-12',
                category: 'Suits',
                price: 120
            }
        ]);

        // Mock data for ongoing swaps
        setOngoingSwaps([
            {
                id: 1,
                myItem: 'Vintage Blazer',
                theirItem: 'Designer Jeans',
                otherUser: 'Sarah M.',
                status: 'Pending Approval',
                initiatedDate: '2024-01-22',
                estimatedCompletion: '2024-01-30'
            },
            {
                id: 2,
                myItem: 'Summer Dress',
                theirItem: 'Leather Jacket',
                otherUser: 'Mike R.',
                status: 'In Transit',
                initiatedDate: '2024-01-18',
                estimatedCompletion: '2024-01-25'
            },
            {
                id: 3,
                myItem: 'Casual Shirt',
                theirItem: 'Winter Coat',
                otherUser: 'Emma L.',
                status: 'Awaiting Shipment',
                initiatedDate: '2024-01-20',
                estimatedCompletion: '2024-01-28'
            }
        ]);

        // Mock data for completed swaps
        setCompletedSwaps([
            {
                id: 1,
                myItem: 'Evening Gown',
                theirItem: 'Cocktail Dress',
                otherUser: 'Jennifer K.',
                completedDate: '2024-01-10',
                rating: 5,
                pointsEarned: 15
            },
            {
                id: 2,
                myItem: 'Sports Jacket',
                theirItem: 'Casual Blazer',
                otherUser: 'David H.',
                completedDate: '2024-01-05',
                rating: 4,
                pointsEarned: 12
            },
            {
                id: 3,
                myItem: 'Designer Handbag',
                theirItem: 'Vintage Purse',
                otherUser: 'Lisa T.',
                completedDate: '2023-12-28',
                rating: 5,
                pointsEarned: 20
            },
            {
                id: 4,
                myItem: 'Winter Boots',
                theirItem: 'Running Shoes',
                otherUser: 'Alex P.',
                completedDate: '2023-12-20',
                rating: 4,
                pointsEarned: 10
            }
        ]);

        // Update existing mock data
        setListings([
            { id: 1, name: 'Vintage Blazer', image: '/placeholder1.jpg', status: 'Active' },
            { id: 2, name: 'Summer Dress', image: '/placeholder2.jpg', status: 'Sold' },
            { id: 3, name: 'Casual Shirt', image: '/placeholder3.jpg', status: 'Active' },
            { id: 4, name: 'Business Suit', image: '/placeholder4.jpg', status: 'Active' }
        ]);

        setPurchases([
            { id: 1, name: 'Designer Jacket', image: '/placeholder5.jpg', purchaseDate: '2024-01-15' },
            { id: 2, name: 'Evening Gown', image: '/placeholder6.jpg', purchaseDate: '2024-01-10' },
            { id: 3, name: 'Casual Wear', image: '/placeholder7.jpg', purchaseDate: '2024-01-05' },
            { id: 4, name: 'Winter Coat', image: '/placeholder8.jpg', purchaseDate: '2024-01-01' }
        ]);

        setLoading(false);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleUploadItem = () => {
        // Navigate to upload item page
        navigate('/upload-item');
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return '#10B981';
            case 'sold': return '#6366F1';
            case 'pending': return '#F59E0B';
            case 'pending approval': return '#F59E0B';
            case 'in transit': return '#3B82F6';
            case 'awaiting shipment': return '#8B5CF6';
            case 'completed': return '#10B981';
            default: return '#6B7280';
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading || !user) {
        return (
            <div className="user-dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="user-dashboard-container">
            {/* Header with Back Button */}
            <div className="user-dashboard-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    ← Back to Dashboard
                </button>
                <h1 className="user-dashboard-title">User Dashboard</h1>
                <div className="header-placeholder"></div>
            </div>

            {/* User Profile Section with Points */}
            <div className="user-profile-section">
                <div className="profile-container">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{user.firstName} {user.lastName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Username:</span>
                                <span className="info-value">{user.username}</span>
                            </div>
                            <div className="info-item points-balance">
                                <span className="info-label">💎 Points Balance:</span>
                                <span className="info-value points-value">{user.points || 150}</span>
                            </div>
                        </div>
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{uploadedItems.length}</span>
                                <span className="stat-label">Items Uploaded</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{completedSwaps.length}</span>
                                <span className="stat-label">Swaps Completed</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{ongoingSwaps.length}</span>
                                <span className="stat-label">Active Swaps</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                <span className="stat-label">Member Since</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
                    onClick={() => setActiveTab('items')}
                >
                    👕 My Items
                </button>
                <button
                    className={`tab-button ${activeTab === 'swaps' ? 'active' : ''}`}
                    onClick={() => setActiveTab('swaps')}
                >
                    🔄 Swaps
                </button>
                <button
                    className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('purchases')}
                >
                    🛍️ Purchases
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        {/* Quick Stats Cards */}
                        <div className="stats-cards">
                            <div className="stats-card earnings">
                                <div className="stats-icon">💰</div>
                                <div className="stats-info">
                                    <h3>Total Earnings</h3>
                                    <p className="stats-value">
                                        {completedSwaps.reduce((total, swap) => total + swap.pointsEarned, 0)} Points
                                    </p>
                                </div>
                            </div>
                            <div className="stats-card views">
                                <div className="stats-icon">👁️</div>
                                <div className="stats-info">
                                    <h3>Total Views</h3>
                                    <p className="stats-value">
                                        {uploadedItems.reduce((total, item) => total + item.views, 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="stats-card likes">
                                <div className="stats-icon">❤️</div>
                                <div className="stats-info">
                                    <h3>Total Likes</h3>
                                    <p className="stats-value">
                                        {uploadedItems.reduce((total, item) => total + item.likes, 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="stats-card success-rate">
                                <div className="stats-icon">📈</div>
                                <div className="stats-info">
                                    <h3>Success Rate</h3>
                                    <p className="stats-value">
                                        {uploadedItems.length > 0 ? Math.round((uploadedItems.filter(item => item.status === 'Sold').length / uploadedItems.length) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon">📤</div>
                                    <div className="activity-details">
                                        <p><strong>Item Uploaded:</strong> Vintage Blazer</p>
                                        <span className="activity-date">2 days ago</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">🔄</div>
                                    <div className="activity-details">
                                        <p><strong>Swap Completed:</strong> Evening Gown ↔ Cocktail Dress</p>
                                        <span className="activity-date">1 week ago</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">💰</div>
                                    <div className="activity-details">
                                        <p><strong>Points Earned:</strong> +15 points from swap</p>
                                        <span className="activity-date">1 week ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'items' && (
                    <div className="items-content">
                        <div className="section-header">
                            <h2>My Uploaded Items</h2>
                            <button className="upload-button" onClick={handleUploadItem}>
                                + Upload New Item
                            </button>
                        </div>
                        <div className="items-grid">
                            {uploadedItems.map((item) => (
                                <div key={item.id} className="item-card detailed">
                                    <div className="item-image-placeholder">
                                        <span className="item-placeholder-text">Image</span>
                                    </div>
                                    <div className="item-info">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-category">{item.category}</p>
                                        <p className="item-price">${item.price}</p>
                                        <div className="item-stats">
                                            <span className="stat">👁️ {item.views}</span>
                                            <span className="stat">❤️ {item.likes}</span>
                                        </div>
                                        <span
                                            className="item-status"
                                            style={{ backgroundColor: getStatusColor(item.status) }}
                                        >
                                            {item.status}
                                        </span>
                                        <span className="upload-date">
                                            Uploaded: {new Date(item.uploadDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'swaps' && (
                    <div className="swaps-content">
                        {/* Ongoing Swaps */}
                        <div className="swaps-section">
                            <h2>Ongoing Swaps ({ongoingSwaps.length})</h2>
                            <div className="swaps-list">
                                {ongoingSwaps.map((swap) => (
                                    <div key={swap.id} className="swap-card ongoing">
                                        <div className="swap-items">
                                            <div className="swap-item my-item">
                                                <h4>My Item</h4>
                                                <p>{swap.myItem}</p>
                                            </div>
                                            <div className="swap-arrow">⇄</div>
                                            <div className="swap-item their-item">
                                                <h4>Their Item</h4>
                                                <p>{swap.theirItem}</p>
                                            </div>
                                        </div>
                                        <div className="swap-details">
                                            <p><strong>With:</strong> {swap.otherUser}</p>
                                            <p><strong>Status:</strong>
                                                <span
                                                    className="swap-status"
                                                    style={{ color: getStatusColor(swap.status) }}
                                                >
                                                    {swap.status}
                                                </span>
                                            </p>
                                            <p><strong>Initiated:</strong> {new Date(swap.initiatedDate).toLocaleDateString()}</p>
                                            <p><strong>Est. Completion:</strong> {new Date(swap.estimatedCompletion).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completed Swaps */}
                        <div className="swaps-section">
                            <h2>Completed Swaps ({completedSwaps.length})</h2>
                            <div className="swaps-list">
                                {completedSwaps.map((swap) => (
                                    <div key={swap.id} className="swap-card completed">
                                        <div className="swap-items">
                                            <div className="swap-item my-item">
                                                <h4>My Item</h4>
                                                <p>{swap.myItem}</p>
                                            </div>
                                            <div className="swap-arrow">⇄</div>
                                            <div className="swap-item their-item">
                                                <h4>Their Item</h4>
                                                <p>{swap.theirItem}</p>
                                            </div>
                                        </div>
                                        <div className="swap-details">
                                            <p><strong>With:</strong> {swap.otherUser}</p>
                                            <p><strong>Completed:</strong> {new Date(swap.completedDate).toLocaleDateString()}</p>
                                            <p><strong>Rating:</strong>
                                                <span className="rating">{renderStars(swap.rating)}</span>
                                            </p>
                                            <p><strong>Points Earned:</strong>
                                                <span className="points-earned">+{swap.pointsEarned}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'purchases' && (
                    <div className="purchases-content">
                        <h2>My Purchases</h2>
                        <div className="items-grid">
                            {purchases.map((purchase) => (
                                <div key={purchase.id} className="item-card">
                                    <div className="item-image-placeholder">
                                        <span className="item-placeholder-text">Image</span>
                                    </div>
                                    <div className="item-info">
                                        <h3 className="item-name">{purchase.name}</h3>
                                        <span className="purchase-date">
                                            Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
