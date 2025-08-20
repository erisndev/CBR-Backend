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
router.get("/verify-payment/:reference", bookingController.verifyPayment);
router.delete("/cancel/:id", bookingController.cancelBooking);
router.get("/", bookingController.getBookings);

router.get("/:id", bookingController.getBookingById); // single by ID
router.get("/ref/:reference", bookingController.getBookingByReference); // single by ref

// New check-in/check-out routes
router.put("/check-in/:id", bookingController.checkInBooking);
router.put("/check-out/:id", bookingController.checkOutBooking);

module.exports = router;
