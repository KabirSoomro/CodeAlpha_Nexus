// I am importing the mongoose library to create schemas and models.
const mongoose = require('mongoose');
// I am importing the bcrypt library to hash user passwords.
const bcrypt = require('bcrypt');

// I am defining the user schema using Mongoose.
const userSchema = new mongoose.Schema({
    // I am defining the username field as a required string.
    username: {
        // I am setting the type to String.
        type: String,
        // I am making the username field mandatory.
        required: true,
        // I am ensuring the username is unique in the database.
        unique: true
    // I am closing the username field definition.
    },
    // I am defining the email field as a required string.
    email: {
        // I am setting the type to String.
        type: String,
        // I am making the email field mandatory.
        required: true,
        // I am ensuring the email is unique in the database.
        unique: true
    // I am closing the email field definition.
    },
    // I am defining the password field as a required string.
    password: {
        // I am setting the type to String.
        type: String,
        // I am making the password field mandatory.
        required: true
    // I am closing the password field definition.
    },
    // I am storing the hashed password reset token.
    resetPasswordToken: {
        // I am defining the type as String.
        type: String
    // I am closing the resetPasswordToken field.
    },
    // I am storing the expiration timestamp for the password reset token.
    resetPasswordExpire: {
        // I am defining the type as Date.
        type: Date
    // I am closing the resetPasswordExpire field.
    }
// I am adding timestamps to automatically record createdAt and updatedAt fields.
}, { timestamps: true });

// I am importing the built-in crypto module to generate secure random reset tokens.
const crypto = require('crypto');

// I am adding a pre-save hook to hash the password before saving the user document.
userSchema.pre('save', async function() {
    // I am checking if the password field has been modified; if not, I am skipping hashing.
    if (!this.isModified('password')) {
        // I am returning early from the async function.
        return;
    // I am closing the if statement.
    }
    // I am generating a salt for bcrypt hashing with a cost factor of 10.
    const salt = await bcrypt.genSalt(10);
    // I am hashing the user's password with the generated salt and replacing the plain text password.
    this.password = await bcrypt.hash(this.password, salt);
// I am closing the pre-save hook callback function.
});

// I am defining a method on the user schema to compare a given password with the hashed password.
userSchema.methods.matchPassword = async function(enteredPassword) {
    // I am returning the boolean result of the bcrypt comparison.
    return await bcrypt.compare(enteredPassword, this.password);
// I am closing the matchPassword method definition.
};

// I am defining a method to generate and hash a password reset token.
userSchema.methods.getResetPasswordToken = function() {
    // I am generating a cryptographically secure 20-byte random hex token.
    const resetToken = crypto.randomBytes(20).toString('hex');
    // I am hashing the token with SHA-256 and storing it in the user document.
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // I am setting the reset token expiration to 30 minutes from now.
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    // I am returning the unhashed reset token to be sent in the email.
    return resetToken;
// I am closing the getResetPasswordToken method.
};

// I am creating the User model from the schema.
const User = mongoose.model('User', userSchema);

// I am exporting the User model to use it in controllers.
module.exports = User;
