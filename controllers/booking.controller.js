// controllers/bookingController.js
const bookingService = require("../services/booking.services.js");
const paymentService = require("../services/payment.services.js");

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

const initializePayment = async (req, res) => {
  try {
    const { email, amount, reference } = req.body;
    const paymentData = await paymentService.initializePayment({
      email,
      amount,
      reference,
    });
    res.json(paymentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const verification = await paymentService.verifyPayment(reference);
    res.json(verification);
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

module.exports = {
  createBooking,
  cancelBooking,
  initializePayment,
  verifyPayment,
  getBookings,
};
