const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CrimeReport = require('../models/CrimeReport');
const User = require('../models/user');
const Alert = require('../models/Alert');
const { ensureAuthenticated } = require('../middleware/auth');


router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    const reports = await CrimeReport.find({ reportedBy: user._id }).sort({ createdAt: -1 });

    res.render('dashboard', {
      user,
      reports
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error while loading dashboard');
  }
});


router.post('/location', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ message: 'Invalid coordinates' });
  }

  try {
    // Save the location to user document
    const User = require('../models/user');
    await User.findByIdAndUpdate(req.session.user._id, {
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });
    res.json({ message: 'Location updated' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// POST route for sending alert
router.post('/send-alert', async (req, res) => {
  try {
    const { title, message, location } = req.body;

    const alertData = {
      title,
      message,
      createdAt: new Date()
    };

    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      alertData.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }

    await Alert.create(alertData);
    req.flash('success_msg', '✅ Alert sent successfully!');
    res.redirect('/');
  } catch (err) {
    console.error('Error sending alert:', err);
    req.flash('error_msg', '❌ Failed to send alert.');
    res.redirect('/');
  }
});

module.exports = router;



module.exports = router;
