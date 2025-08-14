// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");

// Admin authentication

router.post("/login", adminController.loginAdmin);

module.exports = router;
