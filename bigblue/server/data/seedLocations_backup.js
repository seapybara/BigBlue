require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Location = require('../models/Location');

const diveLocations = [
  // Caribbean
  {
    name: "Blue Hole",
    description: "The Great Blue Hole is a giant marine sinkhole off the coast of Belize. It's one of the most famous dive sites in the world.",
    coordinates: { type: "Point", coordinates: [-87.5341, 17.3190] },
    country: "Belize",
    region: "Caribbean",
    difficulty: "advanced",
    depth: { min: 30, max: 43, average: 40 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6],
    marineLife: ["Caribbean reef sharks", "Bull sharks", "Giant groupers", "Midnight parrotfish"],
    features: ["cave", "deep", "sharks"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 24, max: 26 } },
    hazards: ["Deep dive", "Overhead environment", "Strong thermocline"],
    rating: { average: 4.8, count: 523 }
  },
  {
    name: "Palancar Reef",
    description: "Cozumel's famous reef system with stunning coral formations and vibrant marine life. Perfect for drift diving.",
    coordinates: { type: "Point", coordinates: [-86.9877, 20.3440] },
    country: "Mexico",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 15, max: 35, average: 25 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6, 7, 8],
    marineLife: ["Sea turtles", "Eagle rays", "Moray eels", "Nurse sharks", "Splendid toadfish"],
    features: ["reef", "drift", "wall"],
    facilities: ["dive_shop", "equipment_rental", "air_fills", "nitrox", "restaurant"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.7, count: 892 }
  },

  // Asia-Pacific
  {
    name: "USS Liberty Wreck",
    description: "WWII shipwreck in Tulamben, Bali. Accessible from shore and covered in beautiful coral growth.",
    coordinates: { type: "Point", coordinates: [115.5935, -8.2742] },
    country: "Indonesia",
    region: "Asia-Pacific",
    difficulty: "beginner",
    depth: { min: 5, max: 30, average: 18 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Bumphead parrotfish", "Garden eels", "Black tip reef sharks", "Barracuda", "Pygmy seahorse"],
    features: ["wreck", "night_diving", "macro"],
    facilities: ["dive_shop", "equipment_rental", "parking", "showers", "restaurant"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.6, count: 1245 }
  },
  {
    name: "Sipadan Island",
    description: "Legendary Malaysian dive site known for massive schools of barracuda and regular turtle sightings.",
    coordinates: { type: "Point", coordinates: [118.6285, 4.1148] },
    country: "Malaysia",
    region: "Asia-Pacific",
    difficulty: "intermediate",
    depth: { min: 10, max: 40, average: 20 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Green turtles", "Hawksbill turtles", "Barracuda tornado", "White tip sharks", "Hammerheads"],
    features: ["reef", "wall", "sharks", "turtles"],
    facilities: ["dive_shop", "equipment_rental", "accommodation", "restaurant"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    hazards: ["Strong currents", "Deep walls"],
    rating: { average: 4.9, count: 678 }
  },

  // Red Sea
  {
    name: "SS Thistlegorm",
    description: "British WWII cargo ship, one of the best wreck dives in the world with intact cargo including motorcycles and trains.",
    coordinates: { type: "Point", coordinates: [33.9203, 27.8133] },
    country: "Egypt",
    region: "Red Sea",
    difficulty: "intermediate",
    depth: { min: 16, max: 33, average: 25 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [3, 4, 5, 9, 10, 11],
    marineLife: ["Barracuda", "Trevally", "Batfish", "Crocodile fish", "Stonefish"],
    features: ["wreck", "deep"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 30 }, winter: { min: 21, max: 24 } },
    hazards: ["Penetration hazard", "Current", "Depth"],
    rating: { average: 4.8, count: 456 }
  },
  {
    name: "Blue Hole Dahab",
    description: "Famous sinkhole with an arch at 56m. Beautiful coral gardens in the shallower sections.",
    coordinates: { type: "Point", coordinates: [34.5397, 28.5723] },
    country: "Egypt",
    region: "Red Sea",
    difficulty: "advanced",
    depth: { min: 6, max: 60, average: 30 },
    visibility: "excellent",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [3, 4, 5, 9, 10, 11],
    marineLife: ["Barracuda", "Tuna", "Jacks", "Coral grouper", "Anthias"],
    features: ["cave", "deep", "wall"],
    facilities: ["dive_shop", "equipment_rental", "restaurant", "parking"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 20, max: 23 } },
    hazards: ["Depth", "Overhead environment at the arch"],
    rating: { average: 4.5, count: 789 }
  },

  // Pacific
  {
    name: "Great Barrier Reef - Cod Hole",
    description: "Famous for friendly potato cod encounters. Part of the Ribbon Reefs system.",
    coordinates: { type: "Point", coordinates: [145.6941, -14.6624] },
    country: "Australia",
    region: "Pacific",
    difficulty: "beginner",
    depth: { min: 10, max: 25, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Potato cod", "Maori wrasse", "White tip reef sharks", "Sea turtles", "Giant clams"],
    features: ["reef", "macro", "turtles"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "accommodation"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.7, count: 1123 }
  },
  {
    name: "Blue Corner",
    description: "Palau's most famous dive site with strong currents attracting large pelagics.",
    coordinates: { type: "Point", coordinates: [134.2239, 7.1342] },
    country: "Palau",
    region: "Pacific",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 11, 12],
    marineLife: ["Grey reef sharks", "Hammerheads", "Eagle rays", "Barracuda", "Napoleon wrasse"],
    features: ["reef", "drift", "sharks", "wall"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    hazards: ["Strong currents", "Hook-in diving required"],
    rating: { average: 4.9, count: 567 }
  },

  // Maldives
  {
    name: "Manta Point Lankan",
    description: "Cleaning station for manta rays with year-round sightings.",
    coordinates: { type: "Point", coordinates: [73.1738, 3.7146] },
    country: "Maldives",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 12, max: 30, average: 20 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Manta rays", "Eagle rays", "Grey reef sharks", "Turtles", "Napoleon wrasse"],
    features: ["reef", "rays", "drift"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "accommodation"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.8, count: 432 }
  },

  // Mediterranean
  {
    name: "Zenobia Wreck",
    description: "Swedish ferry wreck in Cyprus, one of the top 10 wreck dives in the world.",
    coordinates: { type: "Point", coordinates: [33.6525, 34.9003] },
    country: "Cyprus",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 16, max: 42, average: 28 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Grouper", "Barracuda", "Tuna", "Amberjacks", "Moray eels"],
    features: ["wreck", "deep"],
    facilities: ["dive_shop", "equipment_rental", "air_fills", "parking"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 16, max: 19 } },
    hazards: ["Penetration", "Depth", "Fishing nets"],
    rating: { average: 4.7, count: 345 }
  },

  // Americas - Pacific
  {
    name: "Darwin Island",
    description: "Galapagos dive site famous for hammerhead schools and whale sharks.",
    coordinates: { type: "Point", coordinates: [-91.9903, 1.6781] },
    country: "Ecuador",
    region: "Pacific",
    difficulty: "expert",
    depth: { min: 10, max: 40, average: 25 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Hammerhead sharks", "Whale sharks", "Galapagos sharks", "Dolphins", "Manta rays"],
    features: ["sharks", "drift", "deep", "wall"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 23, max: 26 }, winter: { min: 19, max: 23 } },
    hazards: ["Strong currents", "Surge", "Remote location"],
    rating: { average: 4.9, count: 234 }
  },
  {
    name: "Cenote Dos Ojos",
    description: "Stunning freshwater cave system with crystal clear water and beautiful light effects.",
    coordinates: { type: "Point", coordinates: [-87.3751, 20.3274] },
    country: "Mexico",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 5, max: 10, average: 8 },
    visibility: "excellent",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Freshwater mollies", "Pale catfish", "Blind brotula (rare)", "Freshwater shrimp"],
    features: ["cave"],
    facilities: ["dive_shop", "equipment_rental", "parking", "showers", "lockers"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 25, max: 26 }, winter: { min: 24, max: 25 } },
    hazards: ["Overhead environment", "Limited visibility if stirred"],
    rating: { average: 4.8, count: 678 }
  },

  // Raja Ampat, Indonesia
  {
    name: "Cape Kri",
    description: "Holds the world record for most fish species on a single dive (374 species). Part of Raja Ampat's incredible biodiversity.",
    coordinates: { type: "Point", coordinates: [130.6743, -0.5892] },
    country: "Indonesia",
    region: "Asia-Pacific",
    difficulty: "intermediate",
    depth: { min: 5, max: 40, average: 18 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    marineLife: ["Manta rays", "Wobbegong sharks", "Barracuda", "Trevally", "Sweetlips", "Fusiliers", "Soft corals"],
    features: ["reef", "drift", "macro"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "accommodation"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.9, count: 456 }
  },

  // Socorro Islands, Mexico
  {
    name: "Roca Partida",
    description: "Remote volcanic pinnacle famous for giant manta rays, hammerheads, and whale sharks. Liveaboard only destination.",
    coordinates: { type: "Point", coordinates: [-112.0472, 18.9900] },
    country: "Mexico",
    region: "Pacific",
    difficulty: "advanced",
    depth: { min: 15, max: 45, average: 30 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Giant manta rays", "Hammerhead sharks", "Whale sharks", "Silky sharks", "Bottlenose dolphins"],
    features: ["sharks", "rays", "drift", "wall"],
    facilities: ["accommodation"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 21, max: 24 } },
    hazards: ["Strong currents", "Remote location", "Rough seas"],
    rating: { average: 4.9, count: 234 }
  },

  // Richelieu Rock, Thailand
  {
    name: "Richelieu Rock",
    description: "Thailand's premier dive site with incredible macro life and visiting pelagics including whale sharks and manta rays.",
    coordinates: { type: "Point", coordinates: [98.2889, 9.6264] },
    country: "Thailand",
    region: "Asia-Pacific",
    difficulty: "intermediate",
    depth: { min: 8, max: 35, average: 22 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Whale sharks", "Manta rays", "Frogfish", "Seahorses", "Nudibranchs", "Ghost pipefish"],
    features: ["reef", "macro"],
    facilities: ["dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.7, count: 892 }
  },

  // Tubbataha Reefs, Philippines
  {
    name: "Tubbataha North Atoll",
    description: "UNESCO World Heritage Site with pristine coral walls and over 600 fish species. Liveaboard only access.",
    coordinates: { type: "Point", coordinates: [119.8667, 8.8667] },
    country: "Philippines",
    region: "Asia-Pacific",
    difficulty: "advanced",
    depth: { min: 15, max: 50, average: 25 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6],
    marineLife: ["Whale sharks", "Manta rays", "Grey reef sharks", "Hammerheads", "Jack fish", "Barracuda"],
    features: ["reef", "wall", "sharks", "pristine"],
    facilities: ["accommodation"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 26, max: 28 } },
    hazards: ["Strong currents", "Remote location"],
    rating: { average: 4.8, count: 345 }
  },

  // Brothers Islands, Egypt
  {
    name: "Big Brother Island",
    description: "Red Sea pinnacle famous for hammerheads, thresher sharks, and two historic wrecks on the reef.",
    coordinates: { type: "Point", coordinates: [34.8267, 26.2683] },
    country: "Egypt",
    region: "Red Sea",
    difficulty: "advanced",
    depth: { min: 20, max: 60, average: 35 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10],
    marineLife: ["Hammerhead sharks", "Thresher sharks", "Grey reef sharks", "Silvertip sharks", "Oceanic whitetips"],
    features: ["sharks", "wrecks", "drift", "wall"],
    facilities: ["accommodation"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    hazards: ["Strong currents", "Deep diving", "Remote location"],
    rating: { average: 4.8, count: 287 }
  },

  // Cocos Island, Costa Rica
  {
    name: "Bajo Alcyone",
    description: "Seamount rising from deep water, famous for massive hammerhead schools and other large pelagics.",
    coordinates: { type: "Point", coordinates: [-87.0642, 5.5364] },
    country: "Costa Rica",
    region: "Pacific",
    difficulty: "expert",
    depth: { min: 25, max: 45, average: 35 },
    visibility: "good",
    currentStrength: "very_strong",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Scalloped hammerheads", "Whale sharks", "Galapagos sharks", "Silky sharks", "Mobula rays"],
    features: ["sharks", "drift", "seamount", "advanced"],
    facilities: ["accommodation"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 22, max: 25 } },
    hazards: ["Very strong currents", "Deep diving", "Remote location", "Advanced only"],
    rating: { average: 4.9, count: 178 }
  },

  // Beqa Lagoon, Fiji - World's Best Shark Diving
  {
    name: "Beqa Lagoon Shark Dive",
    description: "Home to 8 species of sharks including bull sharks and tigers. Called 'The Soft Coral Capital of the World'.",
    coordinates: { type: "Point", coordinates: [178.0833, -18.4000] },
    country: "Fiji",
    region: "Pacific",
    difficulty: "intermediate",
    depth: { min: 15, max: 30, average: 22 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Bull sharks", "Tiger sharks", "Grey reef sharks", "Silvertip sharks", "Lemon sharks", "Nurse sharks", "Blue ribbon eels", "Clown triggerfish"],
    features: ["sharks", "soft_corals", "reef", "marine_protected_area"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "accommodation", "restaurant"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 23, max: 26 } },
    rating: { average: 4.9, count: 567 }
  },

  // Bunaken National Marine Park, Indonesia
  {
    name: "Bunaken Marine Park",
    description: "Home to 70% of all fish species in Indonesian waters and 390 coral species. World-famous coral walls.",
    coordinates: { type: "Point", coordinates: [124.7581, 1.6169] },
    country: "Indonesia",
    region: "Asia-Pacific",
    difficulty: "beginner",
    depth: { min: 5, max: 40, average: 20 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["33 species of butterflyfish", "Green sea turtles", "Hawksbill turtles", "Napoleon wrasse", "Giant clams", "Barracuda", "Trevally", "Dolphins"],
    features: ["reef", "wall", "turtles", "coral_diversity", "marine_protected_area"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "accommodation"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.8, count: 892 }
  },

  // South Ari Atoll, Maldives
  {
    name: "South Ari Atoll",
    description: "Year-round whale shark encounters and pristine coral reefs. One of the world's best whale shark sites.",
    coordinates: { type: "Point", coordinates: [72.8000, 3.7000] },
    country: "Maldives",
    region: "Indian Ocean",
    difficulty: "beginner",
    depth: { min: 8, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 8, 9, 10, 11],
    marineLife: ["Whale sharks", "Manta rays", "Grey reef sharks", "Eagle rays", "Napoleon wrasse", "Barracuda", "Tuna", "Dolphins"],
    features: ["whale_sharks", "reef", "drift", "pristine"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "luxury_resorts"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.8, count: 734 }
  },

  // Komodo National Park, Indonesia
  {
    name: "Castle Rock",
    description: "Komodo's premier dive site with strong currents attracting large pelagics and colorful soft corals.",
    coordinates: { type: "Point", coordinates: [119.4889, -8.5556] },
    country: "Indonesia",
    region: "Asia-Pacific",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Manta rays", "Grey reef sharks", "White tip sharks", "Trevally", "Barracuda", "Dogtooth tuna", "Giant moray eels", "Soft corals"],
    features: ["sharks", "rays", "drift", "strong_current", "seamount"],
    facilities: ["dive_shop", "equipment_rental", "liveaboard"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 24, max: 26 } },
    hazards: ["Very strong currents", "Down currents possible"],
    rating: { average: 4.7, count: 423 }
  },

  // Fuvahmulah, Maldives - Tiger Shark Capital
  {
    name: "Tiger Zoo Fuvahmulah",
    description: "The world's most reliable tiger shark dive site. Up to 30 tiger sharks on a single dive.",
    coordinates: { type: "Point", coordinates: [73.4278, -0.2833] },
    country: "Maldives",
    region: "Indian Ocean",
    difficulty: "advanced",
    depth: { min: 20, max: 35, average: 28 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [12, 1, 2, 3, 4],
    marineLife: ["Tiger sharks", "Thresher sharks", "Silvertip sharks", "Grey reef sharks", "Eagle rays", "Tuna", "Dogtooth tuna"],
    features: ["sharks", "tiger_sharks", "advanced", "unique"],
    facilities: ["dive_shop", "equipment_rental", "guesthouse"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    hazards: ["Large predators", "Strong currents", "Deep diving"],
    rating: { average: 4.9, count: 234 }
  },

  // Ras Mohammed, Egypt
  {
    name: "Ras Mohammed Shark Reef",
    description: "Egypt's most famous dive site with dramatic drop-offs and abundant marine life in the Red Sea.",
    coordinates: { type: "Point", coordinates: [34.2350, 27.7350] },
    country: "Egypt",
    region: "Red Sea",
    difficulty: "intermediate",
    depth: { min: 10, max: 30, average: 20 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "shore",
    bestMonths: [3, 4, 5, 9, 10, 11],
    marineLife: ["White tip reef sharks", "Grey reef sharks", "Barracuda", "Tuna", "Giant moray eels", "Napoleon wrasse", "Anthias", "Coral groupers"],
    features: ["sharks", "reef", "wall", "national_park"],
    facilities: ["dive_shop", "equipment_rental", "parking", "restaurant"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 30 }, winter: { min: 21, max: 24 } },
    rating: { average: 4.7, count: 656 }
  },

  // Molokini Crater, Hawaii
  {
    name: "Molokini Crater",
    description: "Crescent-shaped volcanic crater with crystal clear waters and diverse marine life off Maui.",
    coordinates: { type: "Point", coordinates: [-156.4944, 20.6306] },
    country: "United States",
    region: "Pacific",
    difficulty: "beginner",
    depth: { min: 10, max: 50, average: 25 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Green sea turtles", "White tip reef sharks", "Manta rays", "Eagle rays", "Moorish idols", "Yellow tangs", "Butterflyfish", "Parrotfish"],
    features: ["crater", "reef", "turtles", "clear_water"],
    facilities: ["dive_shop", "equipment_rental", "tours"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 25, max: 27 }, winter: { min: 22, max: 24 } },
    rating: { average: 4.6, count: 789 }
  },

  // Cathedral Cove, Poor Knights Islands, New Zealand
  {
    name: "Poor Knights Islands",
    description: "New Zealand's premier marine reserve with unique subtropical marine life and dramatic underwater topography.",
    coordinates: { type: "Point", coordinates: [174.7500, -35.4667] },
    country: "New Zealand",
    region: "Pacific",
    difficulty: "intermediate",
    depth: { min: 8, max: 40, average: 22 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Stingrays", "Bronze whaler sharks", "Kingfish", "John Dory", "Crayfish", "Nudibranch species", "Sponge gardens", "Kelp forests"],
    features: ["temperate", "arches", "caves", "marine_reserve"],
    facilities: ["dive_shop", "equipment_rental", "charter_boats"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 18, max: 22 }, winter: { min: 14, max: 16 } },
    rating: { average: 4.7, count: 345 }
  },

  // John Pennekamp Coral Reef State Park, Florida Keys
  {
    name: "John Pennekamp Coral Reef State Park",
    description: "America's first underwater park featuring the Christ of the Deep statue and pristine coral reefs.",
    coordinates: { type: "Point", coordinates: [-80.3581, 25.1201] },
    country: "United States",
    region: "Florida Keys",
    difficulty: "beginner",
    depth: { min: 8, max: 25, average: 15 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Parrotfish", "Angelfish", "Grouper", "Barracuda", "Sea turtles", "Nurse sharks", "Moray eels", "Spiny lobsters"],
    features: ["reef", "statue", "marine_protected_area", "clear_water"],
    facilities: ["dive_shop", "equipment_rental", "glass_bottom_boats", "snorkel_rental"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.5, count: 1234 }
  },

  // Spiegel Grove Wreck, Key Largo
  {
    name: "Spiegel Grove Wreck",
    description: "510-foot Navy ship wreck, one of the largest artificial reefs in the world. Advanced diving site.",
    coordinates: { type: "Point", coordinates: [-80.3167, 25.0667] },
    country: "United States",
    region: "Florida Keys",
    difficulty: "advanced",
    depth: { min: 40, max: 40, average: 40 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Goliath grouper", "Barracuda", "Permit", "Amberjack", "Sharks", "Rays", "Angelfish", "Moray eels"],
    features: ["wreck", "artificial_reef", "large_pelagics", "penetration"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "charter_boats"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.8, count: 892 }
  },

  // Rainbow Reef, Key Largo
  {
    name: "Rainbow Reef",
    description: "Vibrant shallow reef perfect for beginners with abundant tropical fish and healthy coral formations.",
    coordinates: { type: "Point", coordinates: [-80.3500, 25.1000] },
    country: "United States",
    region: "Florida Keys",
    difficulty: "beginner",
    depth: { min: 6, max: 18, average: 12 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Parrotfish", "Yellowtail snapper", "Sergeant majors", "Blue tangs", "Angelfish", "Butterflyfish", "Green moray eels", "Cleaner shrimp"],
    features: ["reef", "shallow", "colorful", "fish_feeding"],
    facilities: ["dive_shop", "equipment_rental", "snorkel_tours"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.4, count: 567 }
  },

  // Jupiter, Florida - Shark Diving
  {
    name: "Jupiter Shark Ledge",
    description: "World-class shark diving with lemon sharks, Caribbean reef sharks, and nurse sharks year-round.",
    coordinates: { type: "Point", coordinates: [-80.0833, 26.9342] },
    country: "United States",
    region: "Southeast Florida",
    difficulty: "intermediate",
    depth: { min: 18, max: 25, average: 22 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Lemon sharks", "Caribbean reef sharks", "Nurse sharks", "Bull sharks", "Goliath grouper", "Loggerhead turtles", "Rays", "Barracuda"],
    features: ["sharks", "ledge", "drift", "seasonal_aggregation"],
    facilities: ["dive_shop", "equipment_rental", "shark_diving_charters"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.9, count: 743 }
  },

  // Cozumel, Mexico - Palancar Reef
  {
    name: "Palancar Reef",
    description: "World-renowned drift diving with massive coral formations and incredible biodiversity in crystal clear water.",
    coordinates: { type: "Point", coordinates: [-87.0500, 20.3500] },
    country: "Mexico",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [12, 1, 2, 3, 4, 5],
    marineLife: ["Eagle rays", "Turtles", "Angelfish", "Parrotfish", "Grouper", "Moray eels", "Nurse sharks", "Barracuda"],
    features: ["drift", "reef", "coral_formations", "clear_water"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "resort_diving"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.7, count: 1456 }
  },

  // Roatan, Honduras - CoCo View Wall
  {
    name: "CoCo View Wall",
    description: "Dramatic wall dive with pristine hard and soft corals, plus encounters with dolphins and whale sharks.",
    coordinates: { type: "Point", coordinates: [-86.4000, 16.3000] },
    country: "Honduras",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 20, max: 45, average: 30 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    marineLife: ["Dolphins", "Whale sharks", "Eagle rays", "Reef sharks", "Grouper", "Snappers", "Parrotfish", "Hawksbill turtles"],
    features: ["wall", "pelagics", "coral_diversity", "occasional_whales"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "resort_diving"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.8, count: 634 }
  },

  // Barbados - Stavronikita Wreck
  {
    name: "Stavronikita Wreck",
    description: "122-meter Greek freighter wreck covered in coral and sponges, home to large schools of fish.",
    coordinates: { type: "Point", coordinates: [-59.6167, 13.1000] },
    country: "Barbados",
    region: "Caribbean",
    difficulty: "intermediate",
    depth: { min: 25, max: 42, average: 35 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 5, 6, 11, 12],
    marineLife: ["Barracuda", "Jacks", "Moray eels", "Angelfish", "Turtles", "Rays", "Grouper", "Yellowtail snappers"],
    features: ["wreck", "artificial_reef", "schooling_fish", "coral_encrusted"],
    facilities: ["dive_shop", "equipment_rental", "nitrox", "wreck_diving_specialists"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.6, count: 423 }
  },

  // Bonaire - Salt Pier
  {
    name: "Salt Pier",
    description: "Unique shore diving under a working salt pier with incredible macro life and occasional tarpon schools.",
    coordinates: { type: "Point", coordinates: [-68.2833, 12.1500] },
    country: "Bonaire",
    region: "Caribbean",
    difficulty: "beginner",
    depth: { min: 3, max: 18, average: 10 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Tarpon", "Juvenile fish", "Seahorses", "Frogfish", "Angelfish", "Trumpetfish", "Corals", "Sponges"],
    features: ["shore_diving", "macro", "unique_structure", "juvenile_nursery"],
    facilities: ["shore_entry", "parking", "dive_shop_nearby"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.5, count: 789 }
  },

  // Turks and Caicos - Conch Bar Caves
  {
    name: "Conch Bar Caves",
    description: "Underwater cave system with crystal clear freshwater pools and unique geological formations.",
    coordinates: { type: "Point", coordinates: [-71.5500, 21.7500] },
    country: "Turks and Caicos",
    region: "Caribbean",
    difficulty: "advanced",
    depth: { min: 8, max: 30, average: 15 },
    visibility: "excellent",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Cave fish", "Crustaceans", "Unique cave fauna", "Stalactites", "Stalagmites"],
    features: ["cave", "freshwater", "geological", "overhead_environment"],
    facilities: ["guided_tours", "safety_equipment", "cave_diving_specialists"],
    certificationRequired: "Cave Diver",
    waterTemperature: { summer: { min: 24, max: 26 }, winter: { min: 22, max: 24 } },
    rating: { average: 4.9, count: 156 }
  },

  // Cayman Islands - Stingray City
  {
    name: "Stingray City",
    description: "World-famous shallow sandbar where friendly southern stingrays gather for interactions with divers.",
    coordinates: { type: "Point", coordinates: [-81.3833, 19.3500] },
    country: "Cayman Islands",
    region: "Caribbean",
    difficulty: "beginner",
    depth: { min: 3, max: 4, average: 3 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Southern stingrays", "Yellow stingrays", "Tarpon", "Silversides", "Yellowtail snappers", "Sergeant majors"],
    features: ["stingray_interaction", "shallow", "sandbar", "family_friendly"],
    facilities: ["tour_boats", "snorkel_gear", "underwater_cameras"],
    certificationRequired: "Snorkeling or Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.8, count: 2341 }
  },

  // Monterey Bay, California
  {
    name: "Monterey Bay Aquarium",
    description: "World-class kelp forest diving with sea otters, harbor seals, and incredible marine biodiversity.",
    coordinates: { type: "Point", coordinates: [-121.9018, 36.6177] },
    country: "United States",
    region: "California",
    difficulty: "intermediate",
    depth: { min: 10, max: 30, average: 20 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "shore",
    bestMonths: [7, 8, 9, 10, 11],
    marineLife: ["Sea otters", "Harbor seals", "Garibaldi fish", "Rockfish", "Lingcod", "Wolf eels", "Giant Pacific octopus", "Kelp bass"],
    features: ["kelp_forest", "marine_sanctuary", "cold_water", "pinnacles"],
    facilities: ["dive_shop", "equipment_rental", "thick_wetsuits", "guided_tours"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 12, max: 16 }, winter: { min: 10, max: 13 } },
    rating: { average: 4.6, count: 1123 }
  },

  // Catalina Island, California
  {
    name: "Catalina Island Casino Point",
    description: "Protected marine park with giant kelp forests, Garibaldi fish, and excellent visibility.",
    coordinates: { type: "Point", coordinates: [-118.5048, 33.4454] },
    country: "United States",
    region: "California",
    difficulty: "beginner",
    depth: { min: 5, max: 25, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Garibaldi fish", "Moray eels", "Horn sharks", "Bat rays", "Sheephead", "Rockfish", "Sea stars", "Kelp crabs"],
    features: ["kelp_forest", "marine_protected_area", "shore_diving", "clear_water"],
    facilities: ["dive_shop", "equipment_rental", "air_fills", "underwater_park"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 18, max: 22 }, winter: { min: 14, max: 18 } },
    rating: { average: 4.5, count: 987 }
  },

  // Hanauma Bay, Hawaii
  {
    name: "Hanauma Bay Nature Preserve",
    description: "Protected volcanic crater bay with tropical reef fish and sea turtles in shallow, calm waters.",
    coordinates: { type: "Point", coordinates: [-157.6944, 21.2693] },
    country: "United States",
    region: "Hawaii",
    difficulty: "beginner",
    depth: { min: 3, max: 12, average: 8 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Green sea turtles", "Yellow tangs", "Parrotfish", "Triggerfish", "Moorish idols", "Butterflyfish", "Angelfish", "Wrasses"],
    features: ["nature_preserve", "volcanic_crater", "shallow", "educational"],
    facilities: ["snorkel_rental", "educational_center", "restrooms", "parking"],
    certificationRequired: "Snorkeling or Open Water",
    waterTemperature: { summer: { min: 25, max: 27 }, winter: { min: 23, max: 25 } },
    rating: { average: 4.3, count: 3456 }
  },

  // Puget Sound, Washington
  {
    name: "Edmonds Underwater Park",
    description: "Cold water diving with giant Pacific octopus, wolf eels, and diverse marine life in protected waters.",
    coordinates: { type: "Point", coordinates: [-122.3889, 47.8111] },
    country: "United States",
    region: "Washington",
    difficulty: "intermediate",
    depth: { min: 8, max: 25, average: 18 },
    visibility: "fair",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [7, 8, 9, 10],
    marineLife: ["Giant Pacific octopus", "Wolf eels", "Lingcod", "Rockfish", "Dungeness crabs", "Sea stars", "Anemones", "Nudibranchs"],
    features: ["cold_water", "artificial_structures", "macro_life", "underwater_park"],
    facilities: ["dive_shop", "thick_wetsuit_rental", "parking", "restrooms"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 10, max: 14 }, winter: { min: 8, max: 10 } },
    rating: { average: 4.4, count: 567 }
  },

  // Blue Heron Bridge, Florida
  {
    name: "Blue Heron Bridge",
    description: "World-famous shore diving site with incredible macro life and juvenile marine species.",
    coordinates: { type: "Point", coordinates: [-80.0333, 26.7833] },
    country: "United States",
    region: "Florida",
    difficulty: "beginner",
    depth: { min: 3, max: 6, average: 4 },
    visibility: "fair",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Seahorses", "Pipefish", "Juvenile fish", "Octopus", "Rays", "Frogfish", "Nudibranchs", "Crustaceans"],
    features: ["shore_diving", "macro", "juvenile_nursery", "tidal_dependent"],
    facilities: ["parking", "restrooms", "dive_shop_nearby"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.7, count: 1890 }
  },

  // Dutch Springs, Pennsylvania
  {
    name: "Dutch Springs Aqua Park",
    description: "Freshwater quarry with submerged attractions including school bus, helicopter, and training platforms.",
    coordinates: { type: "Point", coordinates: [-75.4500, 40.5833] },
    country: "United States",
    region: "Pennsylvania",
    difficulty: "beginner",
    depth: { min: 5, max: 30, average: 20 },
    visibility: "good",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [5, 6, 7, 8, 9, 10],
    marineLife: ["Freshwater fish", "Bass", "Bluegill", "Carp", "Turtles"],
    features: ["freshwater", "training_site", "submerged_attractions", "quarry"],
    facilities: ["dive_shop", "equipment_rental", "air_fills", "camping"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 18, max: 24 }, winter: { min: 4, max: 8 } },
    rating: { average: 4.1, count: 678 }
  },

  // Lake Tahoe, California/Nevada
  {
    name: "Lake Tahoe - Emerald Bay",
    description: "High-altitude freshwater diving with incredible visibility and submerged forest remnants.",
    coordinates: { type: "Point", coordinates: [-120.1000, 38.9500] },
    country: "United States",
    region: "California/Nevada",
    difficulty: "advanced",
    depth: { min: 10, max: 50, average: 30 },
    visibility: "excellent",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [7, 8, 9],
    marineLife: ["Lake trout", "Kokanee salmon", "Crayfish", "Freshwater species"],
    features: ["high_altitude", "freshwater", "crystal_clear", "submerged_forest"],
    facilities: ["dive_shop", "equipment_rental", "parking"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 15, max: 20 }, winter: { min: 4, max: 6 } },
    rating: { average: 4.5, count: 432 }
  },

  // Outer Banks, North Carolina - USS Monitor
  {
    name: "USS Monitor National Marine Sanctuary",
    description: "Historic Civil War ironclad wreck in challenging offshore conditions for experienced divers.",
    coordinates: { type: "Point", coordinates: [-75.4000, 35.0000] },
    country: "United States",
    region: "North Carolina",
    difficulty: "expert",
    depth: { min: 73, max: 73, average: 73 },
    visibility: "fair",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9],
    marineLife: ["Sand tiger sharks", "Amberjack", "Barracuda", "Cobia", "Sea bass", "Grouper"],
    features: ["historic_wreck", "deep", "strong_currents", "marine_sanctuary"],
    facilities: ["charter_boats", "technical_diving", "nitrox_required"],
    certificationRequired: "Advanced Open Water + Wreck Specialty",
    waterTemperature: { summer: { min: 22, max: 26 }, winter: { min: 16, max: 20 } },
    rating: { average: 4.8, count: 234 }
  },

  // Crystal River, Florida
  {
    name: "Crystal River Manatee Sanctuary",
    description: "Unique snorkeling experience with gentle manatees in warm spring waters during winter months.",
    coordinates: { type: "Point", coordinates: [-82.5833, 28.9000] },
    country: "United States",
    region: "Florida",
    difficulty: "beginner",
    depth: { min: 2, max: 8, average: 4 },
    visibility: "excellent",
    currentStrength: "none",
    entryType: "shore",
    bestMonths: [11, 12, 1, 2, 3],
    marineLife: ["West Indian manatees", "Freshwater fish", "Turtles", "Birds"],
    features: ["manatee_encounters", "freshwater_springs", "shallow", "wildlife_sanctuary"],
    facilities: ["tour_operators", "snorkel_gear", "guided_tours", "educational"],
    certificationRequired: "Snorkeling",
    waterTemperature: { summer: { min: 22, max: 24 }, winter: { min: 22, max: 24 } },
    rating: { average: 4.9, count: 2876 }
  },

  // Door County, Wisconsin
  {
    name: "Cana Island Lighthouse",
    description: "Great Lakes freshwater diving with historic shipwrecks and unique cold-water ecosystem.",
    coordinates: { type: "Point", coordinates: [-87.0333, 45.0833] },
    country: "United States",
    region: "Wisconsin",
    difficulty: "intermediate",
    depth: { min: 8, max: 20, average: 15 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [6, 7, 8, 9],
    marineLife: ["Lake trout", "Whitefish", "Smallmouth bass", "Northern pike", "Freshwater invertebrates"],
    features: ["great_lakes", "freshwater", "lighthouse", "rocky_bottom"],
    facilities: ["dive_shop", "equipment_rental", "boat_launch"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 12, max: 18 }, winter: { min: 2, max: 4 } },
    rating: { average: 4.2, count: 345 }
  },

  // Baa Atoll, Maldives - Hanifaru Bay
  {
    name: "Hanifaru Bay",
    description: "UNESCO Biosphere Reserve famous for manta ray and whale shark feeding aggregations.",
    coordinates: { type: "Point", coordinates: [72.9667, 5.4167] },
    country: "Maldives",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 5, max: 15, average: 10 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Manta rays", "Whale sharks", "Eagle rays", "Grey reef sharks", "Napoleon wrasse", "Tuna", "Barracuda", "Dolphins"],
    features: ["manta_feeding", "whale_sharks", "unesco_site", "seasonal_aggregation"],
    facilities: ["luxury_resorts", "dive_shop", "equipment_rental", "marine_biologist_guides"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.9, count: 1567 }
  },

  // North Malé Atoll, Maldives
  {
    name: "Banana Reef",
    description: "Maldives' first marine protected area with pristine coral formations and abundant marine life.",
    coordinates: { type: "Point", coordinates: [73.5000, 4.1667] },
    country: "Maldives",
    region: "Indian Ocean",
    difficulty: "beginner",
    depth: { min: 5, max: 30, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Bannerfish", "Grouper", "Snappers", "Moray eels", "Napoleon wrasse", "Turtles", "Reef sharks", "Angelfish"],
    features: ["marine_protected_area", "coral_formations", "first_reserve", "diverse_fish"],
    facilities: ["resort_diving", "dive_shop", "equipment_rental", "nitrox"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.6, count: 892 }
  },

  // Fiji - Beqa Lagoon Shark Dive
  {
    name: "Beqa Lagoon Shark Arena",
    description: "World's premier shark diving experience with 8 species including bull sharks and tiger sharks.",
    coordinates: { type: "Point", coordinates: [178.0500, -18.4000] },
    country: "Fiji",
    region: "Pacific Ocean",
    difficulty: "advanced",
    depth: { min: 25, max: 30, average: 28 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Bull sharks", "Tiger sharks", "Grey reef sharks", "Silvertip sharks", "Nurse sharks", "Lemon sharks", "Tawny nurse sharks", "Sicklefin lemon sharks"],
    features: ["shark_feeding", "8_shark_species", "adrenaline", "professional_guides"],
    facilities: ["shark_diving_specialists", "safety_equipment", "dive_shop", "resort_packages"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.9, count: 743 }
  },

  // Palau - Blue Corner
  {
    name: "Blue Corner",
    description: "World-famous drift dive with massive schools of fish, sharks, and strong currents.",
    coordinates: { type: "Point", coordinates: [134.5000, 7.3000] },
    country: "Palau",
    region: "Pacific Ocean",
    difficulty: "advanced",
    depth: { min: 20, max: 40, average: 30 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Grey reef sharks", "Whitetip sharks", "Barracuda tornadoes", "Eagle rays", "Napoleon wrasse", "Tuna", "Jacks", "Bump head parrotfish"],
    features: ["strong_currents", "shark_action", "drift_dive", "reef_hooks"],
    facilities: ["liveaboard", "dive_shop", "nitrox", "experienced_guides"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.8, count: 1234 }
  },

  // Cocos Island, Costa Rica
  {
    name: "Cocos Island",
    description: "Remote Pacific island famous for hammerhead shark schools and pristine marine ecosystem.",
    coordinates: { type: "Point", coordinates: [-87.0333, 5.5333] },
    country: "Costa Rica",
    region: "Pacific Ocean",
    difficulty: "expert",
    depth: { min: 20, max: 40, average: 30 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "liveaboard",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Scalloped hammerheads", "Galapagos sharks", "Silky sharks", "Tiger sharks", "Whale sharks", "Manta rays", "Marble rays", "Yellowfin tuna"],
    features: ["hammerhead_schools", "remote", "unesco_site", "accommodation"],
    facilities: ["liveaboard_vessels", "nitrox", "expert_guides", "remote_location"],
    certificationRequired: "Advanced Open Water + 50 dives",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.9, count: 456 }
  },

  // Marshall Islands - Bikini Atoll
  {
    name: "Bikini Atoll",
    description: "Historic nuclear test site with pristine coral reefs and diverse marine life in remote Pacific.",
    coordinates: { type: "Point", coordinates: [165.3833, 11.5833] },
    country: "Marshall Islands",
    region: "Pacific Ocean",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "liveaboard",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Grey reef sharks", "Silvertip sharks", "Eagle rays", "Napoleon wrasse", "Giant clams", "Coral diversity", "Pelagic species"],
    features: ["historic_site", "pristine_reefs", "remote", "cultural_significance"],
    facilities: ["accommodation", "specialized_tours", "cultural_guides"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.7, count: 234 }
  },

  // French Polynesia - Tiputa Pass, Rangiroa
  {
    name: "Tiputa Pass",
    description: "Famous drift dive through coral atoll pass with dolphins, sharks, and massive fish schools.",
    coordinates: { type: "Point", coordinates: [-147.6500, -14.9667] },
    country: "French Polynesia",
    region: "Pacific Ocean",
    difficulty: "intermediate",
    depth: { min: 20, max: 35, average: 25 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Bottlenose dolphins", "Grey reef sharks", "Silvertip sharks", "Eagle rays", "Barracuda", "Tuna", "Napoleon wrasse", "Grouper"],
    features: ["dolphin_encounters", "pass_diving", "strong_currents", "atoll"],
    facilities: ["dive_shop", "equipment_rental", "dolphin_tours", "resort_diving"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.8, count: 678 }
  },

  // Papua New Guinea - Kimbe Bay
  {
    name: "Kimbe Bay",
    description: "Biodiversity hotspot with pristine reefs, rare macro species, and exceptional coral diversity.",
    coordinates: { type: "Point", coordinates: [150.1333, -5.5500] },
    country: "Papua New Guinea",
    region: "Pacific Ocean",
    difficulty: "intermediate",
    depth: { min: 5, max: 40, average: 20 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Mandarin fish", "Pygmy seahorses", "Walking sharks", "Reef manta rays", "Barracuda", "Trevally", "Soft corals", "Hard corals"],
    features: ["biodiversity_hotspot", "macro_diving", "pristine_reefs", "coral_diversity"],
    facilities: ["eco_resorts", "dive_shop", "marine_biologists", "research_station"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.7, count: 432 }
  },

  // Yap, Micronesia - Manta Ray Bay
  {
    name: "Manta Ray Bay",
    description: "Year-round resident manta ray population at dedicated cleaning stations with guaranteed encounters.",
    coordinates: { type: "Point", coordinates: [138.1333, 9.5167] },
    country: "Micronesia",
    region: "Pacific Ocean",
    difficulty: "beginner",
    depth: { min: 12, max: 18, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Manta rays", "Reef manta rays", "Cleaner wrasse", "Moorish idols", "Butterflyfish", "Angelfish", "Parrotfish", "Grouper"],
    features: ["manta_cleaning_station", "year_round_mantas", "guaranteed_encounters", "shallow"],
    facilities: ["manta_specialists", "dive_shop", "underwater_photography", "manta_education"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.9, count: 1234 }
  },

  // Vanuatu - Million Dollar Point
  {
    name: "Million Dollar Point",
    description: "WWII dumping site with military equipment creating artificial reef and historical underwater museum.",
    coordinates: { type: "Point", coordinates: [167.4167, -15.4833] },
    country: "Vanuatu",
    region: "Pacific Ocean",
    difficulty: "intermediate",
    depth: { min: 10, max: 20, average: 15 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Tropical fish", "Coral encrusted equipment", "Angelfish", "Butterflyfish", "Grouper", "Snappers", "Moray eels"],
    features: ["wwii_history", "artificial_reef", "shore_diving", "historical_artifacts"],
    facilities: ["dive_shop", "equipment_rental", "historical_tours", "shore_entry"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.4, count: 567 }
  },

  // New Caledonia - Prony Bay
  {
    name: "Prony Bay",
    description: "Unique ecosystem with hydrothermal vents, stromatolites, and endemic species in pristine lagoon.",
    coordinates: { type: "Point", coordinates: [167.0000, -22.3333] },
    country: "New Caledonia",
    region: "Pacific Ocean",
    difficulty: "advanced",
    depth: { min: 15, max: 35, average: 25 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Endemic gobies", "Stromatolites", "Hydrothermal vent life", "Nautilus", "Dugongs", "Sea snakes", "Unique invertebrates"],
    features: ["hydrothermal_vents", "endemic_species", "stromatolites", "geological"],
    facilities: ["research_diving", "specialized_guides", "scientific_equipment"],
    certificationRequired: "Advanced Open Water + Specialty",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 21, max: 24 } },
    rating: { average: 4.8, count: 178 }
  },

  // Bahamas - Tiger Beach
  {
    name: "Tiger Beach",
    description: "Famous tiger shark diving destination with predictable encounters in shallow sandy bottom.",
    coordinates: { type: "Point", coordinates: [-79.2500, 26.7500] },
    country: "Bahamas",
    region: "Atlantic Ocean",
    difficulty: "advanced",
    depth: { min: 6, max: 8, average: 7 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Tiger sharks", "Caribbean reef sharks", "Nurse sharks", "Lemon sharks", "Great hammerheads", "Rays", "Grouper"],
    features: ["tiger_sharks", "shallow", "predictable_encounters", "sandy_bottom"],
    facilities: ["liveaboard", "shark_diving_specialists", "safety_equipment"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 23, max: 25 } },
    rating: { average: 4.9, count: 567 }
  },

  // Azores, Portugal - Princess Alice Bank
  {
    name: "Princess Alice Bank",
    description: "Remote Atlantic seamount with mobula ray aggregations and pelagic species encounters.",
    coordinates: { type: "Point", coordinates: [-25.8500, 38.2000] },
    country: "Portugal",
    region: "Atlantic Ocean",
    difficulty: "expert",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10],
    marineLife: ["Mobula rays", "Blue sharks", "Mako sharks", "Sperm whales", "Pilot whales", "Dolphins", "Tuna", "Barracuda"],
    features: ["seamount", "pelagics", "mobula_aggregation", "remote"],
    facilities: ["liveaboard", "experienced_guides", "whale_watching"],
    certificationRequired: "Advanced Open Water + 50 dives",
    waterTemperature: { summer: { min: 18, max: 22 }, winter: { min: 15, max: 17 } },
    rating: { average: 4.8, count: 234 }
  },

  // Galapagos - Darwin's Arch
  {
    name: "Darwin's Arch",
    description: "Legendary hammerhead shark aggregation site with world's largest schools of scalloped hammerheads.",
    coordinates: { type: "Point", coordinates: [-92.0000, 1.6833] },
    country: "Ecuador",
    region: "Pacific Ocean",
    difficulty: "expert",
    depth: { min: 20, max: 40, average: 30 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "liveaboard",
    bestMonths: [6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Scalloped hammerheads", "Galapagos sharks", "Silky sharks", "Whale sharks", "Manta rays", "Eagle rays", "Dolphins", "Sea lions"],
    features: ["hammerhead_schools", "unesco_site", "endemic_species", "strong_currents"],
    facilities: ["accommodation", "nitrox", "expert_guides"],
    certificationRequired: "Advanced Open Water + 50 dives",
    waterTemperature: { summer: { min: 22, max: 25 }, winter: { min: 20, max: 23 } },
    rating: { average: 4.9, count: 456 }
  },

  // Malpelo Island, Colombia
  {
    name: "Malpelo Island",
    description: "Remote Pacific island with massive hammerhead schools and unique endemic species.",
    coordinates: { type: "Point", coordinates: [-81.6000, 4.0000] },
    country: "Colombia",
    region: "Pacific Ocean",
    difficulty: "expert",
    depth: { min: 25, max: 45, average: 35 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "liveaboard",
    bestMonths: [12, 1, 2, 3, 4, 5],
    marineLife: ["Scalloped hammerheads", "Silky sharks", "Galapagos sharks", "Whale sharks", "Manta rays", "Mobula rays", "Yellowfin tuna"],
    features: ["hammerhead_aggregation", "remote", "unesco_site", "endemic_species"],
    facilities: ["accommodation", "technical_diving", "research_station"],
    certificationRequired: "Advanced Open Water + 50 dives",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.8, count: 289 }
  },

  // South Africa - Aliwal Shoal
  {
    name: "Aliwal Shoal",
    description: "Famous for ragged-tooth sharks, whale watching, and diverse marine ecosystem on coral reef.",
    coordinates: { type: "Point", coordinates: [30.9500, -30.1500] },
    country: "South Africa",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 12, max: 27, average: 20 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10, 11],
    marineLife: ["Ragged-tooth sharks", "Bull sharks", "Hammerhead sharks", "Humpback whales", "Dolphins", "Rays", "Turtles", "Grouper"],
    features: ["shark_diving", "whale_migration", "coral_reef", "biodiversity"],
    facilities: ["dive_shop", "shark_cage_diving", "whale_watching", "nitrox"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 21, max: 24 }, winter: { min: 18, max: 21 } },
    rating: { average: 4.6, count: 1234 }
  },

  // Mozambique - Tofo Beach
  {
    name: "Tofo Beach",
    description: "Manta ray and whale shark capital with year-round megafauna encounters and pristine reefs.",
    coordinates: { type: "Point", coordinates: [35.5500, -23.8500] },
    country: "Mozambique",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 8, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Manta rays", "Whale sharks", "Humpback whales", "Dolphins", "Rays", "Reef sharks", "Turtles", "Grouper"],
    features: ["manta_rays", "whale_sharks", "megafauna", "pristine_reefs"],
    facilities: ["dive_shop", "manta_research", "whale_watching", "backpacker_friendly"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 21, max: 24 } },
    rating: { average: 4.7, count: 892 }
  },

  // Sardinia, Italy - Capo Caccia
  {
    name: "Capo Caccia",
    description: "Mediterranean diving with underwater caves, Neptune's Grotto, and diverse marine life.",
    coordinates: { type: "Point", coordinates: [8.1667, 40.5667] },
    country: "Italy",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 10, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [5, 6, 7, 8, 9, 10],
    marineLife: ["Grouper", "Moray eels", "Octopus", "Barracuda", "Amberjack", "Sea fans", "Red coral", "Nudibranchs"],
    features: ["caves", "underwater_grottos", "red_coral", "mediterranean"],
    facilities: ["dive_shop", "cave_diving", "equipment_rental", "boat_charters"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 22, max: 25 }, winter: { min: 14, max: 17 } },
    rating: { average: 4.5, count: 567 }
  },

  // Croatia - Vis Island
  {
    name: "Vis Island Blue Cave",
    description: "Famous blue cave diving with incredible light effects and historic WWII wrecks nearby.",
    coordinates: { type: "Point", coordinates: [16.1833, 43.0667] },
    country: "Croatia",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 5, max: 25, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [5, 6, 7, 8, 9, 10],
    marineLife: ["Grouper", "Scorpionfish", "Octopus", "Moray eels", "Sea bream", "Damselfish", "Mediterranean species"],
    features: ["blue_cave", "light_effects", "historic_wrecks", "crystal_clear"],
    facilities: ["dive_shop", "cave_tours", "wreck_diving", "boat_trips"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 22, max: 25 }, winter: { min: 12, max: 15 } },
    rating: { average: 4.6, count: 743 }
  },

  // Malta - Blue Hole
  {
    name: "Blue Hole Gozo",
    description: "Famous circular limestone arch and tunnel system with azure waters and abundant marine life.",
    coordinates: { type: "Point", coordinates: [14.1833, 36.0667] },
    country: "Malta",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 8, max: 25, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Grouper", "Parrotfish", "Wrasse", "Octopus", "Moray eels", "Sea bream", "Flying gurnards"],
    features: ["limestone_arch", "shore_diving", "azure_window", "tunnels"],
    facilities: ["dive_shop", "shore_entry", "equipment_rental", "diving_courses"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 23, max: 26 }, winter: { min: 16, max: 19 } },
    rating: { average: 4.4, count: 1123 }
  },

  // Cyprus - Zenobia Wreck
  {
    name: "Zenobia Wreck",
    description: "One of the world's top 10 wrecks - Swedish ferry sunk in 1980 with trucks still on board.",
    coordinates: { type: "Point", coordinates: [33.6833, 34.9167] },
    country: "Cyprus",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 16, max: 42, average: 30 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Grouper", "Barracuda", "Tuna", "Jacks", "Moray eels", "Octopus", "Sea bream"],
    features: ["famous_wreck", "trucks_onboard", "penetration", "world_class"],
    facilities: ["dive_shop", "wreck_diving", "nitrox", "technical_diving"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 17, max: 20 } },
    rating: { average: 4.8, count: 987 }
  },

  // Norway - Saltstraumen
  {
    name: "Saltstraumen Maelstrom",
    description: "World's strongest tidal current creates unique diving with massive marine life concentrations.",
    coordinates: { type: "Point", coordinates: [14.6167, 67.2333] },
    country: "Norway",
    region: "Arctic Ocean",
    difficulty: "expert",
    depth: { min: 10, max: 30, average: 20 },
    visibility: "good",
    currentStrength: "extreme",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9],
    marineLife: ["Wolf perch", "Coalfish", "Cod", "Halibut", "King crab", "Sea urchins", "Kelp forests", "Arctic species"],
    features: ["tidal_currents", "arctic_diving", "extreme_conditions", "unique_ecosystem"],
    facilities: ["specialized_operators", "dry_suits", "experienced_guides"],
    certificationRequired: "Advanced Open Water + Drift Specialty",
    waterTemperature: { summer: { min: 8, max: 12 }, winter: { min: 4, max: 6 } },
    rating: { average: 4.7, count: 234 }
  },

  // Iceland - Silfra Fissure
  {
    name: "Silfra Fissure",
    description: "Diving between tectonic plates in crystal clear glacial water with 100m+ visibility.",
    coordinates: { type: "Point", coordinates: [-21.1167, 64.2500] },
    country: "Iceland",
    region: "Atlantic Ocean",
    difficulty: "advanced",
    depth: { min: 7, max: 18, average: 12 },
    visibility: "pristine",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Arctic char", "Sticklebacks", "Algae", "Minimal fauna"],
    features: ["tectonic_plates", "glacial_water", "pristine_visibility", "geological"],
    facilities: ["dry_suit_rental", "specialized_tours", "thermal_protection"],
    certificationRequired: "Dry Suit Specialty",
    waterTemperature: { summer: { min: 2, max: 4 }, winter: { min: 2, max: 3 } },
    rating: { average: 4.6, count: 1567 }
  },

  // Scotland - Scapa Flow
  {
    name: "Scapa Flow",
    description: "Historic WWI German fleet scuttling site with world-class wreck diving in clear waters.",
    coordinates: { type: "Point", coordinates: [-3.2000, 58.9000] },
    country: "United Kingdom",
    region: "Atlantic Ocean",
    difficulty: "advanced",
    depth: { min: 15, max: 45, average: 30 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [5, 6, 7, 8, 9],
    marineLife: ["Seals", "Lobsters", "Crabs", "Cod", "Wrasse", "Sea anemones", "Kelp"],
    features: ["historic_wrecks", "wwi_fleet", "cold_water", "multiple_wrecks"],
    facilities: ["wreck_diving_specialists", "dry_suit_rental", "historic_tours"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 10, max: 14 }, winter: { min: 6, max: 8 } },
    rating: { average: 4.7, count: 567 }
  },

  // Ireland - Malin Head
  {
    name: "Malin Head",
    description: "Ireland's northernmost point with dramatic underwater topography and abundant marine life.",
    coordinates: { type: "Point", coordinates: [-7.3667, 55.3833] },
    country: "Ireland",
    region: "Atlantic Ocean",
    difficulty: "intermediate",
    depth: { min: 12, max: 30, average: 20 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [5, 6, 7, 8, 9, 10],
    marineLife: ["Grey seals", "Basking sharks", "Dolphins", "Lobsters", "Crabs", "Wrasse", "Sea fans"],
    features: ["dramatic_topography", "seal_encounters", "basking_sharks", "kelp_forests"],
    facilities: ["dive_shop", "seal_watching", "boat_charters"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 12, max: 16 }, winter: { min: 8, max: 10 } },
    rating: { average: 4.5, count: 432 }
  },

  // Japan - Yonaguni Monument
  {
    name: "Yonaguni Monument",
    description: "Mysterious underwater rock formation resembling ancient ruins with unique marine ecosystem.",
    coordinates: { type: "Point", coordinates: [122.9500, 24.4500] },
    country: "Japan",
    region: "Pacific Ocean",
    difficulty: "advanced",
    depth: { min: 20, max: 25, average: 23 },
    visibility: "good",
    currentStrength: "strong",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Hammerhead sharks", "Grey reef sharks", "Tuna", "Jacks", "Grouper", "Butterflyfish", "Angelfish"],
    features: ["mysterious_ruins", "archaeological", "strong_currents", "unique_formations"],
    facilities: ["dive_shop", "archaeological_tours", "experienced_guides"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 22, max: 25 } },
    rating: { average: 4.6, count: 678 }
  },

  // Philippines - Donsol
  {
    name: "Donsol Whale Shark Interaction",
    description: "World's largest fish aggregation site with gentle whale shark encounters in shallow waters.",
    coordinates: { type: "Point", coordinates: [123.5833, 12.9167] },
    country: "Philippines",
    region: "Pacific Ocean",
    difficulty: "beginner",
    depth: { min: 3, max: 15, average: 8 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [12, 1, 2, 3, 4, 5],
    marineLife: ["Whale sharks", "Manta rays", "Devil rays", "Tuna", "Jacks", "Tropical reef fish"],
    features: ["whale_shark_interactions", "shallow_encounters", "conservation", "ecotourism"],
    facilities: ["whale_shark_tours", "conservation_center", "local_guides"],
    certificationRequired: "Snorkeling or Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.8, count: 2134 }
  },

  // Indonesia - Lembeh Strait
  {
    name: "Lembeh Strait",
    description: "World capital of macro photography with rare critters and bizarre marine species.",
    coordinates: { type: "Point", coordinates: [125.2333, 1.4500] },
    country: "Indonesia",
    region: "Pacific Ocean",
    difficulty: "intermediate",
    depth: { min: 5, max: 25, average: 15 },
    visibility: "fair",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Mimic octopus", "Frogfish", "Mandarin fish", "Seahorses", "Nudibranchs", "Ghost pipefish", "Rhinopias", "Hairy frogfish"],
    features: ["macro_photography", "rare_critters", "black_sand", "muck_diving"],
    facilities: ["macro_specialists", "underwater_photography", "critter_guides"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 27, max: 29 } },
    rating: { average: 4.9, count: 1456 }
  },

  // Thailand - Koh Phi Phi
  {
    name: "Koh Phi Phi Shark Point",
    description: "Famous limestone pinnacles with leopard sharks, rays, and colorful soft corals.",
    coordinates: { type: "Point", coordinates: [98.7333, 7.7333] },
    country: "Thailand",
    region: "Andaman Sea",
    difficulty: "beginner",
    depth: { min: 12, max: 25, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Leopard sharks", "Stingrays", "Moray eels", "Angelfish", "Butterflyfish", "Grouper", "Soft corals"],
    features: ["limestone_pinnacles", "shark_encounters", "soft_corals", "tropical_paradise"],
    facilities: ["dive_shop", "day_trips", "equipment_rental", "certification_courses"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.4, count: 1567 }
  },

  // Myanmar - Burma Banks
  {
    name: "Burma Banks",
    description: "Remote seamounts with massive pelagic encounters including whale sharks and manta rays.",
    coordinates: { type: "Point", coordinates: [97.5000, 12.5000] },
    country: "Myanmar",
    region: "Andaman Sea",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "strong",
    entryType: "liveaboard",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Whale sharks", "Manta rays", "Silvertip sharks", "Grey reef sharks", "Barracuda", "Tuna", "Eagle rays"],
    features: ["seamounts", "pelagic_encounters", "remote", "strong_currents"],
    facilities: ["accommodation", "experienced_guides", "nitrox"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 26, max: 28 } },
    rating: { average: 4.7, count: 345 }
  },

  // Bangladesh - Saint Martin's Island
  {
    name: "Saint Martin's Island",
    description: "Bangladesh's only coral island with pristine reefs and diverse tropical marine life.",
    coordinates: { type: "Point", coordinates: [92.3167, 20.6167] },
    country: "Bangladesh",
    region: "Bay of Bengal",
    difficulty: "beginner",
    depth: { min: 5, max: 20, average: 12 },
    visibility: "good",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Parrotfish", "Angelfish", "Grouper", "Snappers", "Moray eels", "Rays", "Sea turtles", "Coral species"],
    features: ["coral_island", "pristine_reefs", "tropical_diversity", "unexplored"],
    facilities: ["local_operators", "basic_facilities", "eco_tourism"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.2, count: 234 }
  },

  // Sri Lanka - Kalpitiya
  {
    name: "Kalpitiya Bar Reef",
    description: "Largest coral reef in Sri Lanka with dolphin encounters and diverse marine ecosystem.",
    coordinates: { type: "Point", coordinates: [79.7667, 8.2333] },
    country: "Sri Lanka",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 8, max: 25, average: 15 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Dolphins", "Whales", "Reef sharks", "Grouper", "Snappers", "Angelfish", "Parrotfish", "Sea turtles"],
    features: ["largest_reef", "dolphin_encounters", "whale_watching", "coral_diversity"],
    facilities: ["dolphin_tours", "dive_shop", "whale_watching", "kite_surfing"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.5, count: 567 }
  },

  // India - Netrani Island
  {
    name: "Netrani Island",
    description: "Heart-shaped coral island off Karnataka coast with pristine reefs and clear waters.",
    coordinates: { type: "Point", coordinates: [74.3167, 14.3167] },
    country: "India",
    region: "Arabian Sea",
    difficulty: "beginner",
    depth: { min: 6, max: 20, average: 12 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    marineLife: ["Butterflyfish", "Angelfish", "Grouper", "Snappers", "Parrotfish", "Moray eels", "Rays", "Sea turtles"],
    features: ["heart_shaped", "coral_island", "clear_waters", "pristine_reefs"],
    facilities: ["day_trips", "dive_operators", "basic_facilities"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.3, count: 432 }
  },

  // Oman - Daymaniyat Islands
  {
    name: "Daymaniyat Islands",
    description: "Protected marine reserve with whale sharks, turtles, and pristine coral reefs.",
    coordinates: { type: "Point", coordinates: [58.1000, 23.8500] },
    country: "Oman",
    region: "Arabian Sea",
    difficulty: "intermediate",
    depth: { min: 8, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    marineLife: ["Whale sharks", "Hawksbill turtles", "Green turtles", "Rays", "Grouper", "Snappers", "Angelfish", "Coral species"],
    features: ["marine_reserve", "whale_sharks", "turtle_nesting", "pristine_reefs"],
    facilities: ["dive_operators", "conservation_programs", "research_station"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 28, max: 32 }, winter: { min: 24, max: 27 } },
    rating: { average: 4.6, count: 567 }
  },

  // Jordan - Aqaba
  {
    name: "Aqaba Marine Park",
    description: "Red Sea diving with pristine coral reefs, colorful fish, and excellent visibility year-round.",
    coordinates: { type: "Point", coordinates: [34.9833, 29.5167] },
    country: "Jordan",
    region: "Red Sea",
    difficulty: "beginner",
    depth: { min: 5, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    marineLife: ["Anthias", "Butterflyfish", "Angelfish", "Parrotfish", "Grouper", "Moray eels", "Rays", "Sea turtles"],
    features: ["shore_diving", "coral_gardens", "year_round", "colorful_reefs"],
    facilities: ["dive_centers", "shore_entry", "equipment_rental", "certification"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 25, max: 28 }, winter: { min: 21, max: 24 } },
    rating: { average: 4.4, count: 892 }
  },

  // Sudan - Shaab Rumi
  {
    name: "Shaab Rumi",
    description: "Jacques Cousteau's experimental underwater habitat site with hammerheads and pristine reefs.",
    coordinates: { type: "Point", coordinates: [37.5000, 20.7500] },
    country: "Sudan",
    region: "Red Sea",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "liveaboard",
    bestMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Hammerhead sharks", "Grey reef sharks", "Silvertip sharks", "Barracuda", "Tuna", "Manta rays", "Dolphins"],
    features: ["cousteau_site", "hammerheads", "pristine_reefs", "remote"],
    facilities: ["accommodation", "experienced_guides", "historical_site"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 28, max: 30 }, winter: { min: 24, max: 27 } },
    rating: { average: 4.8, count: 345 }
  },

  // Turkey - Kas
  {
    name: "Kas Amphitheater",
    description: "Mediterranean diving with ancient amphitheater underwater and diverse marine life.",
    coordinates: { type: "Point", coordinates: [29.6333, 36.2000] },
    country: "Turkey",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 10, max: 35, average: 22 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Grouper", "Octopus", "Moray eels", "Sea bream", "Damselfish", "Wrasse", "Sea fans"],
    features: ["ancient_ruins", "amphitheater", "historical", "mediterranean"],
    facilities: ["dive_centers", "historical_tours", "boat_diving"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 16, max: 19 } },
    rating: { average: 4.5, count: 567 }
  },

  // Greece - Zakynthos
  {
    name: "Zakynthos Keri Caves",
    description: "Underwater caves and arches with loggerhead turtle encounters in crystal clear waters.",
    coordinates: { type: "Point", coordinates: [20.7333, 37.6500] },
    country: "Greece",
    region: "Mediterranean",
    difficulty: "intermediate",
    depth: { min: 8, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    marineLife: ["Loggerhead turtles", "Moray eels", "Octopus", "Grouper", "Sea bream", "Damselfish", "Nudibranchs"],
    features: ["underwater_caves", "turtle_encounters", "crystal_clear", "arches"],
    facilities: ["turtle_tours", "cave_diving", "boat_trips"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 23, max: 26 }, winter: { min: 15, max: 18 } },
    rating: { average: 4.6, count: 743 }
  },

  // Spain - Islas Medas
  {
    name: "Islas Medas Marine Reserve",
    description: "Mediterranean marine reserve with grouper encounters, caves, and excellent biodiversity.",
    coordinates: { type: "Point", coordinates: [3.2167, 42.0500] },
    country: "Spain",
    region: "Mediterranean",
    difficulty: "beginner",
    depth: { min: 5, max: 25, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Giant grouper", "Moray eels", "Octopus", "Barracuda", "Sea bream", "Nudibranchs", "Red coral"],
    features: ["marine_reserve", "grouper_encounters", "protected_area", "biodiversity"],
    facilities: ["dive_centers", "marine_education", "research_station"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 22, max: 25 }, winter: { min: 13, max: 16 } },
    rating: { average: 4.5, count: 892 }
  },

  // France - Port-Cros
  {
    name: "Port-Cros National Park",
    description: "France's first marine national park with pristine Mediterranean ecosystems and protected species.",
    coordinates: { type: "Point", coordinates: [6.3833, 43.0000] },
    country: "France",
    region: "Mediterranean",
    difficulty: "beginner",
    depth: { min: 5, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Grouper", "Barracuda", "Sea bream", "Octopus", "Moray eels", "Posidonia seagrass", "Red coral"],
    features: ["national_park", "protected_species", "posidonia_meadows", "pristine"],
    facilities: ["park_rangers", "educational_programs", "research_facilities"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 22, max: 25 }, winter: { min: 13, max: 16 } },
    rating: { average: 4.4, count: 567 }
  },

  // Morocco - Dakhla
  {
    name: "Dakhla Peninsula",
    description: "Atlantic diving with unique cold and warm water mix, diverse marine life and unexplored reefs.",
    coordinates: { type: "Point", coordinates: [-15.9333, 23.7167] },
    country: "Morocco",
    region: "Atlantic Ocean",
    difficulty: "intermediate",
    depth: { min: 8, max: 25, average: 16 },
    visibility: "good",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Grouper", "Sea bream", "Octopus", "Rays", "Small sharks", "Moray eels", "Unique Atlantic species"],
    features: ["water_mix", "unexplored", "unique_ecosystem", "atlantic_species"],
    facilities: ["local_operators", "basic_facilities", "kite_surfing"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 20, max: 24 }, winter: { min: 16, max: 19 } },
    rating: { average: 4.3, count: 234 }
  },

  // Senegal - Goree Island
  {
    name: "Goree Island",
    description: "Historic island with diverse Atlantic marine life and cultural significance.",
    coordinates: { type: "Point", coordinates: [-17.4000, 14.6667] },
    country: "Senegal",
    region: "Atlantic Ocean",
    difficulty: "beginner",
    depth: { min: 6, max: 20, average: 12 },
    visibility: "fair",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Grouper", "Snappers", "Jacks", "Rays", "Small reef sharks", "Tropical Atlantic species"],
    features: ["historic_island", "cultural_significance", "atlantic_diving", "diverse_life"],
    facilities: ["cultural_tours", "local_operators", "historic_sites"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 25, max: 28 }, winter: { min: 20, max: 23 } },
    rating: { average: 4.1, count: 345 }
  },

  // Cape Verde - Sal Island
  {
    name: "Sal Island",
    description: "Atlantic volcanic island diving with nurse sharks, rays, and unique volcanic formations.",
    coordinates: { type: "Point", coordinates: [-22.9333, 16.7500] },
    country: "Cape Verde",
    region: "Atlantic Ocean",
    difficulty: "intermediate",
    depth: { min: 10, max: 30, average: 20 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    marineLife: ["Nurse sharks", "Stingrays", "Moray eels", "Grouper", "Barracuda", "Tuna", "Tropical species"],
    features: ["volcanic_island", "nurse_sharks", "volcanic_formations", "clear_waters"],
    facilities: ["dive_centers", "shark_encounters", "volcanic_tours"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 24, max: 27 }, winter: { min: 20, max: 23 } },
    rating: { average: 4.4, count: 456 }
  },

  // Ghana - Busua Beach
  {
    name: "Busua Beach",
    description: "West African diving with unique tropical Atlantic species and cultural coastal experience.",
    coordinates: { type: "Point", coordinates: [-2.3000, 4.7833] },
    country: "Ghana",
    region: "Atlantic Ocean",
    difficulty: "beginner",
    depth: { min: 5, max: 18, average: 10 },
    visibility: "fair",
    currentStrength: "mild",
    entryType: "shore",
    bestMonths: [11, 12, 1, 2, 3, 4],
    marineLife: ["Snappers", "Grouper", "Jacks", "Rays", "Small sharks", "West African species"],
    features: ["west_africa", "cultural_experience", "tropical_atlantic", "shore_diving"],
    facilities: ["local_guides", "cultural_tours", "basic_facilities"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 23, max: 25 } },
    rating: { average: 4.0, count: 123 }
  },

  // Nigeria - Lagos Lagoon
  {
    name: "Lagos Lagoon",
    description: "Unique brackish water diving with mangrove ecosystems and diverse freshwater-marine mix.",
    coordinates: { type: "Point", coordinates: [3.3833, 6.4500] },
    country: "Nigeria",
    region: "Atlantic Ocean",
    difficulty: "advanced",
    depth: { min: 3, max: 12, average: 8 },
    visibility: "poor",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [11, 12, 1, 2, 3],
    marineLife: ["Brackish species", "Catfish", "Juvenile marine fish", "Crabs", "Mangrove fauna"],
    features: ["brackish_water", "mangroves", "unique_ecosystem", "challenging"],
    facilities: ["specialized_operators", "environmental_education"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 26, max: 29 }, winter: { min: 24, max: 26 } },
    rating: { average: 3.8, count: 89 }
  },

  // Tanzania - Pemba Island
  {
    name: "Pemba Island",
    description: "Pristine coral reefs with diverse marine life, part of the Zanzibar archipelago.",
    coordinates: { type: "Point", coordinates: [39.7500, -5.2000] },
    country: "Tanzania",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 8, max: 30, average: 18 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3],
    marineLife: ["Whale sharks", "Manta rays", "Dolphins", "Reef sharks", "Grouper", "Snappers", "Sea turtles", "Coral diversity"],
    features: ["pristine_reefs", "whale_sharks", "coral_diversity", "remote"],
    facilities: ["eco_resorts", "conservation_programs", "marine_research"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.7, count: 567 }
  },

  // Kenya - Watamu
  {
    name: "Watamu Marine National Park",
    description: "Kenya's premier marine park with pristine coral reefs and diverse Indo-Pacific species.",
    coordinates: { type: "Point", coordinates: [40.0167, -3.3500] },
    country: "Kenya",
    region: "Indian Ocean",
    difficulty: "beginner",
    depth: { min: 5, max: 25, average: 15 },
    visibility: "excellent",
    currentStrength: "mild",
    entryType: "boat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    marineLife: ["Green turtles", "Hawksbill turtles", "Dolphins", "Whale sharks", "Grouper", "Snappers", "Angelfish", "Parrotfish"],
    features: ["marine_park", "turtle_nesting", "pristine_reefs", "conservation"],
    facilities: ["marine_park_facilities", "turtle_conservation", "research_station"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 24, max: 26 } },
    rating: { average: 4.5, count: 743 }
  },

  // Madagascar - Nosy Be
  {
    name: "Nosy Be",
    description: "Madagascar's diving paradise with whale sharks, manta rays, and unique endemic species.",
    coordinates: { type: "Point", coordinates: [48.2667, -13.3167] },
    country: "Madagascar",
    region: "Indian Ocean",
    difficulty: "intermediate",
    depth: { min: 8, max: 35, average: 20 },
    visibility: "excellent",
    currentStrength: "moderate",
    entryType: "boat",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Whale sharks", "Manta rays", "Humpback whales", "Dolphins", "Endemic species", "Grouper", "Tuna", "Reef sharks"],
    features: ["endemic_species", "whale_sharks", "whale_migration", "biodiversity"],
    facilities: ["eco_resorts", "whale_watching", "research_programs"],
    certificationRequired: "Open Water",
    waterTemperature: { summer: { min: 26, max: 28 }, winter: { min: 23, max: 25 } },
    rating: { average: 4.6, count: 456 }
  },

  // Seychelles - Aldabra Atoll
  {
    name: "Aldabra Atoll",
    description: "UNESCO World Heritage pristine atoll with giant tortoises and untouched marine ecosystems.",
    coordinates: { type: "Point", coordinates: [46.3500, -9.4000] },
    country: "Seychelles",
    region: "Indian Ocean",
    difficulty: "advanced",
    depth: { min: 15, max: 40, average: 25 },
    visibility: "pristine",
    currentStrength: "moderate",
    entryType: "liveaboard",
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    marineLife: ["Giant tortoises", "Manta rays", "Whale sharks", "Grey reef sharks", "Eagle rays", "Napoleon wrasse", "Pristine coral"],
    features: ["unesco_site", "pristine_atoll", "giant_tortoises", "remote"],
    facilities: ["accommodation", "research_station", "conservation_programs"],
    certificationRequired: "Advanced Open Water",
    waterTemperature: { summer: { min: 27, max: 29 }, winter: { min: 25, max: 27 } },
    rating: { average: 4.9, count: 123 }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bigblue');

    console.log('🌊 Connected to MongoDB');

    // Clear existing locations
    await Location.deleteMany({});
    console.log('🗑️  Cleared existing locations');

    // Insert seed data
    const locations = await Location.insertMany(diveLocations);
    console.log(`✅ Inserted ${locations.length} dive locations`);

    // Log some sample locations
    console.log('\n📍 Sample locations added:');
    locations.slice(0, 5).forEach(loc => {
      console.log(`  - ${loc.name}, ${loc.country} (${loc.difficulty})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();