/**
 *@author MaiXF
 *@date 2023/12/4
 *@Description:登录注册相关的接口
 */

const express = require("express");
const router = express.Router();
const user_controller = require("../../../controllers/w1/sys/user_controller.js");

/**
 * 获取登录验证码
 * @route GET /w1/sys/auth/captcha
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */

router.get("/captcha", user_controller.captcha);

/**
 * 登录
 * @route POST /w1/sys/auth/login
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} code 验证码
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/login", user_controller.login);

/**
 * 访客登录
 * @route POST /w1/sys/auth/login
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

/**
 * 用户注册
 * @route POST /w1/sys/auth/register
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} nickname 昵称
 * @param {string} website 个人站点
 * @param {string} emailCode 邮箱验证码
 * @returns {object} 200 - {"status": 1,"message": "注册成功","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/register", user_controller.register);

/**
 * 发送邮箱验证码
 * @route GET /w1/sys/auth/emailConfirmCode
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get("/emailConfirmCode", user_controller.emailConfirmCode);

/**
 * 修改用户信息
 * @route POST /w1/sys/auth/emitUser
 * @group 权限验证 - 登录注册相关
 * @param {string} avatar 头像
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} nickname 昵称
 * @param {string} website 个人站点
 * @returns {object} 200 - {"status": 1,"message": "修改信息成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.post("/emitUser", user_controller.emitUser);

module.exports = router;
