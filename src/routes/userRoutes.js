const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const uploadProfilePic = require("../services/fileUploadService.js");
const { getUserTrees } = require("../controllers/treeController.js");
const passResetCodeController = require("../controllers/passResetCodeController.js");
const { requireAuth } = require("../middlewares/authCheck.js");

// middleware user here
// TODO: Find a need to use middlewares

router.get("/get-curr-user", requireAuth, userController.getCurrUser);
router.post("/register", userController.registerUser);
router.get("/confirm-email/:code", userController.confirmEmail);
router.post("/login", userController.login);
router.post("/edit/:uid", requireAuth, uploadProfilePic().single("image"), userController.editProfile);
router.get("/get-profile-pic/:uid", requireAuth, userController.getProfilePic);
router.get("/get-people-referred/:uid", requireAuth, userController.getPeopleReferred);
router.get("/logout", requireAuth, userController.logout);

router.get("/get-trees/:uid", requireAuth, getUserTrees);

router.post("/req-pass-reset", passResetCodeController.reqPassReset);
router.post("/reset-pass", passResetCodeController.resetPass);


module.exports = router;