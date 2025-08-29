// services/newsletterService.js
const Newsletter = require("../models/newsletter.model");

// Get all newsletters
const getAllNewsletters = async () => {
  return await Newsletter.find().sort({ date: -1 });
};

// Get single newsletter by ID
const getNewsletterById = async (id) => {
  return await Newsletter.findById(id);
};

// Create newsletter
const createNewsletter = async (data) => {
  const newsletter = new Newsletter(data);
  return await newsletter.save();
};

// Update newsletter
const updateNewsletter = async (id, data) => {
  return await Newsletter.findByIdAndUpdate(id, data, { new: true });
};

// Delete newsletter
const deleteNewsletter = async (id) => {
  return await Newsletter.findByIdAndDelete(id);
};

module.exports = {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
};
