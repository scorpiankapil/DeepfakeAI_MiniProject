const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'your_development_secret'; // Use the same secret!

// Middleware function to protect routes
module.exports = function (req, res, next) {
    // Get token from header
    // The client should send the token in the format: "Bearer <token>"
    const token = req.header('x-auth-token'); 
    console.log(`Received Token: ${token}`);
    
    // Check if no token
    if (!token) {
        // 401: Authorization denied
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);

        // Attach the user object (containing the user ID) to the request
        req.user = decoded.user; 
        console.log(`Authenticated User ID: ${req.user.id}`);
        
        // Continue to the next middleware or route handler
        next(); 

    } catch (err) {
        // If token is invalid (e.g., expired, tampered with)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};