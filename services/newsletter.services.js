// services/newsletterService.js
const Newsletter = require("../models/newsletter.model");

// Get all newsletters
const getAllNewsletters = async (includeUnpublished = false) => {
  const query = includeUnpublished ? {} : { isPublished: true };
  return await Newsletter.find(query).sort({ publishDate: -1 });
};

// Get single newsletter by ID
const getNewsletterById = async (id) => {
  return await Newsletter.findById(id);
};

// Get latest published newsletter
const getLatestNewsletter = async () => {
  return await Newsletter.findOne({ isPublished: true })
    .sort({ publishDate: -1 });
};

// Get published newsletters with pagination
const getPublishedNewsletters = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const newsletters = await Newsletter.find({ isPublished: true })
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Newsletter.countDocuments({ isPublished: true });
  
  return {
    newsletters,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalNewsletters: total
  };
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

// Toggle publish status
const togglePublishStatus = async (id) => {
  const newsletter = await Newsletter.findById(id);
  if (!newsletter) {
    throw new Error('Newsletter not found');
  }
  
  newsletter.isPublished = !newsletter.isPublished;
  return await newsletter.save();
};

module.exports = {
  getAllNewsletters,
  getNewsletterById,
  getLatestNewsletter,
  getPublishedNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  togglePublishStatus
};
