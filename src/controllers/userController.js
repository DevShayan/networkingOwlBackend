const bcrypt = require("bcrypt");
const fs = require("fs")

const { userModel } = require("../models/userModel.js");
const { refCodeModel } = require("../models/refCodeModel.js");
const { unconfirmedEmailCodeModel } = require("../models/unconfirmedEmailCodeModel.js");
const { sendVerificationEmail } = require("../services/emailService.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../models/adminModel.js");
const { printWarning } = require("../constants/functions.js");
const { serverBaseURL, clientBaseURL } = require("../constants/urls.js");


async function getUser(req, res, next) {
    try {
        const dbUser = await userModel
            .findById(req.params.uid)
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

async function getCurrUser(req, res, next) {
    try {
        var dbUser;
        if (req.app.locals.isAdmin) {
            dbUser = await adminModel
                .findById(req.app.locals.uid)
                .select("-password");
        }
        else {
            dbUser = await userModel
                .findById(req.app.locals.uid)
                .select("-password")
                .populate("bundles_bought", "-image_link -description_points");
        }

        if (dbUser == null) {
            throw new Error("User not found");
        }

        res.json({
            error: null,
            data: {
                user: dbUser,
                type: req.app.locals.isAdmin ? "admin" : "user"
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

        setAuthCookie(_id, false, res);

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
        var dbUser = null;
        
        if (req.body.is_admin === undefined) {
            throw new Error("User type not defined");
        }

        if (req.body.is_admin) {
            dbUser = await adminModel.findOne({
                email: req.body.email
            }).lean();
        }
        else {
            dbUser = await userModel.findOne({
                email: req.body.email
            }).populate("bundles_bought", "-image_link -description_points").lean();
        }

        if (dbUser == null) {
            throw new Error("Email or password incorrect!");
        }

        const passMatched = await bcrypt.compare(req.body.pass, dbUser.password);

        if (!passMatched) {
            throw new Error("Email or password incorrect!");
        }

        if (!(await emailConfirmed(dbUser.email))) {
            throw new Error("Email not confirmed");
        }

        setAuthCookie(dbUser._id, req.body.is_admin, res);

        delete dbUser.password;

        res.json({
            error: null,
            data: {
                user: dbUser,
                type: req.body.is_admin ? "admin" : "user"
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

async function confirmEmail(req, res, next) {
    try {
        await unconfirmedEmailCodeModel.deleteOne({
            _id: req.params.code
        });

        res.redirect(200, `${clientBaseURL}/login`);
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
            updateableValues.image_link = `${serverBaseURL}/user/get-profile-pic/${req.params.uid}`;
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

async function logout(req, res, next) {
    try {
        res.clearCookie("net-owl-auth", {
		sameSite: "None",
		secure: true
	});

        res.json({
            error: null,
            data: "logged out successfully"
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

function setAuthCookie(uid, isAdmin, res) {
    const maxAge = 3*24*60*60   // 3 days
    const authToken = jwt.sign({
        id: uid,
        is_admin: isAdmin
    }, process.env.AUTH_TOKEN_KEY, {
        expiresIn: maxAge
    });

    res.cookie("net-owl-auth", authToken, {
        httpOnly: true,
        maxAge: maxAge*1000,
        sameSite: "None",
        secure: true
    });
}



module.exports = {
    getUser,
    getCurrUser,
    registerUser,
    login,
    confirmEmail,
    editProfile,
    getProfilePic,
    getPeopleReferred,
    logout,
};
