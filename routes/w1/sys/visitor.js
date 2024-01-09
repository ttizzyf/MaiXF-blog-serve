const express = require("express");
const router = express.Router();
const {
  generateVisitorRecord,
} = require("../../../controllers/w1/sys/visitor_controller.js");

router.post("/record", generateVisitorRecord);

module.exports = router;
