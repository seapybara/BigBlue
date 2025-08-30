const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const demoUsers = [
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo123!',
    certificationLevel: 'Advanced Open Water',
    experienceLevel: 'intermediate',
    numberOfDives: 75,
    bio: 'Demo account for testing BigBlue features',
    location: 'California, USA'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'Test123!',
    certificationLevel: 'Rescue Diver',
    experienceLevel: 'advanced',
    numberOfDives: 200,
    bio: 'Experienced diver specializing in underwater photography',
    location: 'Hawaii, USA'
  },
  {
    name: 'Mike Chen',
    email: 'mike@example.com',
    password: 'Test123!',
    certificationLevel: 'Open Water',
    experienceLevel: 'beginner',
    numberOfDives: 15,
    bio: 'New diver excited to explore the underwater world',
    location: 'Florida, USA'
  },
  {
    name: 'Admin User',
    email: 'admin@bigblue.com',
    password: 'Admin123!',
    certificationLevel: 'Dive Master',
    experienceLevel: 'expert',
    numberOfDives: 500,
    bio: 'BigBlue platform administrator',
    location: 'California, USA',
    role: 'admin' // If you have roles
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bigblue');
    console.log('🌊 Connected to MongoDB');

    // Clear existing demo users (optional)
    const demoEmails = demoUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: demoEmails } });
    console.log('🧹 Cleared existing demo users');

    // Create demo users
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('\n✨ Demo users created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('------------------------');
    demoUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();