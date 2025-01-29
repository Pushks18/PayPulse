//backend/routes/stripe.js
const express = require("express");
const router = express.Router();
const stripe = require("../stripe"); // from step 3

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // e.g. amount = 100 for $100

    // Convert dollars to cents
    const paymentAmountInCents = amount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment intent created:", paymentIntent);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
