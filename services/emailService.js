const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


async function sendAlertEmail(toEmail, alertData) {
  let locationStr = 'Unknown location';

  if (alertData.location) {
    if (typeof alertData.location === 'string') {
      locationStr = alertData.location;
    } else if (alertData.location.coordinates && Array.isArray(alertData.location.coordinates)) {
      locationStr = alertData.location.coordinates.join(', ');
    }
  }

  const msg = {
    to: toEmail,
    from: 'thesupergadgets82@gmail.com', // your verified sender email
    subject: `🚨 Crime Alert: ${alertData.type || 'Alert'}`,
    text: `A new ${alertData.type || 'alert'} has been reported at ${locationStr}.\n` +
          `Message: ${alertData.message || alertData.reason || ''}\n` +
          `Risk Level: ${alertData.level || 'N/A'}`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.response?.body || error.message);
  }
}

module.exports = { sendAlertEmail };
