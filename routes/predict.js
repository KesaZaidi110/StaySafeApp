const express = require('express');
const router = express.Router();
const { sendAlertEmail } = require('../services/emailService');
const Alert = require('../models/Alert');

router.post('/predict-crime', async (req, res) => {
   console.log('📩 req.body:', req.body);
  try {
    const location = req.body.location || 'Unknown';

    
    const crimePredicted = true;

    if (crimePredicted) {
      // Prepare alert object with coordinates if available
      const alertData = {
        type: 'Predicted Crime',
        location: typeof location === 'string' ? location : location, // can be improved later
        message: `A potential crime has been detected at ${location}. Immediate response is advised.`,
        reason: 'AI predicted potential crime based on recent activity',
        createdAt: new Date(),
      };

      // Save alert in DB
      await Alert.create({
        location: alertData.location,
        reason: alertData.reason,
        createdAt: alertData.createdAt,
      });

      // Send alert email 
      await sendAlertEmail('thesupergadgets82@gmail.com', alertData);

      console.log(`🔔 Crime alert sent and saved for: ${location}`);
      return res.redirect('/?alert=sent');
    } else {
      return res.redirect('/?alert=no-threat');
    }
  } catch (err) {
    console.error('❌ Error in /predict-crime:', err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;
