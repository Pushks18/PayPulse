//backend/stripe.js
require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Stripe secret key:", process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
