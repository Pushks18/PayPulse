const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Import Transaction model
const User = require("../models/User"); // Assuming you have a User model

// Log a transaction
router.post("/log", async (req, res) => {
  const { from, to, amount, transactionType, status } = req.body;

  try {
    const transaction = new Transaction({
      from,
      to,
      amount,
      transactionType,
      status,
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction logged successfully" });
  } catch (error) {
    console.error("Error logging transaction:", error);
    res.status(500).json({ message: "Error logging transaction" });
  }
});

router.get("/history", async (req, res) => {
  const { userId } = req.query; // User ID passed in query parameters

  try {
    // Find all transactions where the user is either the sender or the recipient
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    }).sort({ date: -1 }); // Sort by date descending

    const populatedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        // Log the transaction being processed
        // console.log(
        //   `Processing transaction with from: ${transaction.from}, to: ${transaction.to}`
        // );

        // Fetch the 'from' user details
        const fromUser = await User.findOne({ userId: transaction.from });
        // console.log(
        //   `Looking up from user: ${transaction.from}, result:`,
        //   fromUser
        // ); // Log the result of the lookup

        // Fetch the 'to' user details
        const toUser = await User.findOne({ userId: transaction.to });
        // console.log(`Looking up to user: ${transaction.to}, result:`, toUser); // Log the result of the lookup

        return {
          ...transaction.toObject(), // Spread transaction details
          fromUserName: fromUser ? fromUser.firstName : "Unknown", // Add the sender's name
          toUserName: toUser ? toUser.firstName : "Unknown", // Add the recipient's name
        };
      })
    );

    res.json(populatedTransactions); // Send populated transactions with names
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

module.exports = router;
