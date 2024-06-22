const express = require("express");
const router = express.Router();
const zod = require("zod");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");

router.get("/balance", authMiddleware, async function (req, res) {
  try {
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/transfer", authMiddleware, async function (req, res) {
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
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to });

    if (!toAccount) {
      return res.status(400).json({ message: "Invalid recipient account" });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    );

    await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
