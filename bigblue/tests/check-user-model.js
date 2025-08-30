const axios = require('axios');

async function checkUserModel() {
  console.log('🔍 Checking User Model Requirements\n');
  
  const API_URL = 'http://localhost:5000/api';
  
  // Test different experience levels
  const experienceLevels = [
    'beginner', 'Beginner', 'BEGINNER',
    'intermediate', 'Intermediate', 'INTERMEDIATE',
    'advanced', 'Advanced', 'ADVANCED',
    'expert', 'Expert', 'EXPERT'
  ];
  
  console.log('Testing experience levels...\n');
  
  for (const level of experienceLevels) {
    const testUser = {
      name: `Test ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      certificationLevel: 'Open Water',
      experienceLevel: level,
      numberOfDives: 10
    };
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log(`✅ "${level}" - ACCEPTED`);
      
      // Clean up - you might want to delete this user
      // For now, we'll just note it worked
      break; // Stop once we find a working value
      
    } catch (error) {
      if (error.response?.data?.errors) {
        console.log(`❌ "${level}" - REJECTED`);
      } else if (error.response?.status === 400 && error.response?.data?.error?.includes('duplicate')) {
        console.log(`⚠️  "${level}" - User already exists (might work)`);
      } else {
        console.log(`❌ "${level}" - Error: ${error.response?.data?.error || error.message}`);
      }
    }
  }
  
  console.log('\n📝 Recommendation:');
  console.log('Look at your server/models/User.js file');
  console.log('Find the experienceLevel field and check the enum values');
  console.log('\nExample of what to look for:');
  console.log('experienceLevel: {');
  console.log('  type: String,');
  console.log('  enum: ["beginner", "intermediate", "advanced", "expert"],');
  console.log('  // or enum: ["Beginner", "Intermediate", "Advanced", "Expert"]');
  console.log('}');
}

// Run the check
checkUserModel().catch(console.error);