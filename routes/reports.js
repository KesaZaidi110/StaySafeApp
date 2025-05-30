const express = require('express');
const router = express.Router();
const CrimeReport = require('../models/CrimeReport');


const { ensureAuthenticated } = require('../middleware/auth');


// GET /reports - display all reports
router.get('/', async (req, res) => {
  try {
    const reports = await CrimeReport.find().sort({ createdAt: -1 });
    res.render('reports', {
      reports,
      showSuccess: req.query.success === '1'
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).send('Server error');
  }
});


// View single report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await CrimeReport.findById(req.params.id);
    if (!report) {
      return res.status(404).send("Report not found");
    }
    res.render("report-detail", { report });
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).send("Server error");
  }
});


// POST /reports - Create a new crime report
router.post('/report-crime', ensureAuthenticated, async (req, res) => {
  try {
    const { crimeType, description, location } = req.body;


    if (!crimeType) {
      return res.status(400).send('Crime type is required.');
    }


    const report = new CrimeReport({
      crimeType,
      description,
      location,
      reportedBy: req.session.user._id 
    });

    await report.save();
    res.redirect('/reports?success=1');
  } catch (error) {
    console.error('Error saving crime report:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
