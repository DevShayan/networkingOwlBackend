const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema(
    {
        name: {
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
        date_joined: {
            type: Date,
            default: Date.now() + 18000000
        }
    }
);

const adminModel = mongoose.model("Admin", AdminSchema);

module.exports = {
    AdminSchema,
    adminModel,
};