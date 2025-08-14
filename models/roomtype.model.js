// models/RoomType.js
const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true, // total guests
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [String],
    // images: [String],
    totalUnits: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
