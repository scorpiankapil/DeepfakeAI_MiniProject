const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT generation (Use a strong environment variable!)
const jwtSecret = process.env.JWT_SECRET || 'your_development_secret';

// --- Sign Up Function (Complete Code) ---
exports.signup = async (req, res) => {
    // IMPORTANT: Multer processes the body, so these fields come from req.body
    const { email, password } = req.body;
    
    // Cloudinary result is attached to req.file by the Multer middleware
    const avatarUrl = req.file ? req.file.path : null; 

    // --- CRITICAL DEBUGGING CHECK (Optional but recommended) ---
    // If these fields are missing, Multer likely failed to process the FormData correctly.
    if (!email || !password) {
        console.error("Critical: Email or password missing from req.body. Check Multer/FormData.");
        // If an avatar was uploaded but the sign-up failed, delete the image from Cloudinary (optional advanced cleanup)
        // You would need to import cloudinary and run cloudinary.uploader.destroy() here.
        return res.status(400).json({ msg: 'Email and password are required.' });
    }
    // -----------------------------------------------------------

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            // Note: If an avatar was uploaded, you might want to delete it from Cloudinary here!
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create a new user instance (locally)
        user = new User({
            email,
            password, // Stored as plaintext temporarily
            avatarUrl: avatarUrl, // Include the optional avatar URL
        });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt); // Overwrite plaintext with hash

        // 4. Save the new user to the database
        await user.save(); 

        // 5. Generate and sign the JWT token
        const payload = {
            user: {
                id: user.id, // Use MongoDB's _id as the payload
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // Send the JWT and the user's avatar URL back to the client
                res.json({ token, avatarUrl }); 
            }
        );

    } catch (err) {
        // This catches MongoDB/Bcrypt/JWT errors
        console.error("Sign Up Server Error:", err.message);
        // Do NOT send the raw error to the frontend; send a generic 500
        res.status(500).send('Server error during sign up'); 
    }
};

// --- Sign In Function (Unchanged) ---
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        // ... (rest of the sign-in logic) ...

        // 3. Generate and sign the JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    avatarUrl: user.avatarUrl // Include the URL read from the DB
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during sign in');
    }
};