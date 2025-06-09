const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

// Admin dashboard - show listings + all bookings
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    const bookings = await Booking.find()
      .populate('user', 'username')      // Populate only username from user
      .populate('listing', 'title');     // Populate only title from listing

    res.render('admin/dashboard', {
      user: req.session.user,
      listings,
      bookings
    });
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
    res.send('Error loading admin dashboard');
  }
});

// Show new listing form
router.get('/new-listing', isAuthenticated, isAdmin, (req, res) => {
  res.render('admin/new-listing', { user: req.session.user, error: null });
});

// Create new listing
router.post('/new-listing', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, location, price } = req.body;
    const listing = new Listing({ title, description, location, price });
    await listing.save();
    res.redirect('/admin');
  } catch {
    res.render('admin/new-listing', {
      user: req.session.user,
      error: 'Failed to create listing'
    });
  }
});

// Show edit listing form
router.get('/edit-listing/:id', isAuthenticated, isAdmin, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.redirect('/admin');
  res.render('admin/edit-listing', {
    user: req.session.user,
    listing,
    error: null
  });
});

// Update listing
router.post('/edit-listing/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, location, price } = req.body;
    await Listing.findByIdAndUpdate(req.params.id, {
      title,
      description,
      location,
      price
    });
    res.redirect('/admin');
  } catch {
    const listing = await Listing.findById(req.params.id);
    res.render('admin/edit-listing', {
      user: req.session.user,
      listing,
      error: 'Failed to update listing'
    });
  }
});

// Delete listing
router.post('/delete-listing/:id', isAuthenticated, isAdmin, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Separate bookings page (optional if you're already showing it on dashboard)
router.get('/bookings', isAuthenticated, isAdmin, async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'username')
    .populate('listing', 'title');
  res.render('admin/bookings', { bookings });
});

module.exports = router;
