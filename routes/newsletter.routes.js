// routes/newsletterRoutes.js
const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");
const controller = require("../controllers/newsletter.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public routes (no authentication required)
router.get("/public", controller.getAllPublic); // Get published newsletters with pagination
router.get("/latest", controller.getLatest); // Get latest published newsletter

// Admin routes (authentication required)
router.get("/admin", protect, adminOnly, controller.getAllAdmin); // Get all newsletters (including unpublished)

// Single newsletter route (public)
router.get("/:id", controller.getOne); // Get single newsletter by ID

// Protected admin routes for CRUD operations

// Create newsletter with multiple files (admin only)
router.post("/", 
  protect,
  adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]), 
  controller.create
);

// Update newsletter with optional file updates (admin only)
router.put("/:id", 
  protect,
  adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]), 
  controller.update
);

// Delete newsletter (admin only)
router.delete("/:id", protect, adminOnly, controller.remove);

// Toggle publish status (admin only)
router.patch("/:id/toggle-publish", protect, adminOnly, controller.togglePublish);

module.exports = router;
