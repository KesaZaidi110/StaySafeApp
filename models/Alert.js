const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  type: { type: String },
  message: { type: String },
  level: { type: String },
  reason: { type: String },
  locationName: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', AlertSchema);
