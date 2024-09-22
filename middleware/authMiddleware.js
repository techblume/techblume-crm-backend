const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Ensure the Authorization header exists
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();  // Continue to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
