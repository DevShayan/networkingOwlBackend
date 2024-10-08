const mongoose = require("mongoose");
const { packageModel } = require("./packageModel");
const { bundleModel } = require("./bundleModel");

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        phone_no: {
            type: String,
            required: true
        },
        date_joined: {
            type: Date,
            default: Date.now() + 18000000
        },
        balance: {
            type: Number,
            default: 0
        },
        curr_package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: packageModel
        },
        bundles_bought: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: bundleModel
        }],
        people_referred: [ String ],
        image_link: String,
        referred_by: String,
    }
);

const userModel = mongoose.model("User", UserSchema);

module.exports = {
    UserSchema,
    userModel,
};