const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');



const app = express();
app.use(express.static('public'))

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stayzio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));  // to parse form data

// Setup session middleware
app.use(session({
  secret: 'your-secret-key',  // replace with your own secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/stayzio' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Basic home route
app.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render('home', {
      listings,
      currentUser: req.session.user || null
    });
  } catch (err) {
    console.error('Error loading listings:', err);
    res.send('Error loading listings');
  }
});

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const Listing = require('./models/Listing');
const bookingRoutes = require('./routes/booking');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', bookingRoutes);
;



app.get('/seed', async (req, res) => {
  try {
    // Clear existing listings to avoid duplicates
    await Listing.deleteMany({});

  const listings = [
  {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1609774673298-aac98e8cea2b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },
   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1716656314150-5b02c75131ea?q=80&w=983&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1605352081508-2e09927ecfe3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T2NlYW52aWV3JTIwTHV4dXJ5JTIwVmlsbGF8ZW58MHx8MHx8fDA%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },
  
   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://plus.unsplash.com/premium_photo-1746327707391-d095ac370b9c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8T2NlYW52aWV3JTIwTHV4dXJ5JTIwVmlsbGF8ZW58MHx8MHx8fDA%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1580713308492-5e9159d2ce0c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8T2NlYW52aWV3JTIwTHV4dXJ5JTIwVmlsbGF8ZW58MHx8MHx8fDA%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1740497708249-555d807a157a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T2NlYW52aWV3JTIwTHV4dXJ5JTIwVmlsbGF8ZW58MHx8MHx8fDA%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1634337211582-e75b7e019d5b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1747511884233-3b522036c528?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1644492533867-519ea77e427c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://plus.unsplash.com/premium_photo-1748729883233-390c46f9e669?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1648664531186-97d59e4f03cf?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

  
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1660914707240-394d54a1a374?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1579714310999-7b0e6a8f5ddc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fE9jZWFudmlldyUyMEx1eHVyeSUyMFZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://media.istockphoto.com/id/1223072133/photo/cityscape-of-a-residential-area-with-modern-apartment-buildings-new-green-urban-landscape-in.webp?a=1&b=1&s=612x612&w=0&k=20&c=yBDWGBpw56cPhqh5bMK5QDcIxnmQWlK-x3LL65Dp1w4=',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://media.istockphoto.com/id/1453462931/photo/maldives-hotel-beach-resort-on-tropical-island-with-aerial-drone-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=i9KGcEkXnyJbWOHE6o0sHok_lNbpb9UMfb7uX2P9NDw=', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://media.istockphoto.com/id/454347445/photo/modern-villa-with-pool.webp?a=1&b=1&s=612x612&w=0&k=20&c=vXfuPe2OV8KOUdinAMjG2IHvBZ61Zt_DIp_i6N35Rog=',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1716807335095-8948ce6ab482?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1688653802629-5360086bf632?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://plus.unsplash.com/premium_photo-1683888725032-77a464b20a68?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1593714604578-d9e41b00c6c6?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1717356280846-eaef82389e30?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://plus.unsplash.com/premium_photo-1677474827617-6a7269f97574?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZpbGxhfGVufDB8fDB8fHww',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpbGxhfGVufDB8fDB8fHww', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://plus.unsplash.com/premium_photo-1682377521697-bc598b52b08a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmlsbGF8ZW58MHx8MHx8fDA%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1716807335226-dfe1e2062db1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmlsbGF8ZW58MHx8MHx8fDA%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },

   {
    title: 'Oceanview Luxury Villa',
    description: 'A spacious villa with panoramic ocean views and private pool.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlsbGF8ZW58MHx8MHx8fDA%3D',
    location: 'Goa',
    price: 350
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Rustic cabin surrounded by pine trees in the mountains.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmlsbGF8ZW58MHx8MHx8fDA%3D', // mountain cabin :contentReference[oaicite:2]{index=2}
    location: 'Manali',
    price: 150
  },
];

// Usage example: await Listing.insertMany(listings);

// You can insert these with:
// await Listing.insertMany(listings);

    const inserted = await Listing.insertMany(listings);

    res.status(200).json({
      message: 'Seed data added successfully',
      count: inserted.length,
      listings: inserted
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ error: 'Failed to seed listings' });
  }
});




// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
