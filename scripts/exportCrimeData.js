const mongoose = require('mongoose');
const fs = require('fs');
const Crime = require('../models/CrimeReport');

mongoose.connect('mongodb://localhost:27017/staysafe', {
 
});

mongoose.connection.once('open', async () => {
  const crimes = await Crime.find({}, 'type location date');

 const rows = crimes.map(c => {
  const dateStr = c.date ? c.date.toISOString() : '';
  return `"${c.type}","${c.location}","${dateStr}"`;
});


  const csv = 'type,location,date\n' + rows.join('\n');

  fs.writeFileSync('crime_data.csv', csv);
  console.log('✅ Crime data exported to crime_data.csv');
  mongoose.disconnect();
});
