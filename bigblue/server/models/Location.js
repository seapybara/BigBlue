const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide location name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide location description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  country: {
    type: String,
    required: [true, 'Please provide country']
  },
  region: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'expert'],
      message: '{VALUE} is not a valid difficulty level'
    }
  },
  depth: {
    min: {
      type: Number,
      required: true,
      min: [0, 'Minimum depth cannot be negative']
    },
    max: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return value >= this.depth.min;
        },
        message: 'Maximum depth must be greater than minimum depth'
      }
    },
    average: {
      type: Number
    }
  },
  visibility: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'variable'],
    default: 'good'
  },
  currentStrength: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'strong', 'variable'],
    default: 'mild'
  },
  entryType: {
    type: String,
    enum: ['shore', 'boat', 'both'],
    default: 'boat'
  },
  bestMonths: [{
    type: Number,
    min: 1,
    max: 12
  }],
  marineLife: [{
    type: String
  }],
  features: [{
    type: String,
    enum: ['reef', 'wreck', 'cave', 'wall', 'drift', 'night_diving', 'macro', 'sharks', 'rays', 'turtles', 'deep']
  }],
  facilities: [{
    type: String,
    enum: ['dive_shop', 'equipment_rental', 'air_fills', 'nitrox', 'accommodation', 'restaurant', 'parking', 'showers', 'lockers']
  }],
  certificationRequired: {
    type: String,
    enum: ['Open Water', 'Advanced Open Water', 'Rescue Diver', 'Dive Master', 'Technical'],
    default: 'Open Water'
  },
  images: [{
    url: String,
    caption: String
  }],
  waterTemperature: {
    summer: {
      min: Number,
      max: Number
    },
    winter: {
      min: Number,
      max: Number
    }
  },
  hazards: [{
    type: String
  }],
  localRegulations: {
    type: String,
    maxlength: [500, 'Regulations cannot be more than 500 characters']
  },
  nearbyDiveSites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
locationSchema.index({ 'coordinates.coordinates': '2dsphere' });
locationSchema.index({ country: 1, region: 1 });
locationSchema.index({ name: 'text', description: 'text' });

// Virtual for upcoming buddy requests at this location
// Commented out until BuddyRequest routes are implemented
// locationSchema.virtual('upcomingBuddyRequests', {
//   ref: 'BuddyRequest',
//   localField: '_id',
//   foreignField: 'locationId',
//   justOne: false,
//   match: { 
//     status: 'open',
//     diveDate: { $gte: new Date() }
//   }
// });

// Static method to find nearby locations
locationSchema.statics.findNearby = function(longitude, latitude, maxDistance = 50000) {
  return this.find({
    'coordinates.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

module.exports = mongoose.model('Location', locationSchema);