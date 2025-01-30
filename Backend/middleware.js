const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Decoded token:", decoded); 
    req.userId = decoded.userId; // Attach userId from token
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Failed to authenticate token" });
  }
};

module.exports = { authMiddleware };
