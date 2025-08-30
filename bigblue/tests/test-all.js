const testAuth = require('./api/auth.test');
const testLocations = require('./api/locations.test');
const testBuddyRequests = require('./api/buddyRequests.test');
const testDives = require('./api/dives.test');

async function runAllTests() {
  console.log('🚀 Starting BigBlue API Test Suite');
  console.log('==================================\n');
  
  const results = {
    auth: false,
    locations: false,
    buddyRequests: false,
    dives: false
  };

  // Run authentication tests first
  results.auth = await testAuth();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run location tests
  results.locations = await testLocations();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run buddy request tests
  results.buddyRequests = await testBuddyRequests();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run dive tests
  results.dives = await testDives();

  // Summary
  console.log('\n==================================');
  console.log('📊 Test Summary:');
  console.log('==================================');
  console.log(`Authentication:  ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Locations:       ${results.locations ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Buddy Requests:  ${results.buddyRequests ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Dives:           ${results.dives ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your API is working correctly.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
  }
  
  return allPassed;
}

// Run all tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});