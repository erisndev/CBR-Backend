// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller.js");
const {
  validateBookingDates,
} = require("../middleware/validateBookingDates.js");
const {
  validateRoomCapacity,
} = require("../middleware/validateRoomCapacity.js");

// Public booking routes
router.post(
  "/",
  validateBookingDates,
  validateRoomCapacity,
  bookingController.createBooking
);
router.post("/initialize-payment", bookingController.initializePayment);
router.get("/verify-payment/:reference", bookingController.verifyPayment);
router.delete("/cancel/:id", bookingController.cancelBooking);
router.get("/", bookingController.getBookings);

module.exports = router;
