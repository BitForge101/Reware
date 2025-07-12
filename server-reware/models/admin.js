const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'suspended']
  },
  permissions: {
    canManageUsers: {
      type: Boolean,
      default: true
    },
    canManageItems: {
      type: Boolean,
      default: true
    },
    canManageOrders: {
      type: Boolean,
      default: true
    },
    canManageCategories: {
      type: Boolean,
      default: true
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    },
    canUploadPhotos: {
      type: Boolean,
      default: true
    },
    canManageSettings: {
      type: Boolean,
      default: true
    }
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
