// routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller.js");

// Check room availability by date
router.get("/", roomController.getAvailableRooms);

module.exports = router;
