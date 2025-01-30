const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const { Server } = require("socket.io");
const Transaction = require("../models/Transaction");
const { ObjectId } = require("mongoose").Types; // Import ObjectId from mongoose
const zod = require("zod");

module.exports = (io) => {
  // Fetch the user's balance
  router.get("/balance", authMiddleware, async (req, res) => {
    try {
      // console.log("1. Looking up userId from token:", req.userId); 
      const account = await Account.findOne({
        userId: ObjectId.createFromHexString(req.userId),
      }); // Ensure using ObjectId here

      // console.log("2. Account found:", account); 

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      res.json({ balance: account.balance });
    } catch (error) {
      console.error("Error fetching balance:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/credit", authMiddleware, async (req, res) => {
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    try {
      const session = await Account.startSession();
      session.startTransaction();

      const userId = ObjectId.createFromHexString(req.userId); // Ensure valid ObjectId

      // console.log("User ID:", userId);

      // Query Account and User with ObjectId
      const account = await Account.findOne({ userId }).session(session);
      const user = await User.findOne({ _id: userId }).session(session); // Use _id for User model

      if (!account || !user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Account or User not found" });
      }

      account.balance += amount;
      await account.save({ session });

      const transaction = new Transaction({
        from: "wallet",
        to: req.userId,
        amount: amount,
        transactionType: "wallet-to-user",
        status: "success",
        userName: user.firstName, // Include user's name
      });
      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      io.to(req.userId).emit("balance-update", {
        message: `Your wallet was credited with ₹${amount}!`,
      });

      res.json({
        message: "Balance credited successfully",
        balance: account.balance,
        userName: user.firstName,
      });
    } catch (error) {
      console.error("Error crediting wallet:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  });

  // Transfer money from one user to another
  router.post("/transfer", authMiddleware, async (req, res) => {
    const transferSchema = zod.object({
      to: zod.string(),
      amount: zod.number().positive(),
    });

    const validationResult = transferSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { to, amount } = validationResult.data;

    try {
      const userId = ObjectId.createFromHexString(req.userId); // Ensure valid ObjectId
      const toUserId = ObjectId.createFromHexString(to); // Convert recipient's ID to ObjectId

      // console.log("Sender ID:", userId);
      // console.log("Recipient ID:", toUserId);

      // Fetch sender and recipient account and user details using ObjectId conversion
      const senderAccount = await Account.findOne({ userId });
      const recipientAccount = await Account.findOne({ userId: toUserId });
      const senderUser = await User.findOne({ _id: userId });
      const recipientUser = await User.findOne({ _id: toUserId });

      if (
        !senderAccount ||
        !recipientAccount ||
        !senderUser ||
        !recipientUser
      ) {
        return res
          .status(404)
          .json({ message: "Sender or recipient account not found" });
      }

      if (senderAccount.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      senderAccount.balance -= amount;
      recipientAccount.balance += amount;

      await senderAccount.save();
      await recipientAccount.save();

      const transaction = new Transaction({
        from: req.userId,
        to: to,
        amount: amount,
        transactionType: "user-to-user",
        status: "success",
        userName: senderUser.firstName,
      });
      await transaction.save();

      io.to(req.userId).emit("balance-update", {
        message: `₹${amount} was debited from your wallet and sent to ${recipientUser.firstName}.`,
      });

      io.to(to).emit("balance-update", {
        message: `You received ₹${amount} from ${senderUser.firstName}.`,
      });

      res.status(200).json({
        message: "Transfer successful",
        userName: senderUser.firstName,
      });
    } catch (error) {
      console.error("Error during transfer:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};
