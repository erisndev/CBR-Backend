const bookingService = require("../services/booking.services.js");
const paymentService = require("../services/payment.services.js");
const emailService = require("../services/email.services.js");
const Booking = require("../models/bookings.model.js");

// Create booking (generates paymentReference in backend)
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestList, // 👈 new
      guestDetails,
      totalPrice,
    } = req.body;

    // Create booking in DB
    const booking = await bookingService.createBooking({
      roomId,
      checkIn,
      checkOut,
      guests,
      guestList, // 👈 pass to service
      guestDetails,
      totalPrice,
    });

    // Initialize payment with Paystack
    const paymentData = await paymentService.initializePayment({
      email: guestDetails.email,
      amount: booking.totalPrice * 100, // Paystack expects kobo
      reference: booking.payment.reference,
    });

    // Send confirmation email
    await emailService.sendBookingConfirmation(booking);

    res.status(201).json({ booking, paymentData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Verify payment (callback after Paystack)
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const verification = await paymentService.verifyPayment(reference);

    if (verification.status === "success") {
      const booking = await Booking.findOneAndUpdate(
        { "payment.reference": reference },
        {
          "payment.status": "paid",
          "payment.paidAt": new Date(),
          status: "paid",
        },
        { new: true }
      );

      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      return res.json({ message: "Payment successful", booking });
    }

    res.status(400).json({ message: "Payment verification failed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const cancelled = await bookingService.cancelBooking(req.params.id);
    res.json(cancelled);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBookingByReference = async (req, res) => {
  try {
    const booking = await bookingService.getBookingByReference(
      req.params.reference
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a booking as checked in
const checkInBooking = async (req, res) => {
  try {
    const { id } = req.params; // bookingId
    const booking = await bookingService.checkInBooking(id);
    res.json({ message: "Booking checked in", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark a booking as checked out
const checkOutBooking = async (req, res) => {
  try {
    const { id } = req.params; // bookingId
    const booking = await bookingService.checkOutBooking(id);
    res.json({ message: "Booking checked out, room now available", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  verifyPayment,
  cancelBooking,
  getBookings,
  getBookingById,
  getBookingByReference,
  checkInBooking,
  checkOutBooking,
};
