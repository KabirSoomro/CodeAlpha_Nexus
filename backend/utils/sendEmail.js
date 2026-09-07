// I am importing the nodemailer package to dispatch emails.
const nodemailer = require('nodemailer');

// I am defining a utility function to send password recovery emails.
const sendEmail = async (options) => {
    // I am checking if SMTP credentials exist in the environment variables.
    const hasSmtpConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (hasSmtpConfig) {
        // I am creating a transporter configured with the provided SMTP credentials.
        const transporter = nodemailer.createTransport({
            // I am using the configured service or defaulting to gmail.
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                // I am using the email address from environment variables.
                user: process.env.EMAIL_USER,
                // I am using the email app password from environment variables.
                pass: process.env.EMAIL_PASS
            }
        });

        // I am defining the email dispatch payload.
        const mailOptions = {
            // I am setting the sender name and email address.
            from: `"Nexus Project Management" <${process.env.EMAIL_USER}>`,
            // I am setting the recipient email address.
            to: options.email,
            // I am setting the email subject line.
            subject: options.subject,
            // I am setting the plain text fallback version.
            text: options.message,
            // I am setting the rich HTML body.
            html: options.html
        };

        // I am sending the email via the configured transporter.
        const info = await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${options.email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
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
