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
      type: Number,
      default: 1,
      min: 1,
      set: (v) => {
        if (v && typeof v === "object") {
          const adults = Number(v.adults || 0);
          const children = Number(v.children || 0);
          return adults + children || 1;
        }
        const n = Number(v);
        return Number.isNaN(n) || n < 1 ? 1 : n;
      },
    },
    guestDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      postalCode: { type: String },
      dateOfBirth: { type: Date },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
      },
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
