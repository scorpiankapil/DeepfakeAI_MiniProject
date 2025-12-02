const mongoose = require('mongoose');

// Define the schema for a user
const userSchema = new mongoose.Schema({
    // User's email, must be unique and is required
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes leading/trailing whitespace
        lowercase: true, // Stores all emails as lowercase
    },
    // User's password, stored as a BCRYPT hash
    password: {
        type: String,
        required: true,
    },
    avatarUrl: { // <-- New field
        type: String,
        required: false,
        default: null,
    },
    // Optional: Keep track of when the user was created
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;