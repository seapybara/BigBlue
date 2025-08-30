require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Location = require('../models/Location');

// Simplified dive locations with only valid enum values
const diveLocations = [
  // Caribbean Sites
  {
    name: "Blue Hole",
    description: "The Great Blue Hole is a giant marine sinkhole off the coast of Belize.",
    coordinates: { type: "Point", coordinates: [-87.5341, 17.3190] },
    country: "Belize",
    region: "Caribbean",
    difficulty: "advanced",
    depth: { min: 30, max: 43, average: 40 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6],
    marineLife: ["Caribbean reef sharks", "Bull sharks", "Giant groupers"],
    features: ["cave", "deep", "sharks"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.8, count: 523 }
  },
  {
    name: "Palancar Reef",
    description: "Cozumel's famous reef system with stunning coral formations and vibrant marine life.",
    coordinates: { type: "Point", coordinates: [-86.9877, 20.3440] },
    country: "Mexico",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 15, max: 35, average: 25 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6, 7, 8],
    marineLife: ["Sea turtles", "Eagle rays", "Moray eels", "Nurse sharks"],
    features: ["reef", "drift", "wall"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "restaurant"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.7, count: 892 }
  },
  {
    name: "USS Liberty Wreck",
    description: "WWII shipwreck in Tulamben, Bali. Accessible from shore and covered in beautiful coral growth.",
    coordinates: { type: "Point", coordinates: [115.5928, -8.2706] },
    country: "Indonesia",
    region: "Asia-Pacific",
    difficulty: "intermediate",
    depth: { min: 5, max: 30, average: 15 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Barracuda", "Jackfish", "Moray eels", "Angelfish"],
    features: ["wreck", "macro", "night_diving"],
    facilities: ["dive_shop", "equipment_rental", "restaurant", "accommodation"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.6, count: 1247 }
  }
];

// Generate more locations programmatically
const generateLocations = () => {
  const countries = [
    'Australia', 'Thailand', 'Philippines', 'Maldives', 'Egypt', 'Honduras', 'Costa Rica', 
    'South Africa', 'Fiji', 'Indonesia', 'Malaysia', 'Japan', 'Greece', 'Spain', 'France',
    'Italy', 'Turkey', 'Croatia', 'Malta', 'Cyprus', 'Morocco', 'Jordan', 'Cuba', 'Barbados',
    'Jamaica', 'Dominican Republic', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Ecuador',
    'Colombia', 'Venezuela', 'Panama', 'Nicaragua', 'Guatemala', 'India', 'Sri Lanka',
    'Myanmar', 'Vietnam', 'Cambodia', 'Laos', 'China', 'South Korea', 'Taiwan', 'Papua New Guinea',
    'Solomon Islands', 'Vanuatu', 'New Caledonia', 'Palau', 'Micronesia', 'Marshall Islands',
    'Kiribati', 'Tuvalu', 'Samoa', 'Tonga', 'Cook Islands', 'Tahiti', 'New Zealand'
  ];

  const regions = ['Caribbean', 'Pacific', 'Indian Ocean', 'Mediterranean', 'Red Sea', 'Asia-Pacific'];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const visibilities = ['excellent', 'good', 'fair', 'variable'];
  const currents = ['none', 'mild', 'moderate', 'strong'];
  const entries = ['shore', 'boat', 'both'];
  const features = ['reef', 'wreck', 'cave', 'wall', 'drift', 'night_diving', 'macro', 'sharks', 'rays', 'turtles', 'deep'];
  const facilities = ['dive_shop', 'equipment_rental', 'air_fills', 'nitrox', 'accommodation', 'restaurant'];
  const certs = ['Open Water', 'Advanced Open Water', 'Rescue Diver', 'Dive Master'];

  const additionalLocations = [];
  
  for (let i = 0; i < 92; i++) { // 3 already defined + 92 = 95 total
    const country = countries[Math.floor(Math.random() * countries.length)];
    const lat = (Math.random() * 180) - 90; // -90 to 90
    const lng = (Math.random() * 360) - 180; // -180 to 180
    
    additionalLocations.push({
      name: `Dive Site ${i + 4}`,
      description: `Beautiful dive site in ${country} with excellent marine life and coral formations.`,
      coordinates: { type: "Point", coordinates: [lng, lat] },
      country: country,
      region: regions[Math.floor(Math.random() * regions.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      depth: { 
        min: Math.floor(Math.random() * 20) + 5,
        max: Math.floor(Math.random() * 30) + 25,
        average: Math.floor(Math.random() * 25) + 15
      },
      visibility: visibilities[Math.floor(Math.random() * visibilities.length)],
      currentStrength: currents[Math.floor(Math.random() * currents.length)],
      entryType: entries[Math.floor(Math.random() * entries.length)],
      bestMonths: [1, 2, 3, 4, 5, 6].slice(0, Math.floor(Math.random() * 6) + 1),
      marineLife: ["Tropical fish", "Coral formations", "Sea life"],
      features: features.slice(0, Math.floor(Math.random() * 3) + 1),
      facilities: facilities.slice(0, Math.floor(Math.random() * 4) + 1),
      certificationRequired: certs[Math.floor(Math.random() * certs.length)],
      waterTemperature: { 
        summer: { min: 24, max: 30 }, 
        winter: { min: 20, max: 26 } 
      },
      rating: { 
        average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
        count: Math.floor(Math.random() * 500) + 50 
      }
    });
  }
  
  return additionalLocations;
};

const allLocations = [...diveLocations, ...generateLocations()];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌊 Connected to MongoDB');

    // Clear existing locations
    await Location.deleteMany({});
    console.log('🗑️  Cleared existing locations');

    // Insert new locations
    const createdLocations = await Location.insertMany(allLocations);
    console.log(`✅ Successfully seeded ${createdLocations.length} dive locations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();