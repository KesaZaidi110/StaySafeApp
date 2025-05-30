const express = require('express');
const router = express.Router();
const CrimeReport = require('../models/CrimeReport');

// Middleware to protect admin routes
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login'); // redirect to login if not admin
}

// Admin dashboard route
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    const reports = await CrimeReport.find()
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });

    res.render('adminDashboard', { reports });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).send('Server error while loading admin dashboard');
  }
});

// Delete report route
router.post('/delete/:id', ensureAdmin, async (req, res) => {
  try {
    await CrimeReport.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).send('Server Error');
  }
});

// ✅ Updated: Respond to report route
// Respond to report route
router.post('/respond/:id', ensureAdmin, async (req, res) => {
  try {
    const report = await CrimeReport.findById(req.params.id);
    if (!report) return res.status(404).send('Report not found');

    report.response = {
      message: req.body.message,
      respondedAt: new Date(),
      respondedBy: req.session.user._id
    };
    await report.save();

    req.flash('success_msg', 'Response sent to the user successfully!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error responding to report:', error);
    req.flash('error_msg', 'Something went wrong while sending response.');
    res.redirect('/admin/dashboard');
  }
});


module.exports = router;
