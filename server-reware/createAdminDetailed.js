const mongoose = require('mongoose');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/reware';
    await mongoose.connect(connectionString);
    console.log('✅ MongoDB connected successfully');
    console.log('🔗 Database:', mongoose.connection.db.databaseName);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// Create admin with detailed logging
const createAdminWithLogging = async () => {
  try {
    console.log('🧹 Clearing existing admin accounts...');
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s)`);
    
    console.log('👤 Creating new admin...');
    
    const adminData = {
      username: 'dhaval_admin',
      email: 'dhaval@gmail.com',
      password: 'admin123',
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
      }
    };
    
    console.log('📝 Admin data to save:', {
      ...adminData,
      password: '[HIDDEN]'
    });
    
    // Create admin instance
    const admin = new Admin(adminData);
    
    console.log('💾 Saving admin to database...');
    const savedAdmin = await admin.save();
    
    console.log('✅ Admin saved successfully!');
    console.log('🆔 Admin ID:', savedAdmin._id);
    console.log('📧 Email:', savedAdmin.email);
    console.log('👤 Username:', savedAdmin.username);
    console.log('🔑 Password hashed:', !!savedAdmin.password);
    
    // Verify the save worked
    console.log('🔍 Verifying save...');
    const verifyAdmin = await Admin.findById(savedAdmin._id);
    if (verifyAdmin) {
      console.log('✅ Verification successful - admin found in database');
    } else {
      console.log('❌ Verification failed - admin not found');
    }
    
    // Count total admins
    const totalAdmins = await Admin.countDocuments();
    console.log(`📊 Total admins in collection: ${totalAdmins}`);
    
    return savedAdmin;
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    if (error.code === 11000) {
      console.error('💡 This is a duplicate key error - admin might already exist');
    }
    throw error;
  }
};

// Main execution
const main = async () => {
  console.log('🚀 CREATING ADMIN WITH DETAILED LOGGING');
  console.log('=======================================');
  console.log('');
  
  const connected = await connectDB();
  if (!connected) {
    console.log('❌ Failed to connect to database');
    process.exit(1);
  }
  
  try {
    const admin = await createAdminWithLogging();
    
    console.log('');
    console.log('🎉 SUCCESS! Admin created:');
    console.log('📧 Email: dhaval@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('✨ You can now login at http://localhost:3000');
    
  } catch (error) {
    console.log('❌ Failed to create admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
  
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
