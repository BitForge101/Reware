import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUpload from '../components/PhotoUpload';
import ItemForm from '../components/ItemForm';
import './adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    const initializeAdmin = async () => {
      await checkAdminAuthentication();
      await fetchAdminData();
    };

    initializeAdmin();
  }, [navigate]);

  const checkAdminAuthentication = async () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userType = localStorage.getItem('userType');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    console.log('Admin dashboard auth check:', {
      hasToken: !!token,
      userData: userData,
      userType: userType,
      isAdmin: isAdmin,
      userRole: userData?.role
    });
    
    if (!token) {
      console.log('No token, redirecting to login');
      navigate('/login');
      return;
    }

    // Check if user is admin using unified logic
    const isAuthorizedAdmin = (
      userType === 'admin' ||
      isAdmin ||
      (userData && (userData.role === 'admin' || userData.role === 'superadmin'))
    );

    if (!isAuthorizedAdmin) {
      console.log('User not authorized as admin, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    console.log('Admin authentication successful');
    setUser(userData);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Sample data for demonstration when backend is not available
      const sampleUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: new Date() },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: new Date() },
        { _id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'user', status: 'suspended', createdAt: new Date() },
        { _id: '4', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com', role: 'admin', status: 'active', createdAt: new Date() },
        { _id: '5', firstName: 'Tom', lastName: 'Brown', email: 'tom@example.com', role: 'user', status: 'active', createdAt: new Date() }
      ];

      const sampleItems = [
        { _id: '1', name: 'Vintage Leather Jacket', category: 'Jackets', price: 89.99, status: 'active', images: [{ url: '/images/jacket.jpg' }] },
        { _id: '2', name: 'Designer Handbag', category: 'Accessories', price: 150.00, status: 'active', images: [{ url: '/images/handbag.jpg' }] },
        { _id: '3', name: 'Classic Denim Jeans', category: 'Pants', price: 45.50, status: 'active', images: [{ url: '/images/jeans.jpg' }] },
        { _id: '4', name: 'Silk Evening Dress', category: 'Dresses', price: 120.00, status: 'inactive', images: [{ url: '/images/dress.jpg' }] },
        { _id: '5', name: 'Wool Winter Coat', category: 'Coats', price: 95.00, status: 'active', images: [{ url: '/images/coat.jpg' }] }
      ];

      const sampleOrders = [
        { _id: '1', customerName: 'John Doe', items: [{}, {}], total: 135.99, status: 'completed', createdAt: new Date() },
        { _id: '2', customerName: 'Jane Smith', items: [{}], total: 89.99, status: 'processing', createdAt: new Date() },
        { _id: '3', customerName: 'Mike Johnson', items: [{}, {}, {}], total: 201.50, status: 'pending', createdAt: new Date() },
        { _id: '4', customerName: 'Sarah Wilson', items: [{}], total: 45.50, status: 'cancelled', createdAt: new Date() }
      ];

      const sampleCategories = [
        { _id: '1', name: 'Dresses', description: 'Elegant dresses for all occasions', itemCount: 45 },
        { _id: '2', name: 'Shirts', description: 'Casual and formal shirts', itemCount: 78 },
        { _id: '3', name: 'Pants', description: 'Comfortable pants and trousers', itemCount: 52 },
        { _id: '4', name: 'Accessories', description: 'Bags, jewelry, and more', itemCount: 89 },
        { _id: '5', name: 'Jackets', description: 'Stylish jackets and coats', itemCount: 34 },
        { _id: '6', name: 'Shoes', description: 'Footwear for every style', itemCount: 67 }
      ];

      // Try to fetch real data, fallback to sample data
      try {
        // Fetch admin statistics
        const statsResponse = await fetch(`${API_BASE}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }

        // Fetch users, items, orders, categories
        const [usersRes, itemsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE}/admin/items`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE}/admin/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE}/admin/categories`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success) setUsers(usersData.data);
          else setUsers(sampleUsers);
        } else {
          setUsers(sampleUsers);
        }

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          if (itemsData.success) setItems(itemsData.data);
          else setItems(sampleItems);
        } else {
          setItems(sampleItems);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success) setOrders(ordersData.data);
          else setOrders(sampleOrders);
        } else {
          setOrders(sampleOrders);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.success) setCategories(categoriesData.data);
          else setCategories(sampleCategories);
        } else {
          setCategories(sampleCategories);
        }

      } catch (fetchError) {
        // Use sample data when backend is not available
        console.log('Backend not available, using sample data');
        setUsers(sampleUsers);
        setItems(sampleItems);
        setOrders(sampleOrders);
        setCategories(sampleCategories);
      }

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setError('Failed to load admin data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchAdminData(); // Refresh data
        alert(`User ${action} successfully!`);
      }
    } catch (error) {
      console.error('User action failed:', error);
      alert('Action failed. Please try again.');
    }
  };

  const handleItemAction = async (itemId, action) => {
    try {
      const response = await fetch(`${API_BASE}/admin/items/${itemId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchAdminData(); // Refresh data
        alert(`Item ${action} successfully!`);
      }
    } catch (error) {
      console.error('Item action failed:', error);
      alert('Action failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers || 150}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card items">
          <div className="stat-icon">👕</div>
          <div className="stat-content">
            <h3>{stats.totalItems || 1250}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders || 320}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalRevenue || 45680}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-section">
          <h3>Recent Users</h3>
          <div className="activity-list">
            {users.slice(0, 5).map((user, index) => (
              <div key={user._id || index} className="activity-item">
                <div className="user-avatar">{user.firstName?.[0] || 'U'}</div>
                <div className="activity-details">
                  <p className="activity-title">{user.firstName} {user.lastName}</p>
                  <p className="activity-subtitle">{user.email}</p>
                </div>
                <span className="activity-time">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Items</h3>
          <div className="activity-list">
            {items.slice(0, 5).map((item, index) => (
              <div key={item._id || index} className="activity-item">
                <div className="item-image">
                  <img src={item.images?.[0]?.url || '/images/default-item.jpg'} alt={item.name} />
                </div>
                <div className="activity-details">
                  <p className="activity-title">{item.name}</p>
                  <p className="activity-subtitle">{item.category}</p>
                </div>
                <span className="activity-price">${item.price || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="btn btn-primary">Add New User</button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || index}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.firstName?.[0] || 'U'}</div>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role || 'user'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status || 'active'}`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-small btn-secondary"
                      onClick={() => handleUserAction(user._id, 'suspend')}
                    >
                      Suspend
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleUserAction(user._id, 'delete')}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Item management functions
  const handleAddNewItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setItems(items.filter(item => item._id !== itemId));
        alert('Item deleted successfully');
      } else {
        alert('Failed to delete item: ' + data.message);
      }
    } catch (error) {
      console.error('Delete item error:', error);
      alert('Failed to delete item');
    }
  };

  const handleToggleItemStatus = async (itemId) => {
    try {
      const item = items.find(i => i._id === itemId);
      const newStatus = item.status === 'active' ? 'inactive' : 'active';

      const response = await fetch(`${API_BASE}/admin/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        setItems(items.map(item => 
          item._id === itemId ? { ...item, status: newStatus } : item
        ));
      } else {
        alert('Failed to update item status: ' + data.message);
      }
    } catch (error) {
      console.error('Toggle item status error:', error);
      alert('Failed to update item status');
    }
  };

  const handleItemSave = (savedItem) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item._id === savedItem._id ? savedItem : item
      ));
    } else {
      // Add new item
      setItems([savedItem, ...items]);
    }
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleItemFormCancel = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const renderItems = () => {
    if (showItemForm) {
      return (
        <ItemForm
          item={editingItem}
          onSave={handleItemSave}
          onCancel={handleItemFormCancel}
        />
      );
    }

    return (
      <div className="admin-items">
        <div className="section-header">
          <h2>Item Management</h2>
          <button className="btn btn-primary" onClick={handleAddNewItem}>
            Add New Item
          </button>
        </div>
        <div className="items-grid">
          {items.map((item, index) => (
            <div key={item._id || index} className="item-card">
              <div className="item-image">
                <img src={item.images?.[0]?.url || '/images/default-item.jpg'} alt={item.name} />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="item-category">{item.category}</p>
                <p className="item-price">${item.price || 'N/A'}</p>
                <p className="item-status">
                  Status: <span className={`status-badge ${item.status || 'active'}`}>
                    {item.status || 'active'}
                  </span>
                </p>
              </div>
              <div className="item-actions">
                <button 
                  className="btn btn-small btn-secondary"
                  onClick={() => handleEditItem(item)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-small btn-warning"
                  onClick={() => handleToggleItemStatus(item._id)}
                >
                  Toggle
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="admin-orders">
      <div className="section-header">
        <h2>Order Management</h2>
        <div className="order-filters">
          <select className="filter-select">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>#{order._id?.slice(-6) || `ORD${index + 1}`}</td>
                <td>{order.customerName || 'John Doe'}</td>
                <td>{order.items?.length || 2} items</td>
                <td>${order.total || 89.99}</td>
                <td>
                  <span className={`status-badge ${order.status || 'pending'}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-small btn-primary">View</button>
                    <button className="btn btn-small btn-secondary">Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="admin-categories">
      <div className="section-header">
        <h2>Category Management</h2>
        <button className="btn btn-primary">Add New Category</button>
      </div>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={category._id || index} className="category-card">
            <div className="category-info">
              <h4>{category.name || `Category ${index + 1}`}</h4>
              <p>{category.description || 'No description available'}</p>
              <p className="category-stats">
                Items: {category.itemCount || Math.floor(Math.random() * 100)}
              </p>
            </div>
            <div className="category-actions">
              <button className="btn btn-small btn-secondary">Edit</button>
              <button className="btn btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-settings">
      <div className="section-header">
        <h2>System Settings</h2>
      </div>
      <div className="settings-sections">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>Site Name</label>
            <input type="text" defaultValue="ReWear" />
          </div>
          <div className="setting-item">
            <label>Site Description</label>
            <textarea defaultValue="Your premier destination for sustainable fashion"></textarea>
          </div>
          <div className="setting-item">
            <label>Contact Email</label>
            <input type="email" defaultValue="admin@rewear.com" />
          </div>
        </div>

        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Enable Two-Factor Authentication
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Maintenance Mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Payment Settings</h3>
          <div className="setting-item">
            <label>Payment Gateway</label>
            <select>
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Square</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Currency</label>
            <select>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>
      </div>
      <div className="settings-actions">
        <button className="btn btn-primary">Save Settings</button>
        <button className="btn btn-secondary">Reset to Default</button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1>ReWear Admin</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            <span className="nav-icon">👕</span>
            Items
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">📦</span>
            Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span className="nav-icon">🏷️</span>
            Categories
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">{user?.firstName?.[0] || 'A'}</div>
            <div className="admin-info">
              <p>{user?.firstName} {user?.lastName}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'items' && 'Item Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'categories' && 'Category Management'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            <div className="header-actions">
              <button className="btn btn-secondary">Export Data</button>
              <button className="btn btn-primary">Quick Action</button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'items' && renderItems()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
