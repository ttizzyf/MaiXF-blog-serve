/**
 *@author MaiXF
 *@date 2024/2/18
 *@Description:后台管理首页接口
 */

const express = require("express");
const router = express.Router();
const user = require("../../../controllers/w1/manage/user.js");

/**
 * 获取博文评论列表
 * @route GET /w1/manage/user/list
 * @group 博文相关 - 博文评论相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} username 用户名
 * @param {string} nickname 用户昵称
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", user.userList);

/**
 * 重置用户密码
 * @route POST /w1/manage/user/resetPassword
 * @group 博文相关 - 博文评论相关接口
 * @param {string} userId 用户id
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/resetPassword", user.resetPassword);

/**
 * 是否启用账户
 * @route POST /w1/manage/user/userIsEnable
 * @group 博文相关 - 博文评论相关接口
 * @param {string} userId 用户id
 * @param {number} status 是否启用
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/userIsEnable", user.userIsEnable);

module.exports = router;
