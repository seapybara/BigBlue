const { testApi, authenticateTestUser } = require('../setup');

async function testBuddyRequests() {
  console.log('\n🧪 Testing Buddy Request Routes...\n');
  
  let token;
  let createdRequestId;
  let locationId;

  try {
    // 1. Authenticate
    console.log('1️⃣  Authenticating test user...');
    token = await authenticateTestUser();
    testApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authentication successful');

    // 2. Get a location to use
    console.log('\n2️⃣  Getting available locations...');
    const locationsRes = await testApi.get('/locations');
    if (locationsRes.data.data.length > 0) {
      locationId = locationsRes.data.data[0]._id;
      console.log(`✅ Found ${locationsRes.data.data.length} locations`);
    } else {
      throw new Error('No locations found. Please seed locations first.');
    }

    // 3. Create a buddy request
    console.log('\n3️⃣  Creating buddy request...');
    const newRequest = {
      locationId: locationId,
      diveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      diveTime: '09:00',
      experienceRequired: 'Intermediate',
      certificationRequired: 'Advanced Open Water',
      groupSize: 2,
      description: 'Test dive request - looking for buddies to explore the reef',
      equipment: 'BCD and regulator available for rent'
    };

    const createRes = await testApi.post('/buddy-requests', newRequest);
    createdRequestId = createRes.data.data._id;
    console.log('✅ Buddy request created with ID:', createdRequestId);

    // 4. Get all buddy requests
    console.log('\n4️⃣  Fetching all buddy requests...');
    const getAllRes = await testApi.get('/buddy-requests');
    console.log(`✅ Found ${getAllRes.data.count} buddy requests`);

    // 5. Get specific buddy request
    console.log('\n5️⃣  Fetching specific buddy request...');
    const getOneRes = await testApi.get(`/buddy-requests/${createdRequestId}`);
    console.log('✅ Retrieved buddy request:', getOneRes.data.data.location.name);

    // 6. Update buddy request
    console.log('\n6️⃣  Updating buddy request...');
    const updateRes = await testApi.put(`/buddy-requests/${createdRequestId}`, {
      description: 'Updated description - now including underwater photography',
      groupSize: 3
    });
    console.log('✅ Buddy request updated');

    // 7. Get my requests
    console.log('\n7️⃣  Fetching my buddy requests...');
    const myRequestsRes = await testApi.get('/buddy-requests/my/requests');
    console.log('✅ My requests retrieved:', {
      created: myRequestsRes.data.data.myRequests.length,
      joined: myRequestsRes.data.data.joinedRequests.length,
      pending: myRequestsRes.data.data.pendingRequests.length
    });

    // 8. Cancel the request (cleanup)
    console.log('\n8️⃣  Canceling buddy request...');
    const cancelRes = await testApi.delete(`/buddy-requests/${createdRequestId}`);
    console.log('✅ Buddy request cancelled');

    console.log('\n✨ All buddy request tests passed!\n');
    return true;

  } catch (error) {
    console.error('\n❌ Buddy request test failed:');
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.response.config.url);
    }
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  testBuddyRequests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testBuddyRequests;