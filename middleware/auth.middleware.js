// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/admin.model.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await AdminUser.findById(decoded.id).select("-passwordHash");

      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

// Role-based middleware (optional if you have multiple roles)
const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, adminOnly };
