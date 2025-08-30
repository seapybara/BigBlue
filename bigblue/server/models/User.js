const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  certificationLevel: {
    type: String,
    required: [true, 'Please provide certification level'],
    enum: {
      values: ['Open Water', 'Advanced Open Water', 'Rescue Diver', 'Dive Master', 'Instructor'],
      message: '{VALUE} is not a valid certification level'
    }
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  numberOfDives: {
    type: Number,
    default: 0,
    min: [0, 'Number of dives cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  location: {
    city: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  preferredDiveTypes: [{
    type: String,
    enum: ['reef', 'wreck', 'cave', 'night', 'drift', 'deep', 'shore', 'boat']
  }],
  languages: [{
    type: String
  }],
  equipment: {
    hasFullSet: {
      type: Boolean,
      default: false
    },
    items: [String]
  },
  profileImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  favoriteSites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for user's buddy requests
userSchema.virtual('buddyRequests', {
  ref: 'BuddyRequest',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Virtual for user's dives
userSchema.virtual('dives', {
  ref: 'Dive',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);