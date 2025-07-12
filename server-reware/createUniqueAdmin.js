const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reware');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create unique admin credentials
const createUniqueAdmin = async () => {
  try {
    // Remove any existing admin with old credentials
    await Admin.deleteMany({ email: 'dhava@admin.com' });
    
    // Create new unique admin credentials
    const uniqueAdminData = {
      username: 'dhava_reware_admin_2025',
      email: 'dhava.admin@reware-secure.com',
      password: 'ReWare#Admin$2025!Secure', // Strong unique password
      firstName: 'Dhava',
      lastName: 'Administrator',
      role: 'superadmin',
      permissions: {
        users: { read: true, write: true, delete: true },
        items: { read: true, write: true, delete: true },
        orders: { read: true, write: true, delete: true },
        categories: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        analytics: { read: true, write: true, delete: false }
      },
      isActive: true,
      securityCode: 'REWARE-ADMIN-2025', // Additional security layer
      lastLogin: null
    };

    const admin = new Admin(uniqueAdminData);
    await admin.save();

    console.log('🎉 Unique Admin credentials created successfully!');
    console.log('');
    console.log('🔐 SECURE ADMIN CREDENTIALS:');
    console.log('====================================');
    console.log('📧 Email:', uniqueAdminData.email);
    console.log('👤 Username:', uniqueAdminData.username);
    console.log('🔑 Password:', uniqueAdminData.password);
    console.log('🛡️  Security Code:', uniqueAdminData.securityCode);
    console.log('👨‍💼 Role:', uniqueAdminData.role);
    console.log('====================================');
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('- These credentials are unique and secure');
    console.log('- Only use these exact credentials to access admin panel');
    console.log('- Admin panel will only open with these credentials');
    console.log('- Regular users cannot access admin features');
    console.log('');
    console.log('🌐 Access URL: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🔒 Creating UNIQUE SECURE admin credentials for ReWare...');
  console.log('');
  
  await connectDB();
  await createUniqueAdmin();
  
  console.log('');
  console.log('✨ Secure admin setup completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
