const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mp3|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and media files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Utility function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`
  };
};

// Utility function to validate file size
const validateFileSize = (file, maxSizeInMB = 10) => {
  const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};

// Utility function to get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Utility function to check if file is image
const isImage = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.includes(getFileExtension(filename));
};

// Utility function to check if file is document
const isDocument = (filename) => {
  const docExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
  return docExtensions.includes(getFileExtension(filename));
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFileInfo,
  validateFileSize,
  getFileExtension,
  isImage,
  isDocument,
  uploadsDir
};
