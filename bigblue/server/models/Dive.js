const mongoose = require('mongoose');

const diveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  buddyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buddyRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuddyRequest'
  },
  date: {
    type: Date,
    required: [true, 'Please provide dive date'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Dive date cannot be in the future for logged dives'
    }
  },
  entryTime: {
    type: String,
    required: true
  },
  exitTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: [5, 'Dive duration must be at least 5 minutes'],
    max: [300, 'Dive duration cannot exceed 300 minutes']
  },
  maxDepth: {
    type: Number, // in meters
    required: [true, 'Please provide maximum depth'],
    min: [1, 'Depth must be at least 1 meter'],
    max: [60, 'Recreational diving limit is 60 meters']
  },
  averageDepth: {
    type: Number,
    min: 1
  },
  waterTemperature: {
    type: Number, // in Celsius
    min: [-2, 'Water temperature too low'],
    max: [40, 'Water temperature too high']
  },
  visibility: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true
  },
  current: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'strong']
  },
  diveType: {
    type: String,
    enum: ['reef', 'wreck', 'cave', 'night', 'drift', 'deep', 'shore', 'boat', 'training'],
    required: true
  },
  airUsed: {
    start: {
      type: Number, // in bar/psi
      min: 0
    },
    end: {
      type: Number, // in bar/psi
      min: 0
    },
    type: {
      type: String,
      enum: ['air', 'nitrox', 'trimix'],
      default: 'air'
    }
  },
  equipment: {
    wetsuit: {
      type: String,
      enum: ['none', '3mm', '5mm', '7mm', 'drysuit']
    },
    weight: {
      type: Number, // in kg
      min: 0,
      max: 30
    },
    computer: Boolean,
    camera: Boolean,
    additionalGear: [String]
  },
  wildlife: [{
    species: String,
    count: Number
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  photos: [{
    url: String,
    caption: String
  }],
  conditions: {
    weather: String,
    seaState: String,
    notes: String
  },
  safety: {
    incidents: {
      type: Boolean,
      default: false
    },
    incidentDetails: String,
    decoStops: {
      type: Boolean,
      default: false
    },
    safetyStop: {
      type: Boolean,
      default: true
    }
  },
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    visibility: {
      type: Number,
      min: 1,
      max: 5
    },
    marineLife: {
      type: Number,
      min: 1,
      max: 5
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  buddyReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    safety: {
      type: Number,
      min: 1,
      max: 5
    },
    skills: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    wouldDiveAgain: {
      type: Boolean
    },
    comments: {
      type: String,
      maxlength: 300
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  diveNumber: {
    type: Number
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
diveSchema.index({ userId: 1, date: -1 });
diveSchema.index({ locationId: 1 });
diveSchema.index({ buddyId: 1 });

// Calculate duration from entry and exit times
diveSchema.pre('save', function(next) {
  if (this.entryTime && this.exitTime) {
    const entry = new Date(`2000-01-01 ${this.entryTime}`);
    const exit = new Date(`2000-01-01 ${this.exitTime}`);
    let duration = (exit - entry) / 60000; // Convert to minutes
    
    // Handle dives that cross midnight
    if (duration < 0) {
      duration += 1440; // Add 24 hours in minutes
    }
    
    this.duration = duration;
  }
  next();
});

// Update user's dive count after saving
diveSchema.post('save', async function() {
  const User = mongoose.model('User');
  const diveCount = await this.constructor.countDocuments({ userId: this.userId });
  await User.findByIdAndUpdate(this.userId, { numberOfDives: diveCount });
});

// Static method to get dive statistics for a user
diveSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalDives: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        maxDepth: { $max: '$maxDepth' },
        averageDepth: { $avg: '$averageDepth' },
        averageDuration: { $avg: '$duration' },
        uniqueLocations: { $addToSet: '$locationId' },
        uniqueBuddies: { $addToSet: '$buddyId' }
      }
    }
  ]);
  
  return stats[0] || {
    totalDives: 0,
    totalDuration: 0,
    maxDepth: 0,
    averageDepth: 0,
    averageDuration: 0,
    uniqueLocations: [],
    uniqueBuddies: []
  };
};

module.exports = mongoose.model('Dive', diveSchema);