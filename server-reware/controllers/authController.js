const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/errorHandler');

const signup = asyncHandler(async (req, res) => {
  console.log('=== SIGNUP REQUEST ===');
  console.log('Request body:', req.body);
  
  const { 
    firstName, 
    lastName, 
    email, 
    username, 
    password, 
    phoneNumber, 
    dateOfBirth, 
    gender 
  } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !username || !password || !phoneNumber || !dateOfBirth || !gender) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required',
      fields: ['firstName', 'lastName', 'email', 'username', 'password', 'phoneNumber', 'dateOfBirth', 'gender']
    });
  }

  // Additional validation
  if (password.length < 8) {
    console.log('Validation failed: Password too short');
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters long' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Validation failed: Invalid email format');
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }

  console.log('Checking for existing user...');
  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email: email.toLowerCase() }, { username }] 
  });
  
  if (existingUser) {
    console.log('User already exists:', existingUser.email || existingUser.username);
    if (existingUser.email === email.toLowerCase()) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already in use' 
      });
    }
    if (existingUser.username === username) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already taken' 
      });
    }
  }

  console.log('Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Creating user in database...');
  const userData = { 
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: email.toLowerCase(), 
    username,
    password: hashedPassword,
    phoneNumber,
    dateOfBirth: new Date(dateOfBirth),
    gender
  };
  
  console.log('User data to be saved:', { ...userData, password: '[HIDDEN]' });
  
  try {
    const user = await User.create(userData);
    console.log('User created successfully:', user._id);

    const token = jwt.sign({ 
      id: user._id, 
      role: user.role || 'user',
      userType: 'user'
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    console.log('Signup successful for user:', user.email);
    res.status(201).json({ 
      success: true,
      message: 'Account created successfully',
      user: userResponse, 
      token 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user account',
      error: error.message
    });
  }
});

const login = asyncHandler(async (req, res) => {
  console.log('=== UNIFIED LOGIN REQUEST ===');
  console.log('Request body:', req.body);
  
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    console.log('Validation failed: Missing credentials');
    return res.status(400).json({ 
      success: false,
      message: 'Username/Email and password are required' 
    });
  }

  const loginIdentifier = email || username;
  console.log('Looking for user/admin with:', email ? `email: ${email}` : `username: ${username}`);
  
  let user = null;
  let userType = null;
  let redirectTo = null;

  // First, try to find in admins collection
  console.log('Checking admin collection...');
  const query = email ? { email: email.toLowerCase() } : { username };
  const admin = await Admin.findOne({
    $or: [
      { username: loginIdentifier },
      { email: loginIdentifier.toLowerCase() }
    ]
  });

  if (admin) {
    console.log('Found admin:', { 
      id: admin._id, 
      email: admin.email, 
      username: admin.username,
      role: admin.role,
      status: admin.status
    });

    // Check if admin is active
    if (admin.status !== 'active') {
      console.log('Admin account is not active');
      return res.status(401).json({
        success: false,
        message: 'Admin account is not active'
      });
    }

    // Check password for admin
    console.log('Comparing admin password...');
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Admin password match:', isPasswordValid);
    
    if (isPasswordValid) {
      user = admin;
      userType = 'admin';
      redirectTo = '/admin';
      
      // Update last login
      admin.lastLogin = new Date();
      await admin.save();
      console.log('Admin login successful, updated lastLogin');
    }
  }

  // If not found in admins or password didn't match, try users collection
  if (!user) {
    console.log('Checking user collection...');
    const regularUser = await User.findOne(query);
    
    if (regularUser) {
      console.log('Found user:', { 
        id: regularUser._id, 
        email: regularUser.email, 
        username: regularUser.username 
      });
      
      console.log('Comparing user password...');
      const match = await bcrypt.compare(password, regularUser.password);
      console.log('User password match:', match);
      
      if (match) {
        user = regularUser;
        userType = 'user';
        redirectTo = '/dashboard';
        
        // Update last login
        regularUser.lastLogin = new Date();
        await regularUser.save();
        console.log('User login successful, updated lastLogin');
      }
    }
  }

  // If no user found or password didn't match
  if (!user) {
    console.log('Authentication failed - user not found or invalid password');
    return res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }

  // Generate JWT token
  const tokenPayload = {
    id: user._id,
    role: user.role || 'user',
    userType: userType
  };
  
  console.log('Generating token with payload:', tokenPayload);
  
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Remove password from response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  console.log(`${userType.charAt(0).toUpperCase() + userType.slice(1)} login completed successfully for:`, user.email || user.username);
  
  res.status(200).json({ 
    success: true,
    message: 'Login successful',
    user: userResponse,
    userType: userType,
    redirectTo: redirectTo,
    token 
  });
});

const getProfile = asyncHandler(async (req, res) => {
  console.log('=== GET PROFILE REQUEST ===');
  console.log('User from token:', { id: req.user.id, userType: req.user.userType, role: req.user.role });

  let user = null;

  // Check if user is admin based on userType or role
  if (req.user.userType === 'admin' || req.user.role === 'admin' || req.user.role === 'superadmin') {
    console.log('Fetching admin profile...');
    user = await Admin.findById(req.user.id).select('-password');
    if (user) {
      console.log('Admin profile found:', { id: user._id, email: user.email, role: user.role });
    }
  } else {
    console.log('Fetching user profile...');
    user = await User.findById(req.user.id).select('-password');
    if (user) {
      console.log('User profile found:', { id: user._id, email: user.email });
    }
  }
  
  if (!user) {
    console.log('Profile not found for ID:', req.user.id);
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  console.log('Profile fetched successfully');
  res.status(200).json({
    success: true,
    user,
    userType: req.user.userType || (user.role === 'admin' || user.role === 'superadmin' ? 'admin' : 'user')
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  console.log('=== UPDATE PROFILE REQUEST ===');
  console.log('User from token:', { id: req.user.id, userType: req.user.userType, role: req.user.role });
  console.log('Update data:', req.body);

  const { firstName, lastName, phoneNumber, dateOfBirth, gender } = req.body;
  
  let user = null;

  // Check if user is admin based on userType or role
  if (req.user.userType === 'admin' || req.user.role === 'admin' || req.user.role === 'superadmin') {
    console.log('Updating admin profile...');
    user = await Admin.findById(req.user.id);
  } else {
    console.log('Updating user profile...');
    user = await User.findById(req.user.id);
  }
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update only provided fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (gender) user.gender = gender;
  
  // Update full name if first or last name changed (for regular users)
  if ((firstName || lastName) && user.name !== undefined) {
    user.name = `${user.firstName} ${user.lastName}`;
  }

  await user.save();

  // Remove password from response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  console.log('Profile updated successfully');
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: userResponse
  });
});

module.exports = { signup, login, getProfile, updateProfile };
