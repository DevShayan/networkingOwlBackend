const { printLog, printError, printWarning } = require("../constants/functions");
const { refCodeModel } = require("../models/refCodeModel");
const mongoose = require("mongoose");
const { userModel } = require("../models/userModel");
const { serverBaseURL } = require("../constants/urls");

async function genRefLink(req, res, next) {
    try {
        const dbUser = await userModel.findById(req.params.uid);

        if (dbUser == null) {
            throw new Error("User does not exist");
        }

        const newId = new mongoose.Types.ObjectId();

        await refCodeModel.updateOne(
            {
                uid: req.params.uid
            },
            {
                $set: {
                    code: newId
                }
            },
            {
                upsert: true
            }
        );
        
        res.json({
            error: null,
            data: {
                referral_code: newId,
                referral_link: `${serverBaseURL}/user/register?ref_code=${newId}`
            }
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getRefCode(req, res, next) {
    try {
        const refCode = await refCodeModel.findOne({
            uid: req.params.uid
        });

        if (refCode == null) {
            throw new Error("Referral code does not exist");
        }
        
        res.json({
            error: null,
            data: {
                referral_code: refCode.code,
                referral_link: `${serverBaseURL}/user/register?ref_code=${refCode.code}`
            }
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
    genRefLink,
    getRefCode,
};
