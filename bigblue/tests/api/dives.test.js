const { testApi, authenticateTestUser } = require('../setup');

async function testDives() {
  console.log('\n🤿 Testing Dive Routes...\n');
  
  let token;
  let createdDiveId;
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
    locationId = locationsRes.data.data[0]._id;
    console.log('✅ Location selected:', locationsRes.data.data[0].name);

    // 3. Log a new dive
    console.log('\n3️⃣  Logging a new dive...');
    const newDive = {
      location: locationId,
      diveDate: new Date(),
      entryTime: '10:00',
      exitTime: '10:45',
      maxDepth: 18,
      avgDepth: 12,
      waterTemperature: 26,
      visibility: 15,
      current: 'Mild',
      surfaceConditions: 'Calm',
      underwaterConditions: 'Good',
      buddy: 'John Doe',
      diveType: 'Recreational',
      equipment: 'Full rental',
      weights: 6,
      gasType: 'Air',
      startBar: 200,
      endBar: 70,
      notes: 'Great dive with lots of marine life',
      marineLife: ['Turtle', 'Reef sharks', 'Barracuda']
    };

    const createRes = await testApi.post('/dives', newDive);
    createdDiveId = createRes.data.data._id;
    console.log('✅ Dive logged with ID:', createdDiveId);

    // 4. Get my dives
    console.log('\n4️⃣  Fetching my dives...');
    const myDivesRes = await testApi.get('/dives/my');
    console.log(`✅ Found ${myDivesRes.data.data.length} dives`);

    // 5. Get dive statistics
    console.log('\n5️⃣  Getting dive statistics...');
    const statsRes = await testApi.get('/dives/stats');
    console.log('✅ Dive statistics:', {
      totalDives: statsRes.data.data.overview.totalDives,
      avgDepth: Math.round(statsRes.data.data.overview.avgDepth),
      totalHours: statsRes.data.data.totalHoursUnderwater
    });

    // 6. Update dive
    console.log('\n6️⃣  Updating dive log...');
    const updateRes = await testApi.put(`/dives/${createdDiveId}`, {
      notes: 'Updated notes - saw a manta ray!',
      marineLife: ['Turtle', 'Reef sharks', 'Barracuda', 'Manta ray']
    });
    console.log('✅ Dive log updated');

    // 7. Search dives
    console.log('\n7️⃣  Searching dives...');
    const searchRes = await testApi.get('/dives/search', {
      params: {
        minDepth: 10,
        maxDepth: 20
      }
    });
    console.log(`✅ Found ${searchRes.data.count} dives matching criteria`);

    // 8. Delete dive (cleanup)
    console.log('\n8️⃣  Deleting test dive...');
    const deleteRes = await testApi.delete(`/dives/${createdDiveId}`);
    console.log('✅ Test dive deleted');

    console.log('\n✨ All dive tests passed!\n');
    return true;

  } catch (error) {
    console.error('\n❌ Dive test failed:');
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
  testDives().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testDives;