const mongoose = require('mongoose');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/reware');
    console.log('✅ MongoDB connected successfully');
    console.log('🔗 Connected to:', process.env.MONGO_URI ? 'MongoDB Atlas' : 'Local MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Verify admin exists
const verifyAdmin = async () => {
  try {
    console.log('🔍 Checking admin collection...');
    
    // Count total admins
    const adminCount = await Admin.countDocuments();
    console.log(`📊 Total admins in collection: ${adminCount}`);
    
    // Find the specific admin
    const admin = await Admin.findOne({ email: 'dhaval@gmail.com' });
    
    if (admin) {
      console.log('✅ Admin found in database!');
      console.log('📧 Email:', admin.email);
      console.log('👤 Username:', admin.username);
      console.log('👨‍💼 Role:', admin.role);
      console.log('🟢 Status:', admin.status);
      console.log('🔑 Password hash exists:', !!admin.password);
      console.log('📅 Created at:', admin.createdAt);
      console.log('🔧 Permissions:', admin.permissions);
    } else {
      console.log('❌ Admin not found in database!');
      
      // List all admins
      const allAdmins = await Admin.find({});
      console.log('📋 All admins in collection:');
      allAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}, Username: ${admin.username}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying admin:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🔍 Verifying admin in MongoDB Atlas...');
  console.log('');
  
  await connectDB();
  await verifyAdmin();
  
  console.log('');
  console.log('✅ Verification completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
