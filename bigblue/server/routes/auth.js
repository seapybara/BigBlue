const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Location = require('../models/Location');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, certificationLevel, experienceLevel, numberOfDives } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      certificationLevel,
      experienceLevel,
      numberOfDives: numberOfDives || 0
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        certificationLevel: user.certificationLevel,
        experienceLevel: user.experienceLevel,
        numberOfDives: user.numberOfDives
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      errors: error.errors ? Object.values(error.errors).map(e => e.message) : []
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        certificationLevel: user.certificationLevel,
        experienceLevel: user.experienceLevel,
        numberOfDives: user.numberOfDives
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching user data',
      message: error.message 
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
router.put('/updateprofile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      location: req.body.location,
      certificationLevel: req.body.certificationLevel,
      experienceLevel: req.body.experienceLevel,
      numberOfDives: req.body.numberOfDives
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide current and new password' 
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Generate new token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Add dive site to favorites
// @route   POST /api/auth/favorites/:locationId
// @access  Private
router.post('/favorites/:locationId', protect, async (req, res) => {
  try {
    const { locationId } = req.params;

    // Check if location exists
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    // Check if already in favorites
    const user = await User.findById(req.user.id);
    if (user.favoriteSites.includes(locationId)) {
      return res.status(400).json({ success: false, error: 'Location already in favorites' });
    }

    // Add to favorites
    user.favoriteSites.push(locationId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location added to favorites'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Remove dive site from favorites
// @route   DELETE /api/auth/favorites/:locationId
// @access  Private
router.delete('/favorites/:locationId', protect, async (req, res) => {
  try {
    const { locationId } = req.params;

    const user = await User.findById(req.user.id);
    user.favoriteSites.pull(locationId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get user's favorite dive sites
// @route   GET /api/auth/favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteSites');
    
    res.status(200).json({
      success: true,
      data: user.favoriteSites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;