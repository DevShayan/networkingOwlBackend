const mongoose = require("mongoose");

const UnconfirmedEmailCodeSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        }
    }
);

const unconfirmedEmailCodeModel = mongoose.model("Unconfirmed_Emails", UnconfirmedEmailCodeSchema);

module.exports = {
    UnconfirmedEmailCodeSchema,
    unconfirmedEmailCodeModel,
};