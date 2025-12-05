const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Must match!
    api_key: process.env.CLOUDINARY_API_KEY,       // Must match!
    api_secret: process.env.CLOUDINARY_API_SECRET, // Must match!
});

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'deepfake-detector-avatars', // Separate folder for avatars
        allowed_formats: ['jpeg', 'png', 'jpg'],
        // transformation: [{ width: 150, height: 150, crop: 'thumb' }] // Optional resize
    },
});

// Multer middleware configured for a single file named 'avatar'
const avatarUpload = multer({ storage: avatarStorage }).single('avatar');

module.exports = {
    avatarUpload
};