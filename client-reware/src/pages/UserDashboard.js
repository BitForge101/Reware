import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [purchases, setPurchases] = useState([]);

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
        // Mock data for listings and purchases
        // In a real app, you'd fetch this from your backend
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
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (!user) {
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

            {/* User Profile Section */}
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
                            <div className="info-item">
                                <span className="info-label">Member Since:</span>
                                <span className="info-value">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="profile-description">
                            <p>Welcome to your personal dashboard. Here you can manage your listings, view your purchases, and track your ReWear activity.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Listings Section */}
            <div className="listings-section">
                <h2 className="section-title">My Listings</h2>
                <div className="items-grid">
                    {listings.map((listing) => (
                        <div key={listing.id} className="item-card">
                            <div className="item-image-placeholder">
                                <span className="item-placeholder-text">Image</span>
                            </div>
                            <div className="item-info">
                                <h3 className="item-name">{listing.name}</h3>
                                <span className={`item-status ${listing.status.toLowerCase()}`}>
                                    {listing.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* My Purchases Section */}
            <div className="purchases-section">
                <h2 className="section-title">My Purchases</h2>
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
        </div>
    );
};

export default UserDashboard;
