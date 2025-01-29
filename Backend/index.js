require("dotenv").config(); // Load .env file and set environment variables
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const rootRouter = require("./routes/index");
const { connectToDatabase } = require("./db");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://paypulse.onrender.com", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware to handle CORS and JSON body parsing
app.use(
  cors({
    origin: "https://paypulse.onrender.com", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Handle socket connections and authentication
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Authenticate user and join a room based on their userId
  socket.on("authenticate", ({ token }) => {
    if (!token) {
      return socket.emit("authentication-error", {
        message: "Authentication token is missing",
      });
    }

    try {
      // Verify token and extract userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.userId) {
        return socket.emit("authentication-error", {
          message: "Invalid token payload",
        });
      }

      // Join a room based on userId
      socket.join(decoded.userId);
      console.log(`User ${decoded.userId} authenticated and joined room.`);
    } catch (err) {
      console.error("Authentication failed:", err.message);
      socket.emit("authentication-error", {
        message: "Authentication failed: " + err.message,
        error: err, // Send the error object for more detailed client-side logging
      });
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Mount the root router
app.use("/api/v1", rootRouter);

// Start the server and database connection
const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully!");

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
  }
};

startServer();
