const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/errorHandler');

const signup = asyncHandler(async (req, res) => {
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
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required',
      fields: ['firstName', 'lastName', 'email', 'username', 'password', 'phoneNumber', 'dateOfBirth', 'gender']
    });
  }

  // Additional validation
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters long' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email: email.toLowerCase() }, { username }] 
  });
  
  if (existingUser) {
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

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await User.create({ 
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: email.toLowerCase(), 
    username,
    password: hashedPassword,
    phoneNumber,
    dateOfBirth,
    gender
  });

  const token = jwt.sign({ 
    id: user._id, 
    role: user.role 
  }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Remove password from response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  res.status(201).json({ 
    success: true,
    message: 'Account created successfully',
    user: userResponse, 
    token 
  });
});

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Username/Email and password are required' 
    });
  }

  // Find user by email or username
  const query = email ? { email: email.toLowerCase() } : { username };
  const user = await User.findOne(query);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }

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
