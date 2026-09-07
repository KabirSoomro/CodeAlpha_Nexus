// I am importing mongoose to check database connection status before operations.
const mongoose = require('mongoose');
// I am importing the User model to interact with the users collection.
const User = require('../models/User');
// I am importing jsonwebtoken to generate tokens upon login and registration.
const jwt = require('jsonwebtoken');

// I am defining a helper to check if MongoDB is currently connected.
const isDBReady = () => mongoose.connection.readyState === 1;

// I am defining a helper function to generate a JWT.
const generateToken = (id) => {
    // I am returning a signed token containing the user ID, using the secret, expiring in 30 days.
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// I am closing the generateToken function.
};

// I am defining the registerUser controller function.
const registerUser = async (req, res) => {
    // I am starting a try-catch block to handle registration errors.
    try {
        // I am extracting username, email, and password from the request body.
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                field: 'general',
                message: 'Please fill in all fields (Username, Email, and Password).'
            });
        }

        username = username.trim();
        email = email.trim().toLowerCase();

        // If MongoDB is not connected, respond immediately without buffering timeout.
        if (!isDBReady()) {
            return res.status(503).json({
                field: 'general',
                message: 'Database is connecting or IP not whitelisted in MongoDB Atlas. Please ensure your IP (39.34.187.115) is whitelisted in Atlas Network Access.'
            });
        }

        // I am checking if a user already exists with the given email.
        const userExists = await User.findOne({ email });

        // I am returning a 400 response if the user already exists.
        if (userExists) {
            return res.status(400).json({
                field: 'email',
                accountExists: true,
                message: 'An account is already registered with this email. Please sign in.'
            });
        }

        // I am checking if username is taken.
        const usernameTaken = await User.findOne({ username });
        if (usernameTaken) {
            return res.status(400).json({
                field: 'username',
                message: 'This username is already taken. Please choose another.'
            });
        }

        // I am creating a new user in the database with the provided details.
        const user = await User.create({ username, email, password });

        // I am checking if the user was successfully created.
        if (user) {
            // I am sending a 201 Created response with user data and a token.
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            // I am handling the case where user creation fails.
            res.status(400).json({
                field: 'general',
                message: 'Invalid user data.'
            });
        }
    // I am catching any unexpected errors during registration.
    } catch (error) {
        res.status(500).json({
            field: 'general',
            message: error.message || 'Server error during registration.'
        });
    }
// I am closing the registerUser function.
};

// I am defining the loginUser controller function.
const loginUser = async (req, res) => {
    // I am starting a try-catch block to handle login errors.
    try {
        // I am extracting email and password from the request body.
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                field: !email ? 'email' : 'password',
                message: !email ? 'Please enter your email address.' : 'Please enter your password.'
            });
        }

        email = email.trim().toLowerCase();

        // If MongoDB is not connected, respond immediately without buffering timeout.
        if (!isDBReady()) {
            return res.status(503).json({
                field: 'general',
                message: 'Database is connecting or IP not whitelisted in MongoDB Atlas. Please ensure your IP (39.34.187.115) is whitelisted in Atlas Network Access.'
            });
        }

        // I am finding the user in the database by their email.
        const user = await User.findOne({ email });

        // If no user exists with this email:
        if (!user) {
            return res.status(404).json({
                field: 'email',
                accountExists: false,
                message: 'No account found with this email address. Please check or sign up.'
            });
        }

        // User exists! Now check if password matches.
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                field: 'password',
                accountExists: true,
                message: 'Incorrect password! Account exists for this email, but the password does not match.'
            });
        }

        // Credentials are valid, send successful login response.
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    // I am catching any unexpected errors during login.
    } catch (error) {
        res.status(500).json({
            field: 'general',
            message: error.message || 'An error occurred during login.'
        });
    }
// I am closing the loginUser function.
};

// I am defining the resetPassword controller function to securely reset a forgotten password.
const resetPassword = async (req, res) => {
    // I am starting a try-catch block to handle password reset errors.
    try {
        // I am extracting email and newPassword from the request body.
        let { email, newPassword } = req.body;

        // I am validating that both email and new password were provided.
        if (!email || !newPassword) {
            return res.status(400).json({
                field: !email ? 'email' : 'password',
                message: !email ? 'Please provide your registered email address.' : 'Please enter a new password.'
            });
        }

        // I am sanitizing the email input.
        email = email.trim().toLowerCase();

        // I am checking password length constraints.
        if (newPassword.length < 6) {
            return res.status(400).json({
                field: 'password',
                message: 'Password must be at least 6 characters long.'
            });
        }

        // I am checking database readiness.
        if (!isDBReady()) {
            return res.status(503).json({
                field: 'general',
                message: 'Database is currently connecting. Please try again shortly.'
            });
        }

        // I am looking up the user in the database by their email.
        const user = await User.findOne({ email });

        // I am returning a 404 error if no account matches the given email.
        if (!user) {
            return res.status(404).json({
                field: 'email',
                accountExists: false,
                message: 'No account registered with this email address.'
            });
        }

        // I am updating the user's password; the pre-save hook will automatically hash it with bcrypt.
        user.password = newPassword;
        // I am saving the updated user document to MongoDB Atlas.
        await user.save();

        // I am returning a success response informing the client the password has been reset.
        res.status(200).json({
            success: true,
            message: 'Password reset successfully! You can now sign in with your new password.'
        });
    // I am catching any unexpected server errors.
    } catch (error) {
        res.status(500).json({
            field: 'general',
            message: error.message || 'An error occurred while resetting the password.'
        });
    }
// I am closing the resetPassword function.
};

// I am exporting the controller functions for use in routes.
module.exports = { registerUser, loginUser, resetPassword };
