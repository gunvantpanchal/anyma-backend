const app = require("../config/expressConfig");
const Connection = require("../config/dBConnect");

// Initialize database connection
Connection();

// Export the Express app for Vercel serverless function
module.exports = app;
