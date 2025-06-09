const express = require('express');
const router = express.Router();
const { isAuthenticated, isUser } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// User dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user._id }).populate('listing');
    res.render('user/dashboard', {
      user: req.session.user,
      bookings
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.send('Error loading dashboard');
  }
});



router.get('/profile', isAuthenticated, isUser, async (req, res) => {
  const userId = req.session.user.id;
  const bookings = await Booking.find({ userId }).populate('listingId');
  res.render('user/profile', { user: req.session.user, bookings });
});



router.get('/book/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id);
   res.render('bookings/new', {
    listing,
    currentUser: req.session.user || null
  });
//   res.render('bookings/new', { listing });
 });


 router.post('/book/:id', async (req, res) => {
  const { name, checkin, checkout, paymentMethod } = req.body;
  const listingId = req.params.id;

  await Booking.create({
    listing: listingId,
    user: req.session.user?._id || null,
    name,
    checkin,
    checkout,
    paymentMethod
  });

  res.send('Booking confirmed!'); // Later redirect to dashboard or confirmation page
});


router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/signin');
  const bookings = await Booking.find({ user: req.session.user._id }).populate('listing');
  res.render('user/dashboard', { user: req.session.user, bookings });
});
module.exports = router;
