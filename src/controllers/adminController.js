const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/userModel");
const { addTrAndUpdUser } = require("./transactionController");

async function modifyBalance(req, res, next) {
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();

        var description;

        if (req.body.amount < 0)
            description = "Funds withdrawn from your wallet";
        else
            description = "Funds deposited to your wallet";

        addTrAndUpdUser({
            uid: req.body.uid,
            amount: req.body.amount,
            description: description
        }, session);

        await session.commitTransaction();
        await session.endSession();

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


module.exports = {
    modifyBalance,
};