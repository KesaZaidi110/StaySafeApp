const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const axios = require('axios');
const flash = require('connect-flash');



const authRoutes = require('./routes/auth');
const crimeRoutes = require('./routes/crime');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const CrimeReport = require('./models/CrimeReport');
const User = require('./models/user'); // adjust path if needed
const Alert = require('./models/Alert');
const predictRoutes = require('./routes/predict');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/dashboard');



const { getLatLongFromLocation } = require('./services/geocodingService');
const { title } = require('process');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));







app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // use `true` only if using HTTPS
}));
app.use(flash());



app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null; // keep user here too
  next();
});

app.use('/', predictRoutes);
app.use('/auth', require('./routes/auth'));
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
 
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost:27017/staysafe", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


app.get('/', async (req, res) => {
  try {
    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(5);

    let user = null;
    let userReports = [];
    let hotspots = [];

    if (req.session.user) {
      user = await User.findById(req.session.user._id);
      userReports = await CrimeReport.find({ reportedBy: user._id }).sort({ createdAt: -1 });

      const allReports = await CrimeReport.find({});

hotspots = allReports
  .filter(report => report.location && Array.isArray(report.location.coordinates) && report.location.coordinates.length === 2)
  .map(report => ({
    lat: report.location.coordinates[1],
    lng: report.location.coordinates[0],
    type: report.crimeType,
    description: report.description,
  }));
} 
    res.render('home', {
      recentAlerts,
      user,
      userReports,
      hotspots,
      activePage: 'home'
    });
  
  } catch (err) {
    console.error('Error fetching alerts or reports:', err);
    res.render('home', {
      recentAlerts: [],
      user: null,
      userReports: [],
      hotspots: [],
      activePage: 'home'
    });
  }
});

app.get('/map', async (req, res) => {
  try {
    const allReports = await CrimeReport.find({});

    const hotspots = allReports
      .filter(report => report.location && Array.isArray(report.location.coordinates) && report.location.coordinates.length === 2)
      .map(report => ({
        lat: report.location.coordinates[1],
        lng: report.location.coordinates[0],
        type: report.crimeType,
        description: report.description,
      }));

    res.render('map', { hotspots });  // pass hotspots here
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error loading map');
  }
});


app.get('/weather', (req, res) => {
  res.render('weather', {
    weather: null,   
    error: null,
    forecast: []     
  });
});




const { getWeatherByCity } = require('./services/weatherService');

app.post('/weather', async (req, res) => {
  const city = req.body.city;

  const { data, error } = await getWeatherByCity(city);

  if (error) {
    return res.render('weather', {
      weather: null,
      error,
      forecast: []
    });
  }

  res.render('weather', {
    weather: data,
    error: null,
    forecast: []
  });
});





app.get('/hotspot-map', (req, res) => {
  res.render('hotspot-map');
});


// Mount your imported routes if they have their own routes
app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/crime', crimeRoutes);
app.use('/reports', reportRoutes);

// Routes





app.get('/report-crime', (req, res) => {
  res.render('report-crime');
});


// *** Corrected POST route to save crime report ***


app.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }); // no pagination
    res.render('alerts', { alerts, user: req.user || null }); // send user if logged in
  } catch (err) {
    console.error(err);
    res.render('alerts', { alerts: [], user: req.user || null });
  }
});



    


app.get('/crime-map', async (req, res) => {
  try {
    const reports = await CrimeReport.find(); // corrected model name
    res.render('map', { reports });
  } catch (error) {
    console.error("Error fetching crime reports:", error);
    res.status(500).send("Error fetching crime reports");
  }
});

app.get('/reports', async (req, res) => {
  try {
     const user = req.session.user ? await User.findById(req.session.user._id) : null;
    const reports = await CrimeReport.find().sort({ createdAt: -1 });
    res.render('reports', {
      user,
      reports,
      showSuccess: req.query.success === '1'
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/crime-reports', async (req, res) => {
  try {
    const { country, state, crimeType } = req.query;
    const query = {};
    if (country && country !== 'all') query.country = country;
    if (state && state !== 'all') query.state = state;
    if (crimeType && crimeType !== 'all') query.crimeType = crimeType;

    const reports = await CrimeReport.find(query); // corrected model name
    res.json(reports);
  } catch (error) {
    console.error('Error fetching crime reports:', error);
    res.status(500).send('Error processing crime data');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
