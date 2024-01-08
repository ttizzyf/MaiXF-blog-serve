const express = require("express");
const router = express.Router();
const { visitorRecord } = require("../../../utils/visitor.js");

router.get("/demo", visitorRecord);

module.exports = router;
