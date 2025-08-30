const axios = require('axios');

async function debugAuth() {
  const API_URL = 'http://localhost:5000/api';
  
  console.log('🔍 Debugging Auth Endpoints\n');
  
  try {
    // 1. Register a test user
    const timestamp = Date.now();
    const testUser = {
      name: `Debug User ${timestamp}`,
      email: `debug${timestamp}@test.com`,
      password: 'Test123!',
      certificationLevel: 'Open Water',
      experienceLevel: 'beginner',
      numberOfDives: 5
    };
    
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration response:', {
      success: registerRes.data.success,
      hasToken: !!registerRes.data.token,
      userId: registerRes.data.user?._id
    });
    
    const token = registerRes.data.token;
    
    // 2. Test /me endpoint with token
    console.log('\n2. Testing /me endpoint with token...');
    console.log('   Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    try {
      const meRes = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /me endpoint response:', {
        success: meRes.data.success,
        userId: meRes.data.data?._id,
        name: meRes.data.data?.name
      });
    } catch (meError) {
      console.log('❌ /me endpoint error:', {
        status: meError.response?.status,
        error: meError.response?.data
      });
      
      // Try to understand why it's failing
      console.log('\n3. Debugging token verification...');
      
      // Check if JWT_SECRET is set
      console.log('\n💡 Possible issues:');
      console.log('   1. JWT_SECRET not set in .env');
      console.log('   2. User model getSignedJwtToken() method issue');
      console.log('   3. Auth middleware not finding user');
      console.log('\n   Check server console for error details');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

debugAuth();