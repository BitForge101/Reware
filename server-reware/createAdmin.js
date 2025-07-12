const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reware', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'dhava@admin.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Create new admin
    const adminData = {
      username: 'dhava_admin',
      email: 'dhava@admin.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      firstName: 'Dhava',
      lastName: 'Admin',
      role: 'superadmin',
      permissions: {
        users: { read: true, write: true, delete: true },
        items: { read: true, write: true, delete: true },
        orders: { read: true, write: true, delete: true },
        categories: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        analytics: { read: true, write: true, delete: false }
      },
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', adminData.role);
    console.log('');
    console.log('⚡ You can now log in to the admin panel with these credentials');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🚀 Creating admin user for ReWare platform...');
  console.log('');
  
  await connectDB();
  await createAdmin();
  
  console.log('');
  console.log('✨ Admin setup completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
