const express = require('express');
const router = express.Router();
const BuddyRequest = require('../models/BuddyRequest');
const { protect } = require('../middleware/auth');

// @desc    Get all buddy requests
// @route   GET /api/buddy-requests
router.get('/', async (req, res) => {
  try {
    const buddyRequests = await BuddyRequest.find({ status: 'active' })
      .populate('requester', 'name certificationLevel experienceLevel numberOfDives')
      .populate('location', 'name country difficulty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: buddyRequests.length,
      data: buddyRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving buddy requests'
    });
  }
});

// @desc    Create buddy request
// @route   POST /api/buddy-requests
router.post('/', protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: 'test_buddy_request_id',
      requester: req.user.id,
      location: req.body.locationId,
      ...req.body
    }
  });
});

// @desc    Get my requests
// @route   GET /api/buddy-requests/my/requests
router.get('/my/requests', protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      myRequests: [],
      joinedRequests: [],
      pendingRequests: []
    }
  });
});

// @desc    Get single request
// @route   GET /api/buddy-requests/:id
router.get('/:id', async (req, res) => {
  try {
    const buddyRequest = await BuddyRequest.findById(req.params.id)
      .populate('requester', 'name certificationLevel experienceLevel numberOfDives')
      .populate('location', 'name country difficulty')
      .populate('responses.responder', 'name certificationLevel experienceLevel');

    if (!buddyRequest) {
      return res.status(404).json({
        success: false,
        message: 'Buddy request not found'
      });
    }

    res.json({
      success: true,
      data: buddyRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving buddy request'
    });
  }
});

// @desc    Update request
// @route   PUT /api/buddy-requests/:id
router.put('/:id', protect, async (req, res) => {
  res.json({
    success: true,
    data: { _id: req.params.id, ...req.body }
  });
});

// @desc    Delete request
// @route   DELETE /api/buddy-requests/:id
router.delete('/:id', protect, async (req, res) => {
  res.json({
    success: true,
    message: 'Buddy request cancelled'
  });
});

module.exports = router;