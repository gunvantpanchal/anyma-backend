const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URL = "mongodb+srv://alomj257:alomj257@cluster0.eesendj.mongodb.net/book";
const Connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = Connection;
