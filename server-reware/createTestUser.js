const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/user');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/reware', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test user
const createTestUser = async () => {
  try {
    console.log('\n=== CREATING TEST USER ===\n');

    // Check if test user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: 'demo@reware.com' }, { username: 'demouser' }]
    });
    if (existingUser) {
      console.log('⚠️ Demo user already exists');
      console.log('Email:', existingUser.email);
      console.log('Username:', existingUser.username);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create new demo user
    const userData = {
      firstName: 'Demo',
      lastName: 'User', 
      name: 'Demo User',
      email: 'demo@reware.com',
      username: 'demouser',
      password: hashedPassword,
      phoneNumber: '9876543210',
      dateOfBirth: new Date('1995-06-15'),
      gender: 'other'
    };

    console.log('Creating demo user...');
    const user = await User.create(userData);
    console.log('✅ Demo user created successfully!');
    console.log('User ID:', user._id);
    console.log('Email:', user.email);
    console.log('Username:', user.username);

    console.log('\n📋 Demo User Credentials:');
    console.log('Email: demo@reware.com');
    console.log('Username: demouser');
    console.log('Password: demo123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await createTestUser();
};

main();
