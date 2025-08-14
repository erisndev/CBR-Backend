// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    guestDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payment: {
      reference: { type: String },
      status: { type: String, enum: ["pending", "paid"], default: "pending" },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
