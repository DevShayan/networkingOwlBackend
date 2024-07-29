const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const uploadProfilePic = require("../services/fileUploadService.js");
const { getUserTrees } = require("../controllers/treeController.js");
const passResetCodeController = require("../controllers/passResetCodeController.js");

// middleware user here
// TODO: Find a need to use middlewares

router.get("/get-user/:id", userController.getUser);
router.post("/register", userController.registerUser);
router.get("/confirm-email/:code", userController.confirmEmail);
router.post("/login", userController.login);
router.post("/edit/:uid", uploadProfilePic().single("image"), userController.editProfile);
router.get("/get-profile-pic/:uid", userController.getProfilePic);
router.get("/get-people-referred/:uid", userController.getPeopleReferred);

router.get("/get-trees/:uid", getUserTrees);

router.post("/req-pass-reset", passResetCodeController.reqPassReset);
router.post("/reset-pass", passResetCodeController.resetPass);


module.exports = router;