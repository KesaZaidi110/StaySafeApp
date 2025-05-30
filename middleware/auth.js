// middleware/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// Middleware to restrict access to admins only
function ensureAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied. Admins only.');
}

// Middleware to restrict access to users only
function ensureUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'user') {
    return next();
  }
  res.status(403).send('Access denied. Users only.');
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  ensureUser
};
