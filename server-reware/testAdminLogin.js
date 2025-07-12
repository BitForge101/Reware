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

// Test admin login
const testAdminLogin = async () => {
  try {
    console.log('🔐 Testing admin login...');
    
    const email = 'dhaval@gmail.com';
    const password = 'admin123';
    
    // Find admin
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }
    
    console.log('✅ Admin found:', admin.email);
    
    // Test password comparison
    const isPasswordValid = await admin.comparePassword(password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('🎉 Login test successful!');
      console.log('👤 Admin details:');
      console.log('   - Email:', admin.email);
      console.log('   - Username:', admin.username);
      console.log('   - Role:', admin.role);
      console.log('   - Status:', admin.status);
    } else {
      console.log('❌ Password comparison failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🧪 Testing admin login functionality...');
  console.log('');
  
  await connectDB();
  await testAdminLogin();
  
  console.log('');
  console.log('✅ Test completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
