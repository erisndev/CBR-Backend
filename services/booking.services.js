// services/bookingService.js

const Booking = require("../models/bookings.model.js");
const Room = require("../models/room.model.js");
const RoomType = require("../models/roomtype.model.js");

const createBooking = async ({
  roomId,
  checkIn,
  checkOut,
  guests,
  guestDetails,
  totalPrice,
}) => {
  // Check room availability first
  const existingBookings = await Booking.find({
    room: roomId,
    $or: [
      { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
    ],
  });

  if (existingBookings.length > 0) {
    throw new Error("Room is not available for selected dates");
  }

  const booking = await Booking.create({
    room: roomId,
    checkIn,
    checkOut,
    guests,
    guestDetails,
    totalPrice,
    status: "pending",
  });

  return booking;
};

const getBookingsByRoom = async (roomId) => {
  return await Booking.find({ room: roomId }).populate("room");
};

// ✅ New function to get all bookings
const getAllBookings = async () => {
  return await Booking.find()
    .populate("room")
    .populate({
      path: "room",
      populate: { path: "type", model: "RoomType" },
    });
};

const cancelBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  booking.status = "cancelled";
  await booking.save();
  return booking;
};

module.exports = {
  createBooking,
  getBookingsByRoom,
  getAllBookings, // ✅ added
  cancelBooking,
};
