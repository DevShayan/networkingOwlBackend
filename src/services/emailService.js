const nodemailer = require("nodemailer");
const { printError } = require("../constants/functions");

const transport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function sendVerificationEmail(recieverEmail, verificationCode) {
    const mailOptions = {
        from: {
            name: "NetworkingOwl - Testing",
            address: process.env.MAIL_USER
        },
        to: [recieverEmail],
        subject: "Account Verification",
        text: `Click this link to verify your account: https://localhost:8080/user/confirm-email/${verificationCode}`,
    };

    transport.sendMail(mailOptions)
    .catch((error) => printError(error.message));
}

function sendPassResetEmail(recieverEmail, resetCode) {
    const mailOptions = {
        from: {
            name: "NetworkingOwl - Testing",
            address: process.env.MAIL_USER
        },
        to: [recieverEmail],
        subject: "Password Reset",
        text: `Click this link to reset your password: http://localhost:5173/reset-pass?reset_code=${resetCode}`,
    };

    transport.sendMail(mailOptions)
    .catch((error) => printError(error.message));
}


module.exports = {
    sendVerificationEmail,
    sendPassResetEmail,
};