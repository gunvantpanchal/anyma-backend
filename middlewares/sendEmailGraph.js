const axios = require('axios');

/**
 * Send email using Microsoft Graph API
 * Requires: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID in .env
 */
const sendEmail = async (message, email, subject) => {
  try {
    // Step 1: Get access token
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Send email using Graph API
    const emailData = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: message
        },
        toRecipients: [
          {
            emailAddress: {
              address: email
            }
          }
        ]
      },
      saveToSentItems: 'true'
    };

    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL}/sendMail`,
      emailData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Successfully sent email via Microsoft Graph API');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendEmail };
