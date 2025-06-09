const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String // Add image URL field
});

module.exports = mongoose.model('Listing', listingSchema);
