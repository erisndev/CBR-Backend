// controllers/adminController.js
const AdminUser = require("../models/admin.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin registration (optional if only one admin)

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
};
