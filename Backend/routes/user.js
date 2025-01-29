// backend/routes/user.js
const express = require("express");
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// Zod validation schemas
const signupBody = zod.object({
  username: zod.string().email({ message: "Invalid email address" }),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

const signinBody = zod.object({
  username: zod.string().email({ message: "Invalid email address" }),
  password: zod.string(),
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

// Signup route
router.post("/signup", async (req, res) => {
  const { success, error, data } = signupBody.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: error.errors.map((e) => e.message) });
  }

  const { username, password, firstName, lastName } = data;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: "Email already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  const account = await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({
    message: "User created successfully",
    token: token,
  });
});

// Signin route
router.post("/signin", async (req, res) => {
  const { success, error, data } = signinBody.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: error.errors.map((e) => e.message) });
  }

  const { username, password } = data;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({
    message: "Signin successful",
    token,
  });
});

// Update user info
router.put("/", authMiddleware, async (req, res) => {
  const { success, error, data } = updateBody.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: error.errors.map((e) => e.message) });
  }

  const updated = await User.findByIdAndUpdate(req.userId, data, { new: true });

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "Updated successfully",
    user: updated,
  });
});

// backend/routes/user.js (or wherever your user routes reside)
router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filterText = req.query.filter?.toLowerCase() || "";
    const currentUserId = req.userId;

    // Find users where _id != currentUserId
    // and name matches the filter (case-insensitive)
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { firstName: { $regex: filterText, $options: "i" } },
        { lastName: { $regex: filterText, $options: "i" } },
      ],
    });

    // Return sanitized user data
    const mappedUsers = users.map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
    }));

    return res.json({ user: mappedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/details", authMiddleware, async (req, res) => {
  console.log("Received request for user details"); // Debug log
  try {
    const user = await User.findById(req.userId).select(
      "firstName lastName username"
    );
    console.log("Fetched user details(backend):", user); // Debug log
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return some user info
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  // Invalidate the token (on server-side, you can also manage token revocation if needed)
  res.json({ message: "User logged out successfully" });
});

// GET user details by IDs
router.get("/user-details", authMiddleware, async (req, res) => {
  try {
    const userIds = req.query.userIds ? req.query.userIds.split(",") : [];

    // Check if there are any user IDs provided
    if (!userIds.length) {
      return res.status(400).json({ message: "No user IDs provided" });
    }

    // Find users based on the provided IDs
    const users = await User.find({
      _id: { $in: userIds },
    }).select("firstName lastName"); // Only fetching first and last names

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    const userDetails = users.map((user) => ({
      id: user._id.toString(), // Ensure the ID is in string format
      firstName: user.firstName,
      lastName: user.lastName,
    }));

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
