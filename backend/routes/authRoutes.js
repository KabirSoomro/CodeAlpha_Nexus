// I am importing the express library to create the router.
const express = require('express');
// I am creating a new router instance from express.
const router = express.Router();
// I am importing the authentication controller functions.
const { registerUser, loginUser, resetPassword } = require('../controllers/authController');

// I am defining a POST route for user registration, mapping it to registerUser.
router.post('/register', registerUser);
// I am defining a POST route for user login, mapping it to loginUser.
router.post('/login', loginUser);
// I am defining a POST route for password reset, mapping it to resetPassword.
router.post('/reset-password', resetPassword);
// I am defining a POST route alias for forgot-password, mapping it to resetPassword.
router.post('/forgot-password', resetPassword);

// I am exporting the router to use it in server.js.
module.exports = router;
