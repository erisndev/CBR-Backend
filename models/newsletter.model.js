// models/Newsletter.js
const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publishDate: { type: Date, required: true },
    coverImage: {
      url: { type: String, required: true }, // Supabase URL for cover image
      fileName: { type: String, required: true }, // Original filename
    },
    pdf: {
      url: { type: String, required: true }, // Supabase URL for PDF
      fileName: { type: String, required: true }, // Original filename
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
