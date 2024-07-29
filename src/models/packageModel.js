const mongoose = require("mongoose");

const PackageSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        percent_off: {
            type: Number,
            required: true
        },
        description: String
    }
);

const packageModel = mongoose.model("Package", PackageSchema);

module.exports = {
    PackageSchema,
    packageModel,
};