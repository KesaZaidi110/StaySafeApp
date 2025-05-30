// models/CrimeReport.js
const mongoose = require('mongoose');

const crimeReportSchema = new mongoose.Schema({
  crimeType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // ✅ Admin response field added
  response: {
    message: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }

}, { timestamps: true });

module.exports = mongoose.model('CrimeReport', crimeReportSchema);
