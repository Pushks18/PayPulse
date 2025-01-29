//backend/routes/index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io"); // Import socket.io
const router = express.Router();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the server

// Sub-routers
const userRoutes = require("./user");
const accountRoutes = require("./account")(io); // Pass io to the account routes
const stripeRoutes = require("./stripe");
const transactionRoutes = require("./transaction");

// Example root route
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API!" });
});

// Mount user routes
router.use("/users", userRoutes);

// Mount account routes
router.use("/account", accountRoutes);

// Mount stripe routes
router.use("/stripe", stripeRoutes);

//Mount transaction routes
router.use("/transaction", transactionRoutes);

module.exports = router;
