// models/Newsletter.js
const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true }, // HTML content
    image: { type: String }, // Cloudinary URL
    imageId: { type: String }, // Cloudinary public_id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
