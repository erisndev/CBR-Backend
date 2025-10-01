const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedPdfTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if it's an image
  if (file.fieldname === 'coverImage') {
    const isValidImage = allowedImageTypes.test(extname) && 
                         (mimetype.startsWith('image/'));
    if (isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed for cover image'));
    }
  }
  // Check if it's a PDF
  else if (file.fieldname === 'pdf') {
    const isValidPdf = allowedPdfTypes.test(extname) && 
                       mimetype === 'application/pdf';
    if (isValidPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for newsletter document'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

module.exports = { upload };