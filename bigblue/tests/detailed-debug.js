// Save as: tests/detailed-debug.js
const axios = require('axios');

async function detailedDebug() {
  console.log('🔍 Detailed Server Debug\n');
  console.log('==========================\n');
  
  const baseURL = 'http://localhost:5000';
  const apiURL = `${baseURL}/api`;
  
  // Test 1: Check if server is responding
  console.log('1. Testing server connection...');
  try {
    const response = await axios.get(baseURL, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    console.log(`✅ Server responded with status: ${response.status}`);
    if (response.data) {
      console.log('   Response:', JSON.stringify(response.data).substring(0, 100));
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is NOT running on port 5000!');
      console.log('\nPlease start your server:');
      console.log('  cd server');
      console.log('  npm start\n');
      process.exit(1);
    } else {
      console.log('❌ Server error:', error.message);
    }
  }
  
  // Test 2: Check API root
  console.log('\n2. Testing API root...');
  try {
    const response = await axios.get(apiURL, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    console.log(`✅ API responded with status: ${response.status}`);
    if (response.data) {
      console.log('   Response:', JSON.stringify(response.data).substring(0, 100));
    }
  } catch (error) {
    console.log('❌ API error:', error.message);
  }
  
  // Test 3: Check each route
  const routes = [
    { path: '/auth/login', method: 'POST', data: { email: 'test@test.com', password: 'test' }, expectFail: true },
    { path: '/locations', method: 'GET' },
    { path: '/buddy-requests', method: 'GET' },
    { path: '/dives/stats', method: 'GET', needsAuth: true }
  ];
  
  console.log('\n3. Testing individual routes...');
  for (const route of routes) {
    try {
      const config = {
        method: route.method || 'GET',
        url: `${apiURL}${route.path}`,
        timeout: 5000,
        validateStatus: () => true
      };
      
      if (route.data) {
        config.data = route.data;
      }
      
      const response = await axios(config);
      
      if (response.status === 404) {
        console.log(`❌ ${route.path} - NOT FOUND (404)`);
      } else if (response.status === 401 && route.needsAuth) {
        console.log(`✅ ${route.path} - Protected route (401 expected)`);
      } else if (response.status >= 400 && route.expectFail) {
        console.log(`✅ ${route.path} - Failed as expected (${response.status})`);
      } else if (response.status < 400) {
        console.log(`✅ ${route.path} - Success (${response.status})`);
      } else {
        console.log(`⚠️  ${route.path} - Status ${response.status}`);
        if (response.data?.error || response.data?.message) {
          console.log(`   Error: ${response.data.error || response.data.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${route.path} - ${error.message}`);
    }
  }
  
  // Test 4: Try to register and login
  console.log('\n4. Testing registration flow...');
  const timestamp = Date.now();
  const testUser = {
    name: `Test ${timestamp}`,
    email: `test${timestamp}@test.com`,
    password: 'Test123!',
    certificationLevel: 'Open Water',
    experienceLevel: 'beginner',
    numberOfDives: 5
  };
  
  try {
    console.log('   Registering new user...');
    const registerRes = await axios.post(`${apiURL}/auth/register`, testUser, {
      validateStatus: () => true
    });
    
    if (registerRes.status === 201 || registerRes.status === 200) {
      console.log('   ✅ Registration successful');
      console.log('      Has token:', !!registerRes.data.token);
      console.log('      User ID:', registerRes.data.user?._id || 'Not provided');
      
      if (registerRes.data.token) {
        // Test /me endpoint
        console.log('\n   Testing /me endpoint...');
        try {
          const meRes = await axios.get(`${apiURL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${registerRes.data.token}` },
            validateStatus: () => true
          });
          
          if (meRes.status === 200) {
            console.log('   ✅ /me endpoint works');
            console.log('      User name:', meRes.data.data?.name);
          } else {
            console.log(`   ❌ /me endpoint failed with status ${meRes.status}`);
            console.log('      Error:', meRes.data);
          }
        } catch (meError) {
          console.log('   ❌ /me endpoint error:', meError.message);
        }
      }
    } else {
      console.log(`   ❌ Registration failed with status ${registerRes.status}`);
      console.log('      Error:', registerRes.data);
    }
  } catch (error) {
    console.log('   ❌ Registration error:', error.message);
    if (error.response?.data) {
      console.log('      Details:', error.response.data);
    }
  }
  
  // Test 5: Check MongoDB connection
  console.log('\n5. Checking database connection...');
  try {
    const locRes = await axios.get(`${apiURL}/locations`);
    console.log(`✅ Database connected - Found ${locRes.data.count || 0} locations`);
  } catch (error) {
    console.log('❌ Database might not be connected');
  }
  
  console.log('\n==========================');
  console.log('Debug complete!\n');
}

detailedDebug().catch(console.error);