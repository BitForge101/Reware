const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/reware');
    console.log('✅ MongoDB connected successfully');
    console.log('🔗 Connected to:', process.env.MONGO_URI ? 'MongoDB Atlas' : 'Local MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create new simple admin
const createSimpleAdmin = async () => {
  try {
    // Remove any existing admin accounts
    await Admin.deleteMany({});
    console.log('🧹 Cleared existing admin accounts');
    
    // Create new simple admin credentials
    const simpleAdminData = {
      username: 'dhaval_admin',
      email: 'dhaval@gmail.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      firstName: 'Dhaval',
      lastName: 'Admin',
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
      },
      lastLogin: null
    };

    const admin = new Admin(simpleAdminData);
    await admin.save();

    console.log('🎉 Simple Admin credentials created successfully!');
    console.log('');
    console.log('🔐 ADMIN LOGIN CREDENTIALS:');
    console.log('====================================');
    console.log('📧 Email:', simpleAdminData.email);
    console.log('🔑 Password:', simpleAdminData.password);
    console.log('👨‍💼 Role:', simpleAdminData.role);
    console.log('====================================');
    console.log('');
    console.log('✨ Login at http://localhost:3000 with these credentials');
    console.log('✨ You will be automatically redirected to admin panel');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🚀 Creating simple admin credentials...');
  console.log('');
  
  await connectDB();
  await createSimpleAdmin();
  
  console.log('');
  console.log('✅ Admin setup completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
