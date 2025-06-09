function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/signin');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).send('Access denied');
}

function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === 'user') return next();
  res.status(403).send('Access denied');
}

module.exports = { isAuthenticated, isAdmin, isUser };
