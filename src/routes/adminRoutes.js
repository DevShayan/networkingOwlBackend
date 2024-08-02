const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const { requireAuth } = require("../middlewares/authCheck.js");
const { requireAdmin } = require("../middlewares/adminCheck.js");
const userController = require("../controllers/userController.js");


router.post("/mod-balance", requireAuth, requireAdmin, adminController.modifyBalance);
router.get("/get-user/:uid", requireAuth, requireAdmin, userController.getUser);

module.exports = router;