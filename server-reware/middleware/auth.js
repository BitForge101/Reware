const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Handle unified token structure
    if (decoded.userType === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid admin token' 
        });
      }
      req.user = admin;
      req.user.userType = 'admin';
      req.user.isAdmin = true;
    } else if (decoded.userType === 'user' || !decoded.userType) {
      // Handle both new userType structure and old structure
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid user token' 
        });
      }
      req.user = user;
      req.user.userType = 'user';
      req.user.isAdmin = false;
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure' 
      });
    }

    console.log('Authenticated user:', { 
      id: req.user._id, 
      userType: req.user.userType, 
      role: req.user.role 
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }

  // Check if user is admin by userType or role
  const isAdmin = req.user.userType === 'admin' || 
                  req.user.role === 'admin' || 
                  req.user.role === 'superadmin';

  if (!isAdmin) {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};
