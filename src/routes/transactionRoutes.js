const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController.js");
const { requireAuth } = require("../middlewares/authCheck.js");


router.post("/buy-package", requireAuth, transactionController.packageBought);
router.post("/buy-bundle", requireAuth, transactionController.bundleBought);
router.get("/get-trans/:uid", requireAuth, transactionController.getTransactions);

module.exports = router;