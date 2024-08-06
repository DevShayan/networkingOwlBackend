const { printWarning } = require("../constants/functions");
const { bundleModel } = require("../models/bundleModel");
const { packageModel } = require("../models/packageModel");

async function getPackages(req, res, next) {
    try {
        const packages = await packageModel.find({});

        if (packages.length == 0) {
            throw new Error("No package exist in db");
        }

        res.json({
            error: null,
            data: packages
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getBundles(req, res, next) {
    try {
        const bundles = await bundleModel.find({});

        if (bundles.length == 0) {
            throw new Error("No bundle exist in db");
        }

        res.json({
            error: null,
            data: bundles
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getBundlePic(req, res, next) {
    try {
        res.sendFile(`/app/src/uploads/images/bundles/${req.params.bid}.jpg`);
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}


module.exports = {
    getPackages,
    getBundles,
    getBundlePic,
};