const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// Render Register Page
router.get('/login', (req, res) => {
  res.render('login', { 
    activePage: 'login',
    recentAlerts: []  
  });
});




router.get('/', (req, res) => {
  res.render('home', { activePage: 'home' });
});

router.get('/alerts', (req, res) => {
  res.render('alerts', { activePage: 'alerts' });
});

router.get('/register', (req, res) => {
  res.render('register', { activePage: 'register' });
});



// GET /logout -
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
});

router.post('/register', async (req, res) => {
  try {

     console.log('Register form body:', req.body); 
     
    const { username , email, password, location, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send('User already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse location coordinates if provided (fallback to [0,0])
    let coordinates = [0, 0];
    if (location && location.lat && location.lng) {
      coordinates = [parseFloat(location.lng), parseFloat(location.lat)];
    }

    const newUser = new User({

       username,
      email,
      password: hashedPassword,
      role ,
      location: {
        type: 'Point',
        coordinates
      }
    });

    const savedUser = await newUser.save();

    // Store minimal user info in session
    req.session.user = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role
    };

    if (savedUser.role === 'admin') {
  res.redirect('/admin/dashboard');
} else {
  res.redirect('/user/dashboard');
}// redirect to user dashboard after register
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Handle Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      console.log('User not found or role mismatch');
      return res.status(400).render('login', { error: 'Invalid email, password, or role', activePage: 'login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).render('login', { error: 'Invalid email or password', activePage: 'login' });
    }

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username
    };

    console.log('Session user set:', req.session.user);

    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).send('Session error');
      }
      console.log('Redirecting user...');
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        return res.redirect('/user/dashboard');
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});






module.exports = router;
