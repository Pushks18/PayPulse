// backend/db.js (or a similar filename)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Account = require("./models/Account");

const connectToDatabase = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(
      process.env.DB_PASSWORD
    )}@cluster0.rtqhp.mongodb.net/${
      process.env.DB_NAME
    }?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
};

module.exports = { connectToDatabase, User, Account };
