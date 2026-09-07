// I am importing the jsonwebtoken library to verify JWTs.
const jwt = require('jsonwebtoken');
// I am importing the User model to fetch user details.
const User = require('../models/User');

const mongoose = require('mongoose');

// I am defining an asynchronous middleware function to protect routes.
const protect = async (req, res, next) => {
    // I am initializing a variable to hold the token.
    let token;

    // I am checking if the authorization header exists and starts with 'Bearer'.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // I am starting a try-catch block to handle token verification errors.
        try {
            // I am extracting the token from the authorization header.
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            // I am verifying the token using the secret key.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({ message: 'Database is currently connecting. Please wait or check Atlas IP whitelist.' });
            }

            // I am finding the user by the decoded ID and excluding the password from the result.
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // I am calling the next middleware or route handler.
            return next();
        // I am catching any errors during token verification.
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // I am checking if no token was found in the headers.
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// I am exporting the protect middleware for use in routes.
module.exports = { protect };
