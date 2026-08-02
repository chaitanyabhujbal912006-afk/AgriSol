/**
 * SMS Service - Twilio Integration
 */

const logger = require('../../utils/logger');

let twilioClient;

const getTwilioClient = () => {
  if (!twilioClient) {
    const twilio = require('twilio');
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }
  return twilioClient;
};

const sendSMS = async (to, body) => {
  const client = getTwilioClient();

  if (!client) {
    // Extract OTP from message for clear display
    const otpMatch = body.match(/\b\d{6}\b/);
    const otp = otpMatch ? otpMatch[0] : 'N/A';

    // Print OTP clearly in the terminal
    console.log('\n' + '='.repeat(50));
    console.log('📱 DEV MODE — OTP not sent via SMS (Twilio not configured)');
    console.log(`📞 Mobile : ${to}`);
    console.log(`🔑 OTP    : ${otp}`);
    console.log('='.repeat(50) + '\n');

    logger.info(`[DEV OTP] Mobile: ${to} | OTP: ${otp}`);
    return { sid: 'mock-sid', status: 'mock-sent', otp };
  }

  try {
    // Format Indian number
    const formattedNumber = to.startsWith('+') ? to : `+91${to}`;

    const message = await client.messages.create({
      body: body.substring(0, 160), // SMS limit
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    logger.info(`SMS sent to ${to}: ${message.sid}`);
    return message;
  } catch (err) {
    logger.error(`SMS failed to ${to}:`, err.message);
    throw err;
  }
};

const sendOTPSMS = async (mobile, otp, language = 'en') => {
  const messages = {
    en: `AgriSol OTP: ${otp}. Valid for 10 minutes. Do not share with anyone. -AgriSol`,
    hi: `AgriSol OTP: ${otp}. 10 मिनट के लिए वैध। किसी के साथ साझा न करें। -AgriSol`,
    mr: `AgriSol OTP: ${otp}. 10 मिनिटांसाठी वैध. कोणाशीही शेअर करू नका. -AgriSol`,
  };

  return sendSMS(mobile, messages[language] || messages.en);
};

module.exports = { sendSMS, sendOTPSMS };
