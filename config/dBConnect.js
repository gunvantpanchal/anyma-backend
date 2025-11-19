const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URL = process.env.MONGODB_URI || "mongodb+srv://alessandro:RPrxd9ZCKyUt0EKy@anyma.ze4sr.mongodb.net/Anyma";

const Connection = async () => {
  try {
    mongoose.connection.on('error', (err) => {
      console.error('Mongo connection error:', err?.message || err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongo disconnected');
    });

    await mongoose.connect(URL, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error('Mongo connection failed:', error?.message || error);
    throw error;
  }
};

module.exports = Connection;
