// controllers/newsletterController.js
const newsletterService = require("../services/newsletter.services");
const supabaseStorage = require("../services/supabaseStorage.services");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/newsletters - Get all newsletters (admin)
const getAllAdmin = asyncHandler(async (req, res) => {
  const newsletters = await newsletterService.getAllNewsletters(true); // Include unpublished
  res.json({
    success: true,
    data: newsletters,
  });
});

// GET /api/newsletters/public - Get published newsletters (public)
const getAllPublic = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await newsletterService.getPublishedNewsletters(page, limit);
  res.json({
    success: true,
    data: result,
  });
});

// GET /api/newsletters/latest - Get latest published newsletter
const getLatest = asyncHandler(async (req, res) => {
  const newsletter = await newsletterService.getLatestNewsletter();
  if (!newsletter) {
    return res.status(404).json({
      success: false,
      message: "No published newsletters found",
    });
  }
  res.json({
    success: true,
    data: newsletter,
  });
});

// GET /api/newsletters/:id - Get single newsletter
const getOne = asyncHandler(async (req, res) => {
  const newsletter = await newsletterService.getNewsletterById(req.params.id);
  if (!newsletter) {
    return res.status(404).json({
      success: false,
      message: "Newsletter not found",
    });
  }
  res.json({
    success: true,
    data: newsletter,
  });
});

// POST /api/newsletters - Create newsletter
const create = asyncHandler(async (req, res) => {
  console.log("Creating newsletter with data:", {
    title: req.body.title,
    publishDate: req.body.publishDate,
    files: req.files ? Object.keys(req.files) : "No files",
  });

  const { title, publishDate } = req.body;

  // Validate required fields
  if (!title || !publishDate) {
    return res.status(400).json({
      success: false,
      error: "Title and publish date are required",
    });
  }

  // Validate required files
  if (!req.files || !req.files.coverImage || !req.files.pdf) {
    return res.status(400).json({
      success: false,
      error: "Both cover image and PDF are required",
    });
  }

  const coverImageFile = req.files.coverImage[0];
  const pdfFile = req.files.pdf[0];

  try {
    // Upload cover image to Supabase
    const coverImageData = await supabaseStorage.uploadFile(
      coverImageFile.buffer,
      coverImageFile.originalname,
      coverImageFile.mimetype,
      "images"
    );

    // Upload PDF to Supabase
    const pdfData = await supabaseStorage.uploadFile(
      pdfFile.buffer,
      pdfFile.originalname,
      pdfFile.mimetype,
      "pdfs"
    );

    // Create newsletter in database
    const newsletterData = {
      title,
      publishDate: new Date(publishDate),
      coverImage: {
        url: coverImageData.url,
        fileName: coverImageData.fileName,
      },
      pdf: {
        url: pdfData.url,
        fileName: pdfData.fileName,
      },
      isPublished: true, // Default to published when created
    };

    const newsletter = await newsletterService.createNewsletter(newsletterData);

    res.status(201).json({
      success: true,
      data: newsletter,
      message: "Newsletter created and published successfully",
    });
  } catch (error) {
    console.error("Create newsletter error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/newsletters/:id - Update newsletter
const update = asyncHandler(async (req, res) => {
  const { title, publishDate, isPublished } = req.body;

  const newsletter = await newsletterService.getNewsletterById(req.params.id);
  if (!newsletter) {
    return res.status(404).json({
      success: false,
      message: "Newsletter not found",
    });
  }

  const updateData = {};

  // Update basic fields if provided
  if (title) updateData.title = title;
  if (publishDate) updateData.publishDate = publishDate;
  if (isPublished !== undefined)
    updateData.isPublished = isPublished === "true" || isPublished === true;

  try {
    // Handle cover image update
    if (req.files && req.files.coverImage) {
      const coverImageFile = req.files.coverImage[0];

      // Delete old image from Supabase
      const oldImagePath = supabaseStorage.extractFilePath(
        newsletter.coverImage.url
      );
      if (oldImagePath) {
        await supabaseStorage.deleteFile(oldImagePath);
      }

      // Upload new image
      const coverImageData = await supabaseStorage.uploadFile(
        coverImageFile.buffer,
        coverImageFile.originalname,
        coverImageFile.mimetype,
        "images"
      );

      updateData.coverImage = {
        url: coverImageData.url,
        fileName: coverImageData.fileName,
      };
    }

    // Handle PDF update
    if (req.files && req.files.pdf) {
      const pdfFile = req.files.pdf[0];

      // Delete old PDF from Supabase
      const oldPdfPath = supabaseStorage.extractFilePath(newsletter.pdf.url);
      if (oldPdfPath) {
        await supabaseStorage.deleteFile(oldPdfPath);
      }

      // Upload new PDF
      const pdfData = await supabaseStorage.uploadFile(
        pdfFile.buffer,
        pdfFile.originalname,
        pdfFile.mimetype,
        "pdfs"
      );

      updateData.pdf = {
        url: pdfData.url,
        fileName: pdfData.fileName,
      };
    }

    const updatedNewsletter = await newsletterService.updateNewsletter(
      req.params.id,
      updateData
    );

    res.json({
      success: true,
      data: updatedNewsletter,
      message: "Newsletter updated successfully",
    });
  } catch (error) {
    console.error("Update newsletter error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/newsletters/:id - Delete newsletter
const remove = asyncHandler(async (req, res) => {
  const newsletter = await newsletterService.getNewsletterById(req.params.id);
  if (!newsletter) {
    return res.status(404).json({
      success: false,
      message: "Newsletter not found",
    });
  }

  try {
    // Delete files from Supabase
    const imagePath = supabaseStorage.extractFilePath(
      newsletter.coverImage.url
    );
    const pdfPath = supabaseStorage.extractFilePath(newsletter.pdf.url);

    const filesToDelete = [];
    if (imagePath) filesToDelete.push(imagePath);
    if (pdfPath) filesToDelete.push(pdfPath);

    if (filesToDelete.length > 0) {
      await supabaseStorage.deleteFiles(filesToDelete);
    }

    // Delete newsletter from database
    await newsletterService.deleteNewsletter(req.params.id);

    res.json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.error("Delete newsletter error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/newsletters/:id/toggle-publish - Toggle publish status
const togglePublish = asyncHandler(async (req, res) => {
  const newsletter = await newsletterService.togglePublishStatus(req.params.id);

  res.json({
    success: true,
    data: newsletter,
    message: `Newsletter ${
      newsletter.isPublished ? "published" : "unpublished"
    } successfully`,
  });
});

module.exports = {
  getAllAdmin,
  getAllPublic,
  getLatest,
  getOne,
  create,
  update,
  remove,
  togglePublish,
};
