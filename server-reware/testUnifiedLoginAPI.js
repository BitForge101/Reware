const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
require('dotenv').config();

// Import your app or create a simple test app
const authController = require('./controllers/authController');

// Create a simple test app
const app = express();
app.use(express.json());
app.post('/api/auth/login', authController.login);

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

// Test unified login API
const testUnifiedLoginAPI = async () => {
  try {
    console.log('\n=== TESTING UNIFIED LOGIN API ===\n');

    // Test 1: Admin login
    console.log('--- Testing Admin Login ---');
    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'dhaval@gmail.com',
        password: 'admin123'
      });

    console.log('Admin login status:', adminLoginResponse.status);
    if (adminLoginResponse.status === 200) {
      console.log('✅ Admin login successful');
      console.log('User type:', adminLoginResponse.body.userType);
      console.log('Redirect to:', adminLoginResponse.body.redirectTo);
    } else {
      console.log('❌ Admin login failed:', adminLoginResponse.body.message);
    }

    // Test 2: Regular user login (using the first user from database)
    console.log('\n--- Testing User Login ---');
    const userLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'dspatel0006@gmail.com',
        password: 'defaultpassword123' // You might need to adjust this
      });

    console.log('User login status:', userLoginResponse.status);
    if (userLoginResponse.status === 200) {
      console.log('✅ User login successful');
      console.log('User type:', userLoginResponse.body.userType);
      console.log('Redirect to:', userLoginResponse.body.redirectTo);
    } else {
      console.log('❌ User login failed:', userLoginResponse.body.message);
    }

    // Test 3: Invalid credentials
    console.log('\n--- Testing Invalid Credentials ---');
    const invalidLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@email.com',
        password: 'wrongpassword'
      });

    console.log('Invalid login status:', invalidLoginResponse.status);
    if (invalidLoginResponse.status === 401) {
      console.log('✅ Invalid credentials correctly rejected');
    } else {
      console.log('❌ Invalid credentials test failed');
    }

    console.log('\n✅ Unified login API test completed!');

  } catch (error) {
    console.error('❌ API test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
const main = async () => {
  await connectDB();
  await testUnifiedLoginAPI();
};

if (require.main === module) {
  main();
}

module.exports = { app, testUnifiedLoginAPI };
