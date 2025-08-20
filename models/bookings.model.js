const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    // Store total guest count
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Store breakdown (adults/children)
    guestList: {
      adults: { type: Number, default: 1, min: 0 },
      children: { type: Number, default: 0, min: 0 },
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
        required: false,
      },
      specialRequests: { type: String },
    },

    totalPrice: { type: Number, required: true },

    payment: {
      reference: { type: String },
      status: { type: String, enum: ["pending", "paid"], default: "pending" },
      paidAt: { type: Date },
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "checked_in", "checked_out"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate guests from guestList
bookingSchema.pre("save", function (next) {
  if (this.guestList) {
    const adults = Number(this.guestList.adults || 0);
    const children = Number(this.guestList.children || 0);
    this.guests = adults + children || 1;
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
