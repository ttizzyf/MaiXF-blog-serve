/**
 *@author MaiXF
 *@date 2024/2/18
 *@Description:后台管理首页接口
 */

const express = require("express");
const router = express.Router();
const operate = require("../../../controllers/w1/manage/operate.js");

/**
 * 获取操作列表
 * @route GET /w1/manage/operate/list
 * @group 博文相关 - 博文评论相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} nickname 用户昵称
 * @param {string} module 操作模块
 * @param {string} platform 操作平台
 * @param {string} operatorIP 设备IP
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", operate.userOptlogsList);

module.exports = router;
