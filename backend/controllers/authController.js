// I am importing mongoose to check database connection status before operations.
const mongoose = require('mongoose');
// I am importing the built-in crypto module for token hashing comparisons.
const crypto = require('crypto');
// I am importing the User model to interact with the users collection.
const User = require('../models/User');
// I am importing jsonwebtoken to generate tokens upon login and registration.
const jwt = require('jsonwebtoken');
// I am importing the sendEmail utility to dispatch password recovery emails.
const sendEmail = require('../utils/sendEmail');

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

// I am defining the forgotPassword controller function to dispatch a time-limited reset link to the user's email.
const forgotPassword = async (req, res) => {
    // I am starting a try-catch block for forgot password handling.
    try {
        // I am extracting the email address from the request body.
        let { email } = req.body;

        // I am validating that an email address was provided.
        if (!email) {
            return res.status(400).json({
                field: 'email',
                message: 'Please provide your registered email address.'
            });
        }

        // I am sanitizing the email input.
        email = email.trim().toLowerCase();

        // I am checking database connectivity status.
        if (!isDBReady()) {
            return res.status(503).json({
                field: 'general',
                message: 'Database is currently connecting. Please try again shortly.'
            });
        }

        // I am searching for the user document by email.
        const user = await User.findOne({ email });

        // I am returning a 404 response if no account exists with that email.
        if (!user) {
            return res.status(404).json({
                field: 'email',
                accountExists: false,
                message: 'No account registered with this email address.'
            });
        }

        // I am generating a cryptographically secure reset token on the user model.
        const resetToken = user.getResetPasswordToken();

        // I am saving the user document with the hashed token and expiration.
        await user.save({ validateBeforeSave: false });

        // I am determining the base frontend URL.
        const frontendBaseUrl = process.env.FRONTEND_URL || 'https://code-alpha-nexus-laqo.vercel.app';
        // I am constructing the full password reset link pointing to the frontend reset screen.
        const resetUrl = `${frontendBaseUrl}/?resetToken=${resetToken}`;

        // I am preparing the HTML content for the password reset email.
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0f111a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #6366f1; margin: 0; font-size: 26px;">Nexus</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Project Management Platform</p>
                </div>
                <h2 style="color: #f1f5f9; font-size: 20px;">Password Reset Request</h2>
                <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">
                    Hi <strong>${user.username}</strong>, you are receiving this email because a password reset request was submitted for your Nexus account.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1, #ec4899); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px;">Reset My Password</a>
                </div>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    This link is valid for <strong>30 minutes</strong> only. If you did not request this, please ignore this email and your password will remain unchanged.
                </p>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
                <p style="color: #64748b; font-size: 12px; word-break: break-all;">
                    Or copy and paste this URL into your browser:<br/>
                    <a href="${resetUrl}" style="color: #6366f1;">${resetUrl}</a>
                </p>
            </div>
        `;

        // I am attempting to dispatch the email via the sendEmail utility.
        const emailResult = await sendEmail({
            email: user.email,
            subject: 'Nexus — Password Reset Request',
            message: `You requested a password reset. Please use the following link: ${resetUrl}`,
            html,
            resetUrl
        });

        // I am returning a clean success response to the client without exposing internal reset URLs.
        res.status(200).json({
            success: true,
            message: 'A secure password reset link has been dispatched to your registered email address. Please check your inbox (and spam folder).'
        });
    // I am catching any unexpected errors during the process.
    } catch (error) {
        res.status(500).json({
            field: 'general',
            message: error.message || 'An error occurred while generating the reset link.'
        });
    }
// I am closing the forgotPassword function.
};

// I am defining the resetPassword controller function to securely set a new password via token.
const resetPassword = async (req, res) => {
    // I am starting a try-catch block to handle password reset errors.
    try {
        // I am extracting the reset token from URL parameters or request body.
        const token = req.params.token || req.body.token;
        // I am extracting the new password from the request body.
        const { newPassword } = req.body;

        // I am validating that both a token and a new password were provided.
        if (!token || !newPassword) {
            return res.status(400).json({
                field: !token ? 'token' : 'password',
                message: !token ? 'Missing or invalid password reset token.' : 'Please enter a new password.'
            });
        }

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

        // I am hashing the received reset token to compare with the database record.
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        // I am finding the user with a matching token that has not expired.
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        // I am rejecting the request if the token is invalid or has expired.
        if (!user) {
            return res.status(400).json({
                field: 'general',
                message: 'This password reset link is invalid or has expired. Please request a new one.'
            });
        }

        // I am updating the user's password; the pre-save hook will hash it with bcrypt.
        user.password = newPassword;
        // I am clearing the reset token fields once successfully consumed.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        // I am saving the updated user document to MongoDB Atlas.
        await user.save();

        // I am returning a success response to the client.
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
module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
