// Mock service to send alert to police station (replace with real API or SMS later)
module.exports = async function sendPoliceAlert(location) {
  console.log('📡 Alert sent to nearest police station at:', location);
  // TODO: Replace with real notification (e.g., Twilio SMS or real API)
};
