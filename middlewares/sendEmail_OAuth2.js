const nodemailer = require("nodemailer");
const axios = require('axios');

/**
 * Send email using Nodemailer with OAuth2 for Microsoft 365
 * This version gets a fresh access token each time
 */
const sendEmail = async (message, email, subject) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get access token using client credentials
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          scope: 'https://outlook.office365.com/.default',
          grant_type: 'client_credentials'
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Create transporter with the access token
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: "details",
        html: message,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          reject(err);
        } else {
          console.log("Successfully sent email via OAuth2");
          resolve(true);
        }
      });
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      reject(error);
    }
  });
};

module.exports = { sendEmail };
