const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup form
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Signup POST
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = new User({ username, email, password, role });
    await user.save();
    res.redirect('/signin');
  } catch (error) {
    res.render('signup', { error: 'Error creating user. Try again.' });
  }
});

// Signin form
router.get('/signin', (req, res) => {
  res.render('signin', { error: null });
});

// Signin POST
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render('signin', { error: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.render('signin', { error: 'Invalid email or password' });

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    if (user.role === 'admin') return res.redirect('/admin');
    res.redirect('/user/dashboard');
  } catch {
    res.render('signin', { error: 'Something went wrong' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
