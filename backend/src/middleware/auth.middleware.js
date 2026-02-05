const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  try {
    // 1. Extract Authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({ message: "No token provided" });
    }

    // 2. Expect format: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Malformed token" });
    }

    const token = parts[1];

    // 3. Verify token
    jwt.verify(token, process.env.JWT_SECRET || "supersecret", (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }

      // 4. Attach decoded payload to request
      req.user = decoded;

      // 5. Proceed to next middleware or route
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal authentication error" });
  }
};

module.exports = authenticateToken;
