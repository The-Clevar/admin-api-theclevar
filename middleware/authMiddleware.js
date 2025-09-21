const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // Ideally use environment variable

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Expected format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
