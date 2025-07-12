const User = require('../models/user');
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
      role: user.role 
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
  console.log('=== LOGIN REQUEST ===');
  console.log('Request body:', req.body);
  
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    console.log('Validation failed: Missing credentials');
    return res.status(400).json({ 
      success: false,
      message: 'Username/Email and password are required' 
    });
  }

  console.log('Looking for user with:', email ? `email: ${email}` : `username: ${username}`);
  
  // Find user by email or username
  const query = email ? { email: email.toLowerCase() } : { username };
  console.log('Database query:', query);
  
  const user = await User.findOne(query);
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (!user) {
    console.log('User not found in database');
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }

  console.log('Found user:', { 
    id: user._id, 
    email: user.email, 
    username: user.username 
  });
  
  console.log('Comparing passwords...');
  console.log('Provided password:', password);
  console.log('Stored password hash:', user.password);
  
  const match = await bcrypt.compare(password, user.password);
  console.log('Password match:', match);
  
  if (!match) {
    console.log('Password comparison failed');
    return res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }

  console.log('Login successful, updating last login...');
  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ 
    id: user._id, 
    role: user.role 
  }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Remove password from response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  console.log('Login completed successfully for user:', user.email);
  res.status(200).json({ 
    success: true,
    message: 'Login successful',
    user: userResponse, 
    token 
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, dateOfBirth, gender } = req.body;
  
  const user = await User.findById(req.user.id);
  
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
  
  // Update full name if first or last name changed
  if (firstName || lastName) {
    user.name = `${user.firstName} ${user.lastName}`;
  }

  await user.save();

  // Remove password from response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: userResponse
  });
});

module.exports = { signup, login, getProfile, updateProfile };
