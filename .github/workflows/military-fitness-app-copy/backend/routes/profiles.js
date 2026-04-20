const express = require('express');
const Profile = require('../models/Profile');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update profile
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, age, height, weight, waist } = req.body;

    let profile = await Profile.findOne({ userId: req.userId });
    if (profile) {
      profile.name = name || profile.name;
      profile.age = age || profile.age;
      profile.height = height || profile.height;
      profile.weight = weight || profile.weight;
      profile.waist = waist || profile.waist;
      profile.updatedAt = Date.now();
    } else {
      profile = new Profile({
        userId: req.userId,
        name,
        age,
        height,
        weight,
        waist,
      });
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all profiles (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('userId', 'email name');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user profile (by user ID)
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
