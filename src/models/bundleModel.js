const mongoose = require("mongoose");

const BundleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        drive_link: {
            type: String,
            required: true
        },
        image_link: {
	type: String,
	required: true
	},
        description_points: [ String ]
    }
);

const bundleModel = mongoose.model("Bundle", BundleSchema);

module.exports = {
    BundleSchema,
    bundleModel,
};
