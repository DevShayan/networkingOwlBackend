const mongoose = require("mongoose");

const PassResetCodeSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        }
    }
);

const passResetCodeModel = mongoose.model("Pass_Reset_Code", PassResetCodeSchema);

module.exports = {
    PassResetCodeSchema,
    passResetCodeModel,
};