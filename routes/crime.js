const express = require('express');
const CrimeReport = require('../models/CrimeReport');
const Alert = require('../models/Alert');
const User = require('../models/User');

const router = express.Router();

// Report a Crime
router.post('/report', async (req, res) => {
  const { crimeType, description, location } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const crimeReport = new CrimeReport({
    crimeType,
    description,
    location,
    reportedBy: user._id,
  });

  await crimeReport.save();
  res.status(201).json({ message: 'Crime report submitted successfully' });
});

// Get All Crime Reports
router.get('/crime-reports', async (req, res) => {
  const reports = await CrimeReport.find();
  res.json(reports);
});

// Get All Alerts
router.get('/alerts', async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

module.exports = router;
