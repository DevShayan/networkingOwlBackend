const { default: mongoose } = require("mongoose");
const { passResetCodeModel } = require("../models/passResetCodeModel");
const { userModel } = require("../models/userModel");
const { sendPassResetEmail } = require("../services/emailService");

async function reqPassReset(req, res, next) {
    try {
        const dbUser = await userModel.findOne({
            email: req.body.email
        });

        if (dbUser == null) {
            throw new Error("Email not found");
        }

        // check if code already exists for this user
        var passResetCode = await passResetCodeModel.findOne({
            email: req.body.email
        });

        // no code exists - generate one
        if (passResetCode == null) {
            passResetCode = await passResetCodeModel.create({
                email: dbUser.email
            });
        }

        // send pass reset link
        sendPassResetEmail(passResetCode.email, passResetCode._id)

        res.json({
            error: null,
            data: `Password reset link sent to ${passResetCode.email}`
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function resetPass(req, res, next) {
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();

        const passResetCode = await passResetCodeModel.findById(req.body.code);

        if (passResetCode == null) {
            throw new Error("Link expired or invalid");
        }

        const passHash = await bcrypt.hash(req.body.new_pass, 10);

        await userModel.updateOne(
            {
                email: passResetCode.email
            },
            {
                $set: {
                    password: passHash
                }
            },
            {
                session: session
            }
        );

        await passResetCodeModel.deleteOne({
            _id: req.body.code
        }).session(session);

        await session.commitTransaction();
        await session.endSession();


        res.json({
            error: null,
            data: "Password reset successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}


module.exports = {
    reqPassReset,
    resetPass,
};