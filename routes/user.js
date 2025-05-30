const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/auth/login');
}


module.exports = router;
