const mongoose = require("mongoose");
const { userModel } = require("./userModel");

// from and to not added as one is always admin and the other is always current user
const TransactionSchema = mongoose.Schema(
    {
        uid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: userModel
        },
        amount: {
            type: Number,
            required: true
        },
        time_stamp: {
            type: Date,
            default: Date.now() + 18000000
        },
        description: String
    }
);

const transactionModel = mongoose.model("Transactions", TransactionSchema);

module.exports = {
    TransactionSchema,
    transactionModel,
};