// models/Account.js
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: Number,
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
