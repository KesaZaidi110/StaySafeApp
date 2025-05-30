const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { sendAlertEmail } = require('../services/emailService');

router.post('/report', async (req, res) => {
  const { type, message, level, coordinates } = req.body;

  // Validate coordinates: expect array [longitude, latitude]
  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).send('Invalid coordinates');
  }

  const alert = new Alert({
  type: req.body.type,
  description: req.body.description,
  locationName: req.body.location, 
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  }
});

  try {
    await alert.save();
    console.log(`🔔 Crime alert saved for: ${type}`);

    // Send alert email with full alert object
    await sendAlertEmail('thesupergadgets82@gmail.com', alert);

    res.status(200).send('Alert reported and email sent!');
  } catch (err) {
    console.error('Error saving alert or sending email:', err);
    res.status(500).send('Error reporting alert');
  }
});

module.exports = router;
