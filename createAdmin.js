// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("./models/admin.model.js"); // adjust path to your AdminUser model

const createAdmin = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Admin credentials
    const email = "admin@cbr.com";
    const password = "admin123";

    // Check if admin already exists
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await AdminUser.create({ email, passwordHash });
    console.log("Admin created:", admin);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
