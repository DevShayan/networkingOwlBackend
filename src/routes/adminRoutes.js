const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");


router.post("/mod-balance", adminController.modifyBalance);

module.exports = router;