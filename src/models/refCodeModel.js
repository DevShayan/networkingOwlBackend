const mongoose = require("mongoose");
const { userModel } = require("./userModel");

const RefCodeSchema = mongoose.Schema(
    {
        uid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: userModel
        },
        code: {
            type: mongoose.Types.ObjectId,
            required: true
        }
    }
);

const refCodeModel = mongoose.model("Referral_Code", RefCodeSchema);

module.exports = {
    RefCodeSchema,
    refCodeModel,
};