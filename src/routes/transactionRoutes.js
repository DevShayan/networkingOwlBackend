const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController.js");


router.post("/buy-package", transactionController.packageBought);
router.post("/buy-bundle", transactionController.bundleBought);
router.get("/get-trans/:uid", transactionController.getTransactions);

module.exports = router;