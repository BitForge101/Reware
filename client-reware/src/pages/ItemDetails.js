import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ItemDetails.css';

const ItemDetails = () => {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);

    // Mock data - in real app, this would come from API
    const mockItems = {
        1: {
            id: 1,
            name: 'Elegant Designer Blazer',
            description: 'Beautiful designer blazer in excellent condition. Perfect for professional settings or elevated casual looks. Features classic tailoring with modern fit. Made from high-quality wool blend fabric with silk lining. This piece has been carefully maintained and shows minimal signs of wear.',
            category: 'Blazers',
            size: 'M',
            brand: 'Hugo Boss',
            condition: 'Excellent',
            estimatedValue: 350,
            pointsRequired: 75,
            isAvailable: true,
            images: [
                '/images/blazer.jpeg',
                '/images/suit.jpg',
                '/images/shirt.jpeg',
                '/images/dress.jpeg'
            ],
            uploader: {
                name: 'Sarah Johnson',
                rating: 4.8,
                totalSwaps: 23,
                joinDate: '2023-06-15',
                avatar: 'SJ',
                verified: true
            },
            uploadDate: '2024-01-15',
            views: 156,
            likes: 34,
            tags: ['Professional', 'Designer', 'Business', 'Wool']
        },
        2: {
            id: 2,
            name: 'Summer Floral Dress',
            description: 'Gorgeous summer dress perfect for warm weather occasions. Features beautiful floral print and comfortable flowing fabric. Excellent for both casual outings and semi-formal events. Well-maintained with vibrant colors.',
            category: 'Dresses',
            size: 'S',
            brand: 'Zara',
            condition: 'Like New',
            estimatedValue: 65,
            pointsRequired: 35,
            isAvailable: true,
            images: [
                '/images/dress.jpeg',
                '/images/wo-dress.jpg',
                '/images/night.jpeg',
                '/images/frok.jpeg'
            ],
            uploader: {
                name: 'Emma Wilson',
                rating: 4.9,
                totalSwaps: 31,
                joinDate: '2023-03-20',
                avatar: 'EW',
                verified: true
            },
            uploadDate: '2024-01-20',
            views: 89,
            likes: 22,
            tags: ['Summer', 'Floral', 'Casual', 'Comfortable']
        }
    };

    const mockItem = mockItems[itemId] || mockItems[1];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setItem(mockItem);
            setLoading(false);
        }, 500);

        // Get user points from localStorage or API
        setUserPoints(120);
    }, [itemId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSwapRequest = () => {
        setShowSwapModal(true);
    };

    const handleRedeemPoints = () => {
        if (userPoints >= item.pointsRequired) {
            setShowPointsModal(true);
        } else {
            alert(`You need ${item.pointsRequired - userPoints} more points to redeem this item.`);
        }
    };

    const handleContactUploader = () => {
        // Navigate to chat or contact page
        alert('Contact feature coming soon!');
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? item.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === item.images.length - 1 ? 0 : prev + 1
        );
    };

    const handleImageSelect = (index) => {
        setCurrentImageIndex(index);
    };

    const confirmSwapRequest = () => {
        setShowSwapModal(false);
        alert('Swap request sent successfully!');
        navigate('/user-dashboard');
    };

    const confirmPointsRedemption = () => {
        setShowPointsModal(false);
        alert('Item redeemed successfully!');
        navigate('/user-dashboard');
    };

    if (loading) {
        return (
            <div className="item-details-loading">
                <div className="spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="item-details-error">
                <h2>Item not found</h2>
                <button onClick={handleBack} className="back-button">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="item-details-container">
            {/* Header */}
            <div className="item-details-header">
                <button className="back-button" onClick={handleBack}>
                    ← Back
                </button>
                <h1>Product Detail Page</h1>
                <div className="header-placeholder"></div>
            </div>

            {/* Main Content */}
            <div className="item-details-content">
                {/* Main Layout - Two Column */}
                <div className="main-details-grid">
                    {/* Left Column - Image Gallery */}
                    <div className="image-gallery-section">
                        <div className="main-image-container">
                            {item.images && item.images.length > 0 ? (
                                <>
                                    <img
                                        src={item.images[currentImageIndex]}
                                        alt={item.name}
                                        className="main-image"
                                    />
                                    {item.images.length > 1 && (
                                        <>
                                            <button
                                                className="image-nav prev"
                                                onClick={handlePreviousImage}
                                            >
                                                &#8249;
                                            </button>
                                            <button
                                                className="image-nav next"
                                                onClick={handleNextImage}
                                            >
                                                &#8250;
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="add-images-placeholder">
                                    <span className="placeholder-icon">📷</span>
                                    <p>Add Images</p>
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        {item.images && item.images.length > 1 && (
                            <div className="image-thumbnails">
                                {item.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${item.name} ${index + 1}`}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => handleImageSelect(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Information */}
                    <div className="product-info-section">
                        {/* Availability Status */}
                        <div className="availability-status">
                            <button className={`availability-btn ${item.isAvailable ? 'available' : 'unavailable'}`}>
                                {item.isAvailable ? 'Available/Swap' : 'Currently Unavailable'}
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className={`product-description-box ${item ? 'has-content' : ''}`}>
                            <h3>Add Product Description</h3>
                            <div className="description-lines">
                                <div className="description-line full"></div>
                                <div className="description-line full"></div>
                                <div className="description-line full"></div>
                                <div className="description-line full"></div>
                                <div className="description-line medium"></div>
                                <div className="description-line full"></div>
                                <div className="description-line full"></div>
                                <div className="description-line short"></div>
                            </div>

                            {/* Actual Description Content */}
                            {item && (
                                <div className="actual-description">
                                    <p><strong>{item.name}</strong></p>
                                    <p className="product-category">{item.category} • {item.brand} • Size {item.size}</p>
                                    <p className="product-condition">Condition: {item.condition}</p>
                                    <p className="product-value">Estimated Value: ${item.estimatedValue}</p>
                                    <p className="product-points">Points Required: {item.pointsRequired} points</p>
                                    <div className="description-text">
                                        <p>{item.description}</p>
                                    </div>
                                    {item.tags && (
                                        <div className="product-tags">
                                            {item.tags.map((tag, index) => (
                                                <span key={index} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {item.isAvailable && (
                            <div className="action-buttons">
                                <button
                                    className="action-btn primary swap-btn"
                                    onClick={handleSwapRequest}
                                >
                                    Request Swap
                                </button>
                                <button
                                    className={`action-btn secondary points-btn ${userPoints < item.pointsRequired ? 'disabled' : ''}`}
                                    onClick={handleRedeemPoints}
                                    disabled={userPoints < item.pointsRequired}
                                >
                                    Redeem via Points
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Previous Listings Section - Matching Wireframe */}
                <div className="previous-listings-section">
                    <h3>Previous Listings:</h3>
                    <div className="previous-listings-grid">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="listing-preview">
                                <div className="listing-image-placeholder">
                                    <span className="placeholder-icon">📷</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Swap Modal */}
            {showSwapModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Request Swap</h3>
                        <p>Send a swap request for "{item.name}" to {item.uploader.name}?</p>
                        <p className="modal-note">You'll be able to select items from your collection in the next step.</p>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowSwapModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={confirmSwapRequest}
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Points Modal */}
            {showPointsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Redeem with Points</h3>
                        <p>Redeem "{item.name}" for {item.pointsRequired} points?</p>
                        <div className="points-info">
                            <span>Your current points: {userPoints}</span>
                            <span>After redemption: {userPoints - item.pointsRequired}</span>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowPointsModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={confirmPointsRedemption}
                            >
                                Redeem Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
