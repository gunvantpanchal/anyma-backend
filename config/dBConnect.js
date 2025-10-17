const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URL = "mongodb+srv://alessandro:RPrxd9ZCKyUt0EKy@anyma.ze4sr.mongodb.net/Anyma";
const Connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || URL);
    console.log("Database connected successfully - test");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = Connection;
