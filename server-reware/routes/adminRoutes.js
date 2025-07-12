const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Unified login - checks both admins and users collections
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = null;
    let userType = null;
    let redirectTo = null;

    // First, try to find in admins collection
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (admin) {
      // Check if admin is active
      if (admin.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Admin account is not active'
        });
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (isPasswordValid) {
        user = admin;
        userType = 'admin';
        redirectTo = '/admin/dashboard';
        
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();
      }
    }

    // If not found in admins, try users collection
    if (!user) {
      const regularUser = await User.findOne({
        $or: [
          { username: username },
          { email: username }
        ]
      });

      if (regularUser) {
        // Check if user is active
        if (regularUser.status !== 'active') {
          return res.status(401).json({
            success: false,
            message: 'User account is not active'
          });
        }

        // Check password
        const isPasswordValid = await regularUser.comparePassword(password);
        if (isPasswordValid) {
          user = regularUser;
          userType = 'user';
          redirectTo = '/dashboard';
          
          // Update last login if the field exists
          if (regularUser.lastLogin !== undefined) {
            regularUser.lastLogin = new Date();
            await regularUser.save();
          }
        }
      }
    }

    // If no valid user found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token based on user type
    const tokenPayload = userType === 'admin' ? {
      adminId: user._id,
      email: user.email,
      role: user.role,
      userType: 'admin'
    } : {
      userId: user._id,
      email: user.email,
      role: 'user',
      userType: 'user'
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare response data
    const responseData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: userType === 'admin' ? user.role : 'user',
      userType: userType,
      redirectTo: redirectTo
    };

    // Add admin-specific fields if user is admin
    if (userType === 'admin') {
      responseData.permissions = user.permissions;
      responseData.department = user.department;
    } else {
      // Add user-specific fields if regular user
      responseData.firstName = user.firstName;
      responseData.lastName = user.lastName;
    }

    res.json({
      success: true,
      message: `${userType === 'admin' ? 'Admin' : 'User'} login successful`,
      token,
      user: responseData,
      redirectTo: redirectTo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new admin (only for superadmin)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, role } = req.body;

    // Check if requester is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or username already exists'
      });
    }

    // Create new admin
    const admin = new Admin({
      firstName,
      lastName,
      email,
      username,
      password,
      role: role || 'admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get admin profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.adminId || req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all admins (superadmin only)
router.get('/list', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const admins = await Admin.find().select('-password');
    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update admin
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, username, role, permissions } = req.body;

    // Check if requester is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        username,
        role,
        permissions
      },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin updated successfully',
      admin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete admin (superadmin only)
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
