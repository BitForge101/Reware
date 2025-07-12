const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
require('dotenv').config();

// Import your app components
const authController = require('./controllers/authController');
const { authenticateToken } = require('./middleware/auth');

// Create a test app
const app = express();
app.use(express.json());
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', authenticateToken, authController.getProfile);

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

// Test the full authentication flow
const testFullAuthFlow = async () => {
  try {
    console.log('\n=== TESTING FULL AUTHENTICATION FLOW ===\n');

    // Test 1: Admin login and profile
    console.log('--- Testing Admin Login & Profile ---');
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

      // Test admin profile endpoint
      const adminToken = adminLoginResponse.body.token;
      const adminProfileResponse = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      console.log('Admin profile status:', adminProfileResponse.status);
      if (adminProfileResponse.status === 200) {
        console.log('✅ Admin profile fetched successfully');
        console.log('Profile user type:', adminProfileResponse.body.userType);
        console.log('Profile role:', adminProfileResponse.body.user.role);
      } else {
        console.log('❌ Admin profile fetch failed:', adminProfileResponse.body.message);
      }
    } else {
      console.log('❌ Admin login failed:', adminLoginResponse.body.message);
    }

    // Test 2: Create a test user and test user login
    console.log('\n--- Testing User Registration & Login ---');
    
    // First, register a test user
    const testUserData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@test.com',
      username: 'testuser',
      password: 'testpass123',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'other'
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(testUserData);

    if (signupResponse.status === 201 || signupResponse.status === 400) {
      console.log('Test user exists or created');
      
      // Now test user login with demo user
      const userLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@reware.com',
          password: 'demo123'
        });

      console.log('User login status:', userLoginResponse.status);
      if (userLoginResponse.status === 200) {
        console.log('✅ User login successful');
        console.log('User type:', userLoginResponse.body.userType);
        console.log('Redirect to:', userLoginResponse.body.redirectTo);

        // Test user profile endpoint
        const userToken = userLoginResponse.body.token;
        const userProfileResponse = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', `Bearer ${userToken}`);

        console.log('User profile status:', userProfileResponse.status);
        if (userProfileResponse.status === 200) {
          console.log('✅ User profile fetched successfully');
          console.log('Profile user type:', userProfileResponse.body.userType);
        } else {
          console.log('❌ User profile fetch failed:', userProfileResponse.body.message);
        }
      } else {
        console.log('❌ User login failed:', userLoginResponse.body.message);
      }
    }

    console.log('\n✅ Full authentication flow test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Add signup route for testing
app.post('/api/auth/signup', authController.signup);

// Run the test
const main = async () => {
  await connectDB();
  await testFullAuthFlow();
};

if (require.main === module) {
  main();
}

module.exports = { app, testFullAuthFlow };
