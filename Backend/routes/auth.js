
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { check } = require('express-validator'); // Useful for input validation
const { avatarUpload } = require('../config/avatarUploadConfig'); // Import the upload middleware

// @route   POST api/auth/signup
router.post(
    '/signup',
    // 1. Run the file upload middleware first. It will process the 'avatar' field.
    avatarUpload, 
    [
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    authController.signup // The controller will handle the rest
);

// @route   POST api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/signin',
    [
        // Only checking if fields exist for login
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.signin
);

module.exports = router;