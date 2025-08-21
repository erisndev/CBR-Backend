const Booking = require("../models/bookings.model.js");
const Room = require("../models/room.model.js");
const crypto = require("crypto");

const createBooking = async ({
  roomId,
  checkIn,
  checkOut,
  guests,
  guestList, // 👈 new
  guestDetails,
  totalPrice,
}) => {
  // Generate unique payment reference
  const paymentReference = `CBR_${crypto.randomBytes(4).toString("hex")}`;

  // Normalize guestDetails (remove empty/null values)
  const normalizedGuestDetails = { ...(guestDetails || {}) };
  Object.keys(normalizedGuestDetails).forEach((key) => {
    if (
      normalizedGuestDetails[key] === "" ||
      normalizedGuestDetails[key] == null
    ) {
      delete normalizedGuestDetails[key];
    }
  });

  // Check room availability
  const existingBookings = await Booking.find({
    room: roomId,
    $or: [
      { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
    ],
    status: { $in: ["pending", "paid"] },
  });

  if (existingBookings.length > 0) {
    throw new Error("Room is not available for selected dates");
  }

  // Calculate guests (if guestList is provided, override guests count)
  let totalGuests = guests || 1;
  if (guestList) {
    const adults = Number(guestList.adults || 0);
    const children = Number(guestList.children || 0);
    totalGuests = adults + children || 1;
  }

  // Save booking
  const booking = await Booking.create({
    room: roomId,
    checkIn,
    checkOut,
    guests: totalGuests,
    guestList, // 👈 saves adults/children separately
    guestDetails: normalizedGuestDetails,
    totalPrice,
    status: "pending",
    payment: {
      reference: paymentReference,
      status: "pending",
    },
  });

  await Room.findByIdAndUpdate(roomId, { status: "booked" });

  return booking;
};

const getAllBookings = async () => {
  return await Booking.find().populate({
    path: "room",
    populate: { path: "roomType", model: "RoomType" },
  });
};

const cancelBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.status = "cancelled";
  await booking.save();

  const hasActive = await Booking.exists({
    room: booking.room,
    status: { $in: ["pending", "paid"] },
    _id: { $ne: booking._id },
  });

  if (!hasActive) {
    await Room.findByIdAndUpdate(booking.room, { status: "available" });
  }

  return booking;
};

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId).populate({
    path: "room",
    populate: { path: "roomType", model: "RoomType" },
  });
};

const getBookingByReference = async (reference) => {
  try {
    const booking = await Booking.findOne({
      "payment.reference": reference,
    }).populate("room");
    return booking;
  } catch (error) {
    throw new Error("Failed to fetch booking: " + error.message);
  }
};

// Mark booking as checked in
const checkInBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.status === "cancelled")
    throw new Error("Cannot check in a cancelled booking");

  if (booking.status === "checked_in")
    throw new Error("Booking is already checked in");

  // Update booking status
  booking.status = "checked_in";
  await booking.save();

  // Update room status
  await Room.findByIdAndUpdate(booking.room, { status: "checked_in" });

  return booking;
};

// Mark booking as checked out
const checkOutBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.status === "cancelled")
    throw new Error("Cannot check out a cancelled booking");

  if (booking.status !== "checked_in")
    throw new Error("Booking must be checked in first");

  // Update booking status
  booking.status = "checked_out";
  await booking.save();

  // Update room status to available
  await Room.findByIdAndUpdate(booking.room, { status: "available" });

  return booking;
};

module.exports = {
  createBooking,
  getAllBookings,
  cancelBooking,
  getBookingById,
  getBookingByReference,
  checkInBooking,
  checkOutBooking,
};
