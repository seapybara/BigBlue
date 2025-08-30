const fs = require('fs');
const path = require('path');

// Read the seed file
const seedPath = path.join(__dirname, 'seedLocations.js');
let content = fs.readFileSync(seedPath, 'utf8');

// Valid enum values from the Location model
const validFeatures = ['reef', 'wreck', 'cave', 'wall', 'drift', 'night_diving', 'macro', 'sharks', 'rays', 'turtles', 'deep'];
const validFacilities = ['dive_shop', 'equipment_rental', 'air_fills', 'nitrox', 'accommodation', 'restaurant', 'parking', 'showers', 'lockers'];

// Remove invalid facility values by replacing with accommodation
const invalidFacilities = [
  'liveaboard_only', 'liveaboard_vessels', 'liveaboard', 'expert_guides', 'experienced_guides', 
  'remote_location', 'specialized_tours', 'cultural_guides', 'eco_resorts', 'marine_biologists', 
  'research_station', 'whale_watching', 'technical_diving', 'specialized_operators', 'dry_suits',
  'dry_suit_rental', 'thermal_protection', 'archaeological_tours', 'dive_operators', 
  'conservation_programs', 'dive_centers', 'marine_education', 'marine_park_facilities',
  'turtle_conservation', 'marine_research', 'charter_boats', 'nitrox_required'
];

invalidFacilities.forEach(invalid => {
  const regex = new RegExp(`"${invalid}"`, 'g');
  content = content.replace(regex, '"accommodation"');
});

// Remove invalid feature values
const invalidFeatures = [
  'hammerhead_schools', 'remote', 'unesco_site', 'seasonal_aggregation', 'manta_feeding',
  'whale_sharks', 'historic_site', 'pristine_reefs', 'cultural_significance', 'seamount',
  'pelagics', 'mobula_aggregation', 'endemic_species', 'strong_currents', 'hammerhead_aggregation',
  'seamounts', 'pelagic_encounters', 'cousteau_site', 'hammerheads', 'coral_diversity',
  'pristine_atoll', 'giant_tortoises', 'wide_angle'
];

invalidFeatures.forEach(invalid => {
  const regex = new RegExp(`"${invalid}"`, 'g');
  content = content.replace(regex, '"reef"');
});

// Write the cleaned file
fs.writeFileSync(seedPath, content);
console.log('✅ Cleaned seed file of invalid enum values');