const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const Admin = require('../models/admin');
const { authenticateToken } = require('../middleware/auth');

// Check if user is admin
const isAdmin = (req, res, next) => {
  // Check if user exists and has admin role or userType
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
  }
  
  const isAdminUser = req.user.userType === 'admin' || 
                      req.user.role === 'admin' || 
                      req.user.role === 'superadmin';
  
  if (!isAdminUser) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin rights required.'
    });
  }
  next();
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/items/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    
    // For now, return mock data for items and orders
    // You can implement these collections later
    const stats = {
      totalUsers,
      totalAdmins,
      totalItems: 1250, // Mock data
      totalOrders: 320, // Mock data
      totalRevenue: 45680, // Mock data
      activeUsers: await User.countDocuments({ status: 'active' }),
      pendingOrders: 25, // Mock data
      completedOrders: 295 // Mock data
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user status
router.patch('/users/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${status} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload item images
router.post('/items/upload', authenticateToken, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const imageUrls = req.files.map(file => ({
      url: `/uploads/items/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new item
router.post('/items', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      condition,
      size,
      brand,
      color,
      material,
      images,
      tags,
      status = 'active'
    } = req.body;

    // For now, return mock response
    // You can implement Item model later
    const mockItem = {
      _id: Date.now().toString(),
      name,
      description,
      category,
      price: parseFloat(price),
      condition,
      size,
      brand,
      color,
      material,
      images: images || [],
      tags: tags || [],
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item: mockItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all items
router.get('/items', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
    
    // Mock data for items
    const mockItems = [
      { _id: '1', name: 'Vintage Leather Jacket', category: 'Jackets', price: 89.99, status: 'active', images: [{ url: '/images/jacket.jpg' }] },
      { _id: '2', name: 'Designer Handbag', category: 'Accessories', price: 150.00, status: 'active', images: [{ url: '/images/handbag.jpg' }] },
      { _id: '3', name: 'Classic Denim Jeans', category: 'Pants', price: 45.50, status: 'active', images: [{ url: '/images/jeans.jpg' }] },
      { _id: '4', name: 'Silk Evening Dress', category: 'Dresses', price: 120.00, status: 'inactive', images: [{ url: '/images/dress.jpg' }] },
      { _id: '5', name: 'Wool Winter Coat', category: 'Coats', price: 95.00, status: 'active', images: [{ url: '/images/coat.jpg' }] }
    ];

    res.json({
      success: true,
      data: mockItems,
      pagination: {
        current: parseInt(page),
        pages: 1,
        total: mockItems.length
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all categories
router.get('/categories', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Mock data for categories
    const mockCategories = [
      { _id: '1', name: 'Dresses', description: 'Elegant dresses for all occasions', itemCount: 45 },
      { _id: '2', name: 'Shirts', description: 'Casual and formal shirts', itemCount: 78 },
      { _id: '3', name: 'Pants', description: 'Comfortable pants and trousers', itemCount: 52 },
      { _id: '4', name: 'Accessories', description: 'Bags, jewelry, and more', itemCount: 89 },
      { _id: '5', name: 'Jackets', description: 'Stylish jackets and coats', itemCount: 34 },
      { _id: '6', name: 'Shoes', description: 'Footwear for every style', itemCount: 67 }
    ];

    res.json({
      success: true,
      data: mockCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all orders
router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Mock data for orders
    const mockOrders = [
      { _id: '1', customerName: 'John Doe', items: [{}, {}], total: 135.99, status: 'completed', createdAt: new Date() },
      { _id: '2', customerName: 'Jane Smith', items: [{}], total: 89.99, status: 'processing', createdAt: new Date() },
      { _id: '3', customerName: 'Mike Johnson', items: [{}, {}, {}], total: 201.50, status: 'pending', createdAt: new Date() },
      { _id: '4', customerName: 'Sarah Wilson', items: [{}], total: 45.50, status: 'cancelled', createdAt: new Date() }
    ];

    res.json({
      success: true,
      data: mockOrders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
