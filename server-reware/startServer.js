const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const adminManagementRoutes = require('./routes/adminManagementRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/admin/manage', adminManagementRoutes);
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`🔐 Admin login: http://localhost:${PORT}/api/admin/login`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });
