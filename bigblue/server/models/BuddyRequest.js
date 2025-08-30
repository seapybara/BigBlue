// server/models/BuddyRequest.js
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  responder: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxlength: [500, 'Response message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

const BuddyRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: [true, 'Location is required']
  },
  message: {
    type: String,
    required: [true, 'Please add a message for your buddy request'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  preferredDates: {
    start: {
      type: Date,
      required: [true, 'Please specify preferred start date']
    },
    end: {
      type: Date,
      required: [true, 'Please specify preferred end date']
    },
    flexible: {
      type: Boolean,
      default: false
    }
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Experience level is required']
  },
  diveType: {
    type: String,
    enum: ['recreational', 'technical', 'wreck', 'cave', 'night', 'deep', 'drift'],
    default: 'recreational'
  },
  maxGroupSize: {
    type: Number,
    min: [2, 'Group size must be at least 2'],
    max: [10, 'Group size cannot exceed 10'],
    default: 4
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  responses: [ResponseSchema],
  tags: [{
    type: String,
    lowercase: true
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  additionalNotes: {
    equipment: String,
    transportation: String,
    accommodation: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for efficient querying
BuddyRequestSchema.index({ location: 1, status: 1 });
BuddyRequestSchema.index({ requester: 1 });
BuddyRequestSchema.index({ 'preferredDates.start': 1, 'preferredDates.end': 1 });
BuddyRequestSchema.index({ experienceLevel: 1, diveType: 1 });
BuddyRequestSchema.index({ createdAt: -1 });

// Virtual for accepted responses count
BuddyRequestSchema.virtual('acceptedResponsesCount').get(function() {
  return this.responses.filter(response => response.status === 'accepted').length;
});

// Virtual for pending responses count
BuddyRequestSchema.virtual('pendingResponsesCount').get(function() {
  return this.responses.filter(response => response.status === 'pending').length;
});

// Virtual to check if request is full
BuddyRequestSchema.virtual('isFull').get(function() {
  return this.acceptedResponsesCount >= (this.maxGroupSize - 1); // -1 because requester counts
});

// Virtual to check if request is expired
BuddyRequestSchema.virtual('isExpired').get(function() {
  return new Date() > this.preferredDates.end;
});

// Virtual for days until dive
BuddyRequestSchema.virtual('daysUntilDive').get(function() {
  const now = new Date();
  const startDate = new Date(this.preferredDates.start);
  const diffTime = startDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to handle status updates
BuddyRequestSchema.pre('save', function(next) {
  // Mark as expired if past end date
  if (new Date() > this.preferredDates.end && this.status === 'active') {
    this.status = 'expired';
  }
  
  // Mark as completed if group is full
  if (this.isFull && this.status === 'active') {
    this.status = 'completed';
  }
  
  next();
});

// Static method to find matches for a user
BuddyRequestSchema.statics.findMatches = async function(userId, locationId, userExperienceLevel, dateFrom, dateTo) {
  const compatibleLevels = getCompatibleExperienceLevels(userExperienceLevel);
  
  let query = {
    location: locationId,
    status: 'active',
    requester: { $ne: userId },
    experienceLevel: { $in: compatibleLevels }
  };

  // Add date overlap filtering
  if (dateFrom && dateTo) {
    query.$or = [
      {
        'preferredDates.start': { $lte: new Date(dateTo) },
        'preferredDates.end': { $gte: new Date(dateFrom) }
      }
    ];
  }

  return this.find(query)
    .populate('requester', 'name certificationLevel experienceLevel numberOfDives')
    .populate('location', 'name country difficulty')
    .sort({ createdAt: -1 });
};

// Instance method to check if user can respond
BuddyRequestSchema.methods.canUserRespond = function(userId) {
  // Check if it's the requester's own request
  if (this.requester.toString() === userId.toString()) {
    return { canRespond: false, reason: 'Cannot respond to your own request' };
  }
  
  // Check if request is active
  if (this.status !== 'active') {
    return { canRespond: false, reason: 'Request is no longer active' };
  }
  
  // Check if user already responded
  const existingResponse = this.responses.find(
    response => response.responder.toString() === userId.toString()
  );
  
  if (existingResponse) {
    return { canRespond: false, reason: 'Already responded to this request' };
  }
  
  // Check if request is full
  if (this.isFull) {
    return { canRespond: false, reason: 'Request is already full' };
  }
  
  return { canRespond: true };
};

// Instance method to get response by user
BuddyRequestSchema.methods.getResponseByUser = function(userId) {
  return this.responses.find(
    response => response.responder.toString() === userId.toString()
  );
};

// Helper function for compatible experience levels
function getCompatibleExperienceLevels(userLevel) {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const userIndex = levels.indexOf(userLevel);
  
  let compatible = [userLevel];
  
  // Beginners can dive with intermediates
  if (userLevel === 'beginner') {
    compatible.push('intermediate');
  }
  // Intermediates can dive with beginners and advanced
  else if (userLevel === 'intermediate') {
    compatible.push('beginner', 'advanced');
  }
  // Advanced can dive with intermediates and experts
  else if (userLevel === 'advanced') {
    compatible.push('intermediate', 'expert');
  }
  // Experts can dive with advanced
  else if (userLevel === 'expert') {
    compatible.push('advanced');
  }
  
  return compatible;
}

module.exports = mongoose.model('BuddyRequest', BuddyRequestSchema);