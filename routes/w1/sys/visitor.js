const express = require("express");
const router = express.Router();
const {
  generateVisitorRecord,
} = require("../../../controllers/w1/sys/visitor_controller.js");

/**
 * 记录用户访问
 * @route post /w1/sys/visitor/record
 * @group 访客记录 - 访客记录相关
 * @param {number} type 访问类型(0是前台访客,1是后台访客)
 * @param {string} nickname 访客名称,visitor是游客
 * @returns {object} 200 - {"status": 1,"message": "修改信息成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/record", generateVisitorRecord);

module.exports = router;
