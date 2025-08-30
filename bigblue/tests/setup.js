const axios = require('axios');
const path = require('path');

// Load environment variables from server/.env
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Use localhost:5000 as default
const API_URL = 'http://localhost:5000/api';
console.log('🔗 Connecting to API at:', API_URL);

const testApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test user credentials - FIXED WITH LOWERCASE EXPERIENCE LEVEL
const TEST_USER = {
  name: 'Test Diver',
  email: 'testdiver@example.com',
  password: 'Test123!@#',
  certificationLevel: 'Advanced Open Water',
  experienceLevel: 'intermediate', // Changed to lowercase
  numberOfDives: 50
};

// Alternative test users with different experience levels
const TEST_USERS = {
  beginner: {
    name: 'Beginner Test Diver',
    email: 'beginner.test@example.com',
    password: 'Test123!@#',
    certificationLevel: 'Open Water',
    experienceLevel: 'beginner',
    numberOfDives: 10
  },
  intermediate: {
    name: 'Intermediate Test Diver',
    email: 'intermediate.test@example.com',
    password: 'Test123!@#',
    certificationLevel: 'Advanced Open Water',
    experienceLevel: 'intermediate',
    numberOfDives: 50
  },
  advanced: {
    name: 'Advanced Test Diver',
    email: 'advanced.test@example.com',
    password: 'Test123!@#',
    certificationLevel: 'Rescue Diver',
    experienceLevel: 'advanced',
    numberOfDives: 150
  },
  expert: {
    name: 'Expert Test Diver',
    email: 'expert.test@example.com',
    password: 'Test123!@#',
    certificationLevel: 'Divemaster',
    experienceLevel: 'expert',
    numberOfDives: 500
  }
};

// Helper function to check if server is running
async function checkServerConnection() {
  try {
    console.log('🔍 Checking server connection...');
    const response = await testApi.get('/locations');
    console.log('✅ Server is running and responding');
    return true;
  } catch (error) {
    console.error('\n❌ Server connection failed!');
    if (error.code === 'ECONNREFUSED') {
      console.error('The server is not running on port 5000');
      console.error('\nTo fix this:');
      console.error('1. Open a new terminal');
      console.error('2. Navigate to your server folder: cd server');
      console.error('3. Start the server: npm start');
      console.error('4. Wait for "Server running on port 5000"');
      console.error('5. Then run the tests again\n');
    } else {
      console.error('Error details:', error.message);
    }
    return false;
  }
}

// Helper function to register and login
async function authenticateTestUser(userType = 'intermediate') {
  try {
    // First check if server is running
    const serverOk = await checkServerConnection();
    if (!serverOk) {
      throw new Error('Server is not running');
    }

    // Get the appropriate test user
    const testUser = TEST_USERS[userType] || TEST_USER;

    // Try to login first
    console.log('🔐 Attempting login...');
    const loginRes = await testApi.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    return loginRes.data.token;
  } catch (loginError) {
    if (loginError.response?.status === 401 || loginError.response?.status === 400) {
      // User doesn't exist, try to register
      try {
        // Get the appropriate test user
        const testUser = TEST_USERS[userType] || TEST_USER;
        
        console.log('📝 User not found, registering new user...');
        console.log(`   Experience Level: ${testUser.experienceLevel}`);
        
        const registerRes = await testApi.post('/auth/register', testUser);
        console.log('✅ Registration successful');
        return registerRes.data.token;
      } catch (registerError) {
        console.error('❌ Registration failed:', registerError.response?.data?.errors || registerError.response?.data?.error || registerError.message);
        
        // If it's still failing, let's try to figure out what values are accepted
        if (registerError.response?.data?.errors) {
          console.log('\n💡 Hint: Check your User model for accepted experienceLevel values');
          console.log('   Common values: beginner, intermediate, advanced, expert');
          console.log('   Or check server/models/User.js for the enum values\n');
        }
        
        throw registerError;
      }
    } else {
      console.error('❌ Login failed:', loginError.response?.data?.error || loginError.message);
      throw loginError;
    }
  }
}

module.exports = {
  testApi,
  TEST_USER,
  TEST_USERS,
  authenticateTestUser,
  checkServerConnection,
  API_URL
};