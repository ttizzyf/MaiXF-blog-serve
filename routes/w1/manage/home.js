/**
 *@author MaiXF
 *@date 2024/1/13
 *@Description:后台管理首页接口
 */

const express = require("express");
const router = express.Router();
const manage_home = require("../../../controllers/w1/manage/index.js");

/**
 * 获取博文列表
 * @route GET /w1/manage/home/browsing
 * @group 后台相关 - 后台首页获取博客记录接口
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.get("/browsing", manage_home.browsing);

/**
 * 获取博文列表
 * @route GET /w1/manage/home/weekVistorAndRegister
 * @group 后台相关 - 一周用户访问及注册量
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/weekVistorAndRegister", manage_home.weekVistorAndRegister);

module.exports = router;
