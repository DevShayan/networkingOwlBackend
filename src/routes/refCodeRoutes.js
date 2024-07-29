const express = require("express");
const router = express.Router();
const refTokenController = require("../controllers/refCodeController.js");


router.get("/gen-ref-link/:uid", refTokenController.genRefLink);
router.get("/get-ref-code/:uid", refTokenController.getRefCode);

module.exports = router;