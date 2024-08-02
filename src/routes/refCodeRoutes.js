const express = require("express");
const router = express.Router();
const refTokenController = require("../controllers/refCodeController.js");
const { requireAuth } = require("../middlewares/authCheck.js");


router.get("/gen-ref-link/:uid", requireAuth, refTokenController.genRefLink);
router.get("/get-ref-link/:uid", requireAuth, refTokenController.getRefCode);

module.exports = router;