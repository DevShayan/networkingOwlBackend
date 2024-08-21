const nodemailer = require("nodemailer");
const { printError } = require("../constants/functions");
const { serverBaseURL, clientBaseURL } = require("../constants/urls");

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
        text: `Click this link to verify your account: ${serverBaseURL}/user/confirm-email/${verificationCode}`,
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
        text: `Click this link to reset your password: ${clientBaseURL}/reset-pass?reset_code=${resetCode}`,
    };

    transport.sendMail(mailOptions)
    .catch((error) => printError(error.message));
}


module.exports = {
    sendVerificationEmail,
    sendPassResetEmail,
};