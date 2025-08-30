const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { protect } = require('../middleware/auth');

// @route   GET /api/locations
// @desc    Get all locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      country, 
      difficulty, 
      features, 
      minDepth, 
      maxDepth,
      search 
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (country) query.country = country;
    if (difficulty) query.difficulty = difficulty;
    if (features) query.features = { $in: features.split(',') };
    if (minDepth) query['depth.min'] = { $gte: parseInt(minDepth) };
    if (maxDepth) query['depth.max'] = { $lte: parseInt(maxDepth) };
    
    // Text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    const locations = await Location.find(query)
      .select('-__v');
      // .populate('upcomingBuddyRequests'); // Commented out until BuddyRequest is set up

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET /api/locations/nearby
// @desc    Get nearby locations
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, distance = 50000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const locations = await Location.findNearby(
      parseFloat(lng), 
      parseFloat(lat), 
      parseInt(distance)
    );

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (err) {
    console.error('Get nearby locations error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby locations'
    });
  }
});

// @route   GET /api/locations/:id
// @desc    Get single location
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
      // .populate({
      //   path: 'upcomingBuddyRequests',
      //   populate: {
      //     path: 'userId',
      //     select: 'name certificationLevel experienceLevel numberOfDives'
      //   }
      // }); // Commented out until BuddyRequest is set up

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (err) {
    console.error('Get location error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching location'
    });
  }
});

// @route   GET /api/locations/countries/list
// @desc    Get list of countries with dive sites
// @access  Public
router.get('/countries/list', async (req, res) => {
  try {
    const countries = await Location.distinct('country');
    
    res.json({
      success: true,
      data: countries.sort()
    });
  } catch (err) {
    console.error('Get countries error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching countries'
    });
  }
});

// @route   POST /api/locations/:id/rate
// @desc    Rate a location
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Update rating
    const newCount = location.rating.count + 1;
    const newAverage = ((location.rating.average * location.rating.count) + rating) / newCount;

    location.rating = {
      average: newAverage,
      count: newCount
    };

    await location.save();

    res.json({
      success: true,
      data: location.rating
    });
  } catch (err) {
    console.error('Rate location error:', err);
    res.status(500).json({
      success: false,
      message: 'Error rating location'
    });
  }
});

module.exports = router;