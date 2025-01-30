require("dotenv").config(); // Load environment variables from .env

// console.log("JWT_SECRET:", process.env.JWT_SECRET); 

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET, // Use the value from the environment variable
};
