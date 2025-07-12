import React from 'react';
import './dashboard.css';

const UserDashboard = () => {
    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">User Dashboard</h2>
            <div className="dashboard-main">
                <div className="dashboard-profile">
                    <div className="profile-pic" />
                    <div className="profile-info">
                        <div className="info-row">
                            <div className="info-box" />
                            <div className="info-box" />
                        </div>
                        <div className="info-row">
                            <div className="info-box" />
                            <div className="info-box" />
                        </div>
                        <div className="profile-details" />
                    </div>
                </div>
            </div>
            <div className="dashboard-listings">
                <h3>My Listings</h3>
                <div className="listings-row">
                    <div className="listing-card" />
                    <div className="listing-card" />
                    <div className="listing-card" />
                    <div className="listing-card" />
                </div>
            </div>
            <div className="dashboard-purchases">
                <h3>My Purchases</h3>
                <div className="purchases-row">
                    <div className="purchase-card" />
                    <div className="purchase-card" />
                    <div className="purchase-card" />
                    <div className="purchase-card" />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
