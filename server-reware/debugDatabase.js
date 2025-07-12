const mongoose = require('mongoose');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/admin');

// Debug database connection
const debugConnection = async () => {
  try {
    console.log('🔍 Environment variables:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('');
    
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/reware';
    console.log('🔗 Using connection string:', connectionString.substring(0, 50) + '...');
    
    await mongoose.connect(connectionString);
    console.log('✅ MongoDB connected successfully');
    
    // Get connection details
    const connection = mongoose.connection;
    console.log('📊 Connection details:');
    console.log('   - Database name:', connection.db.databaseName);
    console.log('   - Host:', connection.host);
    console.log('   - Port:', connection.port);
    console.log('   - Ready state:', connection.readyState);
    
    // List all collections
    const collections = await connection.db.listCollections().toArray();
    console.log('📁 Collections in database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Check admins collection specifically
    console.log('');
    console.log('🔍 Checking admins collection...');
    const adminCount = await Admin.countDocuments();
    console.log(`📊 Documents in admins collection: ${adminCount}`);
    
    if (adminCount > 0) {
      const admins = await Admin.find({}).select('email username role status');
      console.log('👥 Admin documents:');
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.email} (${admin.username}) - ${admin.role} - ${admin.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
};

// Main execution
const main = async () => {
  console.log('🐛 DATABASE DEBUG SCRIPT');
  console.log('========================');
  console.log('');
  
  await debugConnection();
  
  console.log('');
  console.log('✅ Debug completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
