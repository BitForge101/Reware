const axios = require('axios');

async function testLoginEndpoint() {
  try {
    console.log('🔐 Testing Unified Login Endpoint...\n');

    // Test admin login
    console.log('1️⃣ Testing Admin Login:');
    const adminResponse = await axios.post('http://localhost:5000/api/admin/login', {
      username: 'dhaval@gmail.com',
      password: 'admin123'
    });

    console.log('✅ Admin Login Response:');
    console.log('   Status:', adminResponse.status);
    console.log('   Success:', adminResponse.data.success);
    console.log('   Message:', adminResponse.data.message);
    console.log('   User Type:', adminResponse.data.user.userType);
    console.log('   Role:', adminResponse.data.user.role);
    console.log('   Redirect To:', adminResponse.data.redirectTo);
    console.log('   Token Present:', !!adminResponse.data.token);

    console.log('\n🎯 Login Test Completed Successfully!');
    console.log('\n📋 Frontend Integration:');
    console.log('   • Use POST request to: http://localhost:5000/api/admin/login');
    console.log('   • Send: { username: "dhaval@gmail.com", password: "admin123" }');
    console.log('   • Check response.data.redirectTo for redirect path');
    console.log('   • Store token in localStorage/sessionStorage');

  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:');
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data.message);
    } else {
      console.error('❌ Network error:', error.message);
    }
  }
}

testLoginEndpoint();
