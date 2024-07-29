const bcrypt = require("bcrypt");
const fs = require("fs")

const { printWarning, printError } = require("../constants/functions.js");
const { userModel } = require("../models/userModel.js");
const { refCodeModel } = require("../models/refCodeModel.js");
const { unconfirmedEmailCodeModel } = require("../models/unconfirmedEmailCodeModel.js");
const { sendVerificationEmail, sendPassResetEmail } = require("../services/emailService.js");
const { passResetCodeModel } = require("../models/passResetCodeModel.js");
const { transactionModel } = require("../models/transactionModel.js");
const { default: mongoose } = require("mongoose");


async function getUser(req, res, next) {
    try {
        const dbUser = await userModel
                                .findById(req.params.id)
                                .select("-password");

        if (dbUser == null) {
            throw new Error("User not found");
        }

        res.json({
            error: null,
            data: dbUser
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function registerUser(req, res, next) {
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();

        // For referral code
        // returns uid if code recieved, else return false
        const parentUid = await validateRefCode(req.body);
        await validateEmail(req.body.user.email);

        if (parentUid) {
            req.body.user.referred_by = parentUid;

            // delete referral code
            await refCodeModel.deleteOne({
                code: req.body.ref_code
            }).session(session);
        }

        // hash password
        req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
        

        // create user in db
        const {_id, email} = (await userModel.create(
            [req.body.user],
            {
                session: session
            }
        ))[0];

        if (parentUid) {
            // update parent user
            await userModel.updateOne(
                {
                    _id: parentUid
                },
                {
                    $push: {
                        people_referred: _id
                    }
                },
                {
                    session: session
                }
            );
        }

        // add user email to unconfirmed email list
        const unconfirmedEmail = (await unconfirmedEmailCodeModel.create(
            [{
                email: req.body.user.email
            }],
            {
                session: session
            }
        ))[0];

        await session.commitTransaction();
        await session.endSession();

        // send confirmation email
        sendVerificationEmail(email, unconfirmedEmail._id);

        res.json({
            error: null,
            data: {
                id: _id
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

async function login(req, res, next) {
    try {
        const dbUser = await userModel.findOne({
            email: req.body.email
        });

        if (dbUser == null) {
            throw new Error("Email or password incorrect!");
        }

        const passMatched = await bcrypt.compare(req.body.pass, dbUser.password);

        if (!passMatched) {
            throw new Error("Incorrect email or password!");
        }

        if (!(await emailConfirmed(dbUser.email))) {
            throw new Error("Email not confirmed");
        }

        res.json({
            error: null,
            data: dbUser
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function confirmEmail(req, res, next) {
    try {
        await unconfirmedEmailCodeModel.deleteOne({
            _id: req.params.code
        });

        // redirect to login
        res.redirect(200, "https://devshayan.github.io/portfolio");
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}


async function editProfile(req, res, next) {
    try {
        const dbUser = await userModel.findById(req.params.uid);

        if (dbUser == null) {
            throw new Error("User not found!");
        }

        const updateableValues = {};

        Object.keys(req.body).forEach((field) => {
            if (req.body[field] != dbUser[field]) {
                updateableValues[field] = req.body[field];
            }
        });

        const conditionalImageRemove = {};
    
        if (req.hasOwnProperty("file")) {
            updateableValues.image_link = `http://localhost:8080/user/get-profile-pic/${req.params.uid}`;
        }
        else if (ifRemoveImage(req.query, dbUser)) {
            conditionalImageRemove.image_link = null;
            fs.unlinkSync(`./src/uploads/images/profiles/${req.params.uid}.jpg`);
        }

        await userModel.updateOne(
            {
                _id: req.params.uid
            },
            {
                $set: updateableValues,
                $unset: conditionalImageRemove
            }
        );

        Object.assign(updateableValues, conditionalImageRemove);

        res.json({
            error: null,
            data: updateableValues
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getProfilePic(req, res, next) {
    try {
        res.sendFile(`/app/src/uploads/images/profiles/${req.params.uid}.jpg`);
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getPeopleReferred(req, res, next) {
    try {
        const dbUser = await userModel.findById(req.params.uid);

        if (dbUser == null) {
            throw new Error("User not found!");
        }

        const pReferred = await userModel.find({
            _id: {
                $in: dbUser.people_referred
            }
        })
        .select("name image_link curr_package date_joined ")
        .populate("curr_package");

        res.json({
            error: null,
            data: pReferred
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}


/////////////////////////////////////////////////////////////

async function validateEmail(email) {
    const emailDb = await userModel.findOne({
        email: email
    });

    if (emailDb != null) {
        throw new Error("email already registered");
    }
}

async function validateRefCode(reqBody) {
    
    if (reqBody.ref_code && reqBody.ref_code != "") {
        const refLink = await refCodeModel.findOne({
            code: reqBody.ref_code
        });

        if (refLink == null) {
            throw new Error("referral link is incorrect or has been expired");
        }

        return refLink.uid;
    }

    return false;
}

async function emailConfirmed(userEmail) {
    const email = await unconfirmedEmailCodeModel.findOne({
        email: userEmail
    });

    return email == null;
}

function isEmpty(obj) {
    return Object.keys(obj).length == 0;
}

function ifRemoveImage(reqQuery, dbUser) {
    return reqQuery.hasOwnProperty("remove_image") &&
        reqQuery.remove_image == "true" &&
        dbUser.image_link !== undefined;
}



module.exports = {
    getUser,
    registerUser,
    login,
    confirmEmail,
    editProfile,
    getProfilePic,
    getPeopleReferred,
};
