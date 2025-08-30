const { testApi, authenticateTestUser } = require('../setup');

async function testLocations() {
  console.log('\n📍 Testing Location Routes...\n');
  
  let token;
  let locationId;
  let locationCount;

  try {
    // 1. Get all locations (public route)
    console.log('1️⃣  Getting all locations (public)...');
    const allLocationsRes = await testApi.get('/locations');
    locationCount = allLocationsRes.data.count;
    console.log(`✅ Found ${locationCount} locations`);
    
    if (locationCount === 0) {
      console.log('⚠️  No locations found. Please seed the database first.');
      console.log('   Run: node server/data/seedLocations.js');
      return false;
    }

    locationId = allLocationsRes.data.data[0]._id;
    console.log('   First location:', allLocationsRes.data.data[0].name);

    // 2. Get locations with filters
    console.log('\n2️⃣  Testing location filters...');
    
    // Filter by difficulty
    const beginnerRes = await testApi.get('/locations?difficulty=Beginner');
    console.log(`✅ Found ${beginnerRes.data.count} beginner locations`);
    
    // Filter by depth range
    const shallowRes = await testApi.get('/locations?minDepth=5&maxDepth=20');
    console.log(`✅ Found ${shallowRes.data.count} shallow locations (5-20m)`);
    
    // Filter by country (if Mexico exists in seed data)
    const countryRes = await testApi.get('/locations?country=Mexico');
    console.log(`✅ Found ${countryRes.data.count} locations in Mexico`);

    // 3. Get single location
    console.log('\n3️⃣  Getting single location details...');
    const singleRes = await testApi.get(`/locations/${locationId}`);
    const location = singleRes.data.data;
    console.log('✅ Location retrieved:', location.name);
    console.log('   Country:', location.country);
    console.log('   Difficulty:', location.difficulty);
    console.log('   Depth:', `${location.depth.min}-${location.depth.max}m`);
    console.log('   Marine Life:', location.marineLife.slice(0, 3).join(', '));

    // 4. Get countries list
    console.log('\n4️⃣  Getting countries list...');
    const countriesRes = await testApi.get('/locations/countries/list');
    console.log(`✅ Found ${countriesRes.data.count} countries with dive sites`);
    console.log('   Countries:', countriesRes.data.data.slice(0, 5).join(', '));

    // 5. Test nearby locations (requires coordinates)
    console.log('\n5️⃣  Testing nearby locations...');
    const { coordinates } = location;
    if (coordinates && coordinates.length === 2) {
      const nearbyRes = await testApi.get('/locations/nearby', {
        params: {
          longitude: coordinates[0],
          latitude: coordinates[1],
          maxDistance: 500000 // 500km
        }
      });
      console.log(`✅ Found ${nearbyRes.data.count} locations within 500km`);
    } else {
      console.log('⚠️  Skipping nearby test - location has no coordinates');
    }

    // 6. Authenticate for protected routes
    console.log('\n6️⃣  Authenticating for protected routes...');
    token = await authenticateTestUser();
    testApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authentication successful');

    // 7. Rate a location (protected route)
    console.log('\n7️⃣  Rating a location...');
    const ratingRes = await testApi.post(`/locations/${locationId}/rate`, {
      rating: 5,
      comment: 'Amazing dive site! Great visibility and lots of marine life.'
    });
    console.log('✅ Location rated successfully');
    console.log('   New average rating:', ratingRes.data.data.averageRating);
    console.log('   Total ratings:', ratingRes.data.data.totalRatings);

    // 8. Test invalid location ID
    console.log('\n8️⃣  Testing invalid location ID (expected to fail)...');
    try {
      await testApi.get('/locations/invalidid123');
      console.log('❌ Invalid location ID should have failed');
      return false;
    } catch (error) {
      if (error.response && [400, 404, 500].includes(error.response.status)) {
        console.log('✅ Invalid location ID properly rejected');
      } else {
        throw error;
      }
    }

    // 9. Test search functionality
    console.log('\n9️⃣  Testing location search...');
    const searchRes = await testApi.get('/locations', {
      params: {
        search: 'Blue' // Search for "Blue Hole" locations
      }
    });
    console.log(`✅ Found ${searchRes.data.count} locations matching "Blue"`);
    if (searchRes.data.count > 0) {
      console.log('   Results:', searchRes.data.data.map(l => l.name).join(', '));
    }

    // 10. Test pagination
    console.log('\n🔟 Testing pagination...');
    const page1Res = await testApi.get('/locations?page=1&limit=5');
    const page2Res = await testApi.get('/locations?page=2&limit=5');
    console.log(`✅ Page 1: ${page1Res.data.data.length} locations`);
    console.log(`✅ Page 2: ${page2Res.data.data.length} locations`);

    console.log('\n✨ All location tests passed!\n');
    return true;

  } catch (error) {
    console.error('\n❌ Location test failed:');
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
  testLocations().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testLocations;