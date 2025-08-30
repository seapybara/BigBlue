const mongoose = require('mongoose');
const BuddyRequest = require('../models/BuddyRequest');
const User = require('../models/User');
const Location = require('../models/Location');
require('dotenv').config();

// Sample buddy requests data
const buddyRequestsData = [
  {
    requester: '68abdf4d48816ad7b55854dd', // Test 1756094285622
    location: '68af0de209ab37ab2de5857e', // Blue Hole, Belize
    message: 'Looking for experienced divers to explore the famous Blue Hole! I have my Advanced Open Water certification and about 50 dives under my belt. Planning to do 2-3 dives during the day. Equipment rental available on site.',
    preferredDates: {
      start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      flexible: true
    },
    experienceLevel: 'intermediate',
    diveType: 'recreational',
    maxGroupSize: 4,
    tags: ['blue-hole', 'wall-diving', 'sharks'],
    emergencyContact: {
      name: 'John Smith',
      phone: '+1-555-0123',
      relationship: 'Brother'
    },
    additionalNotes: {
      equipment: 'Full gear available for rent, or bring your own',
      transportation: 'Boat transfer included in dive package',
      accommodation: 'Staying at local resort, can share ride from airport'
    }
  },
  {
    requester: '68abdf6e48816ad7b55854f1', // Intermediate Test Diver
    location: '68af0de209ab37ab2de58580', // USS Liberty Wreck, Indonesia
    message: 'Wreck diving enthusiast seeking dive buddies for the USS Liberty! This is one of the most accessible and beautiful wreck dives in the world. Perfect for intermediate to advanced divers. I have Rescue Diver certification and love underwater photography.',
    preferredDates: {
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      flexible: false
    },
    experienceLevel: 'advanced',
    diveType: 'wreck',
    maxGroupSize: 3,
    tags: ['wreck-diving', 'photography', 'historical'],
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1-555-0456',
      relationship: 'Wife'
    },
    additionalNotes: {
      equipment: 'Bringing my own gear, including underwater camera setup',
      transportation: 'Staying in Tulamben, can provide local transport advice',
      accommodation: 'Happy to recommend good dive resorts in the area'
    },
    responses: [
      {
        responder: '68abdf6c48816ad7b55854e0', // Test User 1756094316127
        message: 'I would love to join! I have Advanced Open Water and about 75 dives. Very interested in wreck diving and have been wanting to explore USS Liberty.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]
  }
];

async function seedBuddyRequests() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bigblue');
    console.log('🌊 Connected to MongoDB');

    // Clear existing buddy requests (optional - comment out if you want to keep existing ones)
    await BuddyRequest.deleteMany({});
    console.log('🧹 Cleared existing buddy requests');

    // Create buddy requests
    const createdRequests = [];
    for (const requestData of buddyRequestsData) {
      const buddyRequest = await BuddyRequest.create(requestData);
      createdRequests.push(buddyRequest);
      console.log(`✅ Created buddy request: ${buddyRequest._id} - ${requestData.message.substring(0, 50)}...`);
    }

    console.log(`\n✨ Successfully created ${createdRequests.length} buddy requests!`);
    
    // Display created requests with details
    console.log('\n📋 Created Buddy Requests:');
    console.log('========================');
    for (const request of createdRequests) {
      const populated = await BuddyRequest.findById(request._id)
        .populate('requester', 'name email')
        .populate('location', 'name country');
      
      console.log(`\nID: ${populated._id}`);
      console.log(`Requester: ${populated.requester.name} (${populated.requester.email})`);
      console.log(`Location: ${populated.location.name}, ${populated.location.country}`);
      console.log(`Experience: ${populated.experienceLevel} | Dive Type: ${populated.diveType}`);
      console.log(`Dates: ${populated.preferredDates.start.toDateString()} - ${populated.preferredDates.end.toDateString()}`);
      console.log(`Max Group Size: ${populated.maxGroupSize} | Responses: ${populated.responses.length}`);
      console.log(`Status: ${populated.status}`);
      console.log('------------------------');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding buddy requests:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBuddyRequests();