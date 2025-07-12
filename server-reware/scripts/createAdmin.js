const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reware', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    // Create initial admin user (You as the admin)
    const initialAdmin = new Admin({
      firstName: 'Dhava',
      lastName: 'Admin',
      email: 'dhava@rewear.com',
      username: 'admin',
      password: 'admin123', // Change this to a secure password
      role: 'superadmin',
      status: 'active',
      permissions: {
        canManageUsers: true,
        canManageItems: true,
        canManageOrders: true,
        canManageCategories: true,
        canViewAnalytics: true,
        canUploadPhotos: true,
        canManageSettings: true
      }
    });

    await initialAdmin.save();
    console.log('Initial admin created successfully!');
    console.log('Email:', initialAdmin.email);
    console.log('Username:', initialAdmin.username);
    console.log('Password: admin123 (please change this after first login)');

    // Also create a second admin for testing
    const testAdmin = new Admin({
      firstName: 'Test',
      lastName: 'Admin',
      email: 'test@rewear.com',
      username: 'testadmin',
      password: 'test123',
      role: 'admin',
      status: 'active',
      permissions: {
        canManageUsers: true,
        canManageItems: true,
        canManageOrders: true,
        canManageCategories: true,
        canViewAnalytics: true,
        canUploadPhotos: true,
        canManageSettings: false
      }
    });

    await testAdmin.save();
    console.log('Test admin created successfully!');
    console.log('Email:', testAdmin.email);
    console.log('Username:', testAdmin.username);
    console.log('Password: test123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating initial admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();
