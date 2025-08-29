// controllers/newsletterController.js
const newsletterService = require("../services/newsletter.services");
const { cloudinary } = require("../config/cloudinary");

// GET /api/newsletters
const getAll = async (req, res) => {
  try {
    const newsletters = await newsletterService.getAllNewsletters();
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/newsletters/:id
const getOne = async (req, res) => {
  try {
    const newsletter = await newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: "Not found" });
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/newsletters
const create = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  try {
    const { title, date, content } = req.body;

    const data = { title, date, content };
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (req.file) {
      data.image = req.file.path; // Cloudinary URL
      data.imageId = req.file.filename; // Cloudinary public_id
    }

    const newsletter = await newsletterService.createNewsletter(data);
    res.status(201).json(newsletter);
  } catch (error) {
    console.error("Create newsletter error:", error);
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, date, content } = req.body;
    const data = { title, date, content };

    const newsletter = await newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      // Delete old image from Cloudinary
      if (newsletter.imageId) {
        await cloudinary.uploader.destroy(newsletter.imageId);
      }

      data.image = req.file.path;
      data.imageId = req.file.filename;
    }

    const updatedNewsletter = await newsletterService.updateNewsletter(
      req.params.id,
      data
    );

    res.json(updatedNewsletter);
  } catch (error) {
    console.error("Update newsletter error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/newsletters/:id
const remove = async (req, res) => {
  try {
    const newsletter = await newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: "Not found" });

    // Delete image from Cloudinary if exists
    if (newsletter.imageId) {
      await cloudinary.uploader.destroy(newsletter.imageId);
    }

    // Delete newsletter from DB
    await newsletterService.deleteNewsletter(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
