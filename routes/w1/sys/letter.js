/**
 *@author MaiXF
 *@date 2024/3/2
 *@Description:私信相关的接口
 */

const express = require("express");
const router = express.Router();
const letter_controller = require("../../../controllers/w1/sys/letter_controller");

/**
 * 新增用户私信
 * @route GET /w1/sys/letter/create
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post("/create", letter_controller.createLetter);

/**
 * 用户私信列表
 * @route GET /w1/sys/letter/list
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", letter_controller.letterList);

/**
 * 修改用户私信状态
 * @route GET /w1/sys/letter/update
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post("/update", letter_controller.updateletter);

/**
 * 回复用户私信
 * @route GET /w1/sys/letter/reply
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post("/reply", letter_controller.replyLetter);

module.exports = router;
