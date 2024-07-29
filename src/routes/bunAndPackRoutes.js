const express = require("express");
const router = express.Router();
const bunAndPackController = require("../controllers/bunAndPackController.js");


router.get("/get-packages", bunAndPackController.getPackages);
router.get("/get-bundles", bunAndPackController.getBundles);

module.exports = router;