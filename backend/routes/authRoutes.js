// I am importing the express library to create the router.
const express = require('express');
// I am creating a new router instance from express.
const router = express.Router();
// I am importing the authentication controller functions.
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

// I am defining a POST route for user registration, mapping it to registerUser.
router.post('/register', registerUser);
// I am defining a POST route for user login, mapping it to loginUser.
router.post('/login', loginUser);
// I am defining a POST route to send a secure password reset email.
router.post('/forgot-password', forgotPassword);
// I am defining a POST route for resetting password using a token parameter.
router.post('/reset-password/:token', resetPassword);
// I am defining a POST route for resetting password using token in request body.
router.post('/reset-password', resetPassword);

// I am defining a GET route to safely check if email SMTP is configured in the environment.
router.get('/status', (req, res) => {
    // I am resolving email credentials with case-insensitive fallbacks.
    const rawUser = process.env.EMAIL_USER || process.env.email_user || process.env.Email_User || process.env.EMAIL || process.env.GMAIL_USER;
    const rawPass = process.env.EMAIL_PASS || process.env.email_pass || process.env.Email_Pass || process.env.EMAIL_PASSWORD || process.env.APP_PASSWORD || process.env.GMAIL_PASS;
    const isConfigured = Boolean(rawUser && rawPass);

    // I am returning the configuration status and listing detected env key names safely.
    res.json({
        ok: true,
        smtpConfigured: isConfigured,
        sender: isConfigured ? `${rawUser.slice(0, 3)}***@gmail.com` : 'Not Configured',
        envKeysDetected: Object.keys(process.env).filter(k => {
            const lk = k.toLowerCase();
            return lk.includes('email') || lk.includes('pass') || lk.includes('gmail');
        })
    });
});

// I am exporting the router to use it in server.js.
module.exports = router;
