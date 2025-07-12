const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('./models/admin');
const User = require('./models/user');

async function testUnifiedLogin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Test admin login simulation
    console.log('\n🔍 Testing Admin Login Simulation...');
    const adminEmail = 'dhaval@gmail.com';
    const adminPassword = 'admin123';

    // Find admin
    const admin = await Admin.findOne({
      $or: [
        { username: adminEmail },
        { email: adminEmail }
      ]
    });

    if (admin) {
      console.log('✅ Admin found:', {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        status: admin.status
      });

      // Test password
      const isPasswordValid = await admin.comparePassword(adminPassword);
      console.log('🔑 Password validation:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

      if (isPasswordValid) {
        console.log('🎯 Admin login would succeed - Redirect to: /admin/dashboard');
      }
    } else {
      console.log('❌ Admin not found with email:', adminEmail);
    }

    // Test if any regular users exist
    console.log('\n🔍 Checking for regular users...');
    const userCount = await User.countDocuments();
    console.log('👥 Total users in database:', userCount);

    if (userCount > 0) {
      const sampleUser = await User.findOne().select('-password');
      console.log('📄 Sample user:', {
        id: sampleUser._id,
        email: sampleUser.email,
        username: sampleUser.username,
        status: sampleUser.status
      });
    }

    console.log('\n🎉 Unified login test completed successfully!');
    console.log('\n📋 Login Instructions:');
    console.log('   • Admin credentials: dhaval@gmail.com / admin123');
    console.log('   • Admins will be redirected to: /admin/dashboard');
    console.log('   • Regular users will be redirected to: /dashboard');
    console.log('   • API endpoint: POST /api/admin/login');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testUnifiedLogin();
