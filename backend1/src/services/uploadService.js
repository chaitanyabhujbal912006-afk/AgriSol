/**
 * Upload Service - Cloudinary
 */

const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ── Upload buffer to Cloudinary ───────────────
const uploadToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'agrisol',
        resource_type: 'image',
        transformation: options.transformation || [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ── Delete from Cloudinary ────────────────────
const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    logger.error('Cloudinary delete error:', err);
  }
};

// ── Process image before upload ───────────────
const processImage = async (buffer, options = {}) => {
  try {
    return await sharp(buffer)
      .resize(options.width || 1200, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: options.quality || 85, progressive: true })
      .toBuffer();
  } catch (err) {
    logger.error('Image processing error:', err);
    return buffer; // Return original if processing fails
  }
};

// ── Multer memory storage setup ───────────────
const multer = require('multer');

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`, 400), false);
    }
  },
});

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  processImage,
  upload: multerConfig,
};
