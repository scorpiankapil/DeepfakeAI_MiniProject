const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Configure Cloudinary credentials
cloudinary.config({
    cloud_name: 'dze0d5jm0',
    api_key: '378733519315636',
    api_secret: 'l_vN5qEKLb5rNbwL2fXOM9rZ0Pg',
});

// 2. Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'deepfake-detector-uploads', // Folder in your Cloudinary account
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional image transformation
    },
});

// 3. Create the Multer upload middleware
// .single('picture') means it expects one file named 'picture' 
// (which matches the key you used in the frontend FormData)
const upload = multer({ storage: storage }).single('picture');

module.exports = {
    cloudinary, // Export the configured client if needed elsewhere
    upload // Export the multer middleware for use in routes
};