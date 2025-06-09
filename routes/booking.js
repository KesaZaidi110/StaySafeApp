const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Booking = require('../models/Booking'); // Make sure this model exists


// Show booking form
router.get('/book/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.send('Listing not found');
    res.render('bookings/new', { listing, currentUser: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading booking form');
  }
});

// Handle booking form submission
router.post('/book/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.send('Listing not found');

    const newBooking = new Booking({
      user: req.session.user._id,
      listing: listing._id,
      checkIn: new Date(req.body.checkIn),
checkOut: new Date(req.body.checkOut),

      paymentMethod: req.body.paymentMethod,
      name: req.body.name
    });

    await newBooking.save();
    res.redirect('/booking-success');
  } catch (err) {
    console.error('Error saving booking:', err);
    res.send('Error processing booking');
  }
});

// Booking success page
router.get('/booking-success', (req, res) => {
  res.render('bookings/success', { user: req.session.user });
});


module.exports = router;
