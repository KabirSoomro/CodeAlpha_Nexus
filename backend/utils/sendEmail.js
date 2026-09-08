// I am importing the nodemailer package to dispatch emails.
const nodemailer = require('nodemailer');

// I am defining a utility function to send password recovery emails.
const sendEmail = async (options) => {
    // I am resolving the email user from environment variables with case-insensitive fallbacks.
    const rawUser = process.env.EMAIL_USER || process.env.email_user || process.env.Email_User || process.env.EMAIL || process.env.GMAIL_USER;
    // I am resolving the email password from environment variables with case-insensitive fallbacks.
    const rawPass = process.env.EMAIL_PASS || process.env.email_pass || process.env.Email_Pass || process.env.EMAIL_PASSWORD || process.env.APP_PASSWORD || process.env.GMAIL_PASS;

    // I am checking if SMTP credentials exist in the environment variables.
    const hasSmtpConfig = Boolean(rawUser && rawPass);

    if (hasSmtpConfig) {
        // I am sanitizing email and removing spaces from app passwords.
        const cleanUser = rawUser.trim();
        const cleanPass = rawPass.replace(/\s+/g, '');

        // I am creating a transporter configured with Gmail SMTP.
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                // I am using the sanitized email address.
                user: cleanUser,
                // I am using the sanitized app password.
                pass: cleanPass
            }
        });

        // I am defining the email dispatch payload.
        const mailOptions = {
            // I am setting the sender name and email address.
            from: `"Nexus Project Management" <${cleanUser}>`,
            // I am setting the recipient email address.
            to: options.email,
            // I am setting the email subject line.
            subject: options.subject,
            // I am setting the plain text fallback version.
            text: options.message,
            // I am setting the rich HTML body.
            html: options.html
        };

        try {
            // I am sending the email via the configured transporter.
            const info = await transporter.sendMail(mailOptions);
            console.log(`Password reset email successfully delivered to ${options.email}: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (emailError) {
            console.error(`Failed to send email via SMTP to ${options.email}:`, emailError.message);
            throw emailError;
        }
    } else {
        // I am logging a simulated email dispatch when SMTP credentials are not yet configured in production.
        console.log('----------------------------------------------------');
        console.log(`[SIMULATED EMAIL] Password Reset Link for ${options.email}:`);
        console.log(`Reset URL: ${options.resetUrl}`);
        console.log('To send real emails to inboxes, add EMAIL_USER and EMAIL_PASS to Render Environment Variables.');
        console.log('----------------------------------------------------');
        return { success: true, simulated: true, resetUrl: options.resetUrl };
    }
// I am closing the sendEmail function.
};

// I am exporting the sendEmail utility function.
module.exports = sendEmail;
