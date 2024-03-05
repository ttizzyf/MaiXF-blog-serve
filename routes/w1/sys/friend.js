/**
 *@author MaiXF
 *@date 2024/3/5
 *@Description:私信相关的接口
 */

const express = require("express");
const router = express.Router();
const friend_controller = require("../../../controllers/w1/sys/friend_controller");

/**
 * 新增友链
 * @route GET /w1/sys/friend/create
 * @group 友链相关 - 新增友链
 * @param {string} email 友链邮箱
 * @param {string} linkName 友链名称
 * @param {string} link 友链地址
 * @param {string} describe 友链描述
 * @param {string} isShow 是否前台展示(0是未展示,1是展示)
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */

router.post("/create", friend_controller.createFriendLink);

/**
 * 后台获取友链列表
 * @route GET /w1/sys/friend/manageList
 * @group 友链相关 - 友链列表
 * @param {string} email 友链邮箱
 * @param {string} linkName 友链名称
 * @param {string} pageSize 单页展示数量
 * @param {string} pageNum 当前页码
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get("/manageList", friend_controller.manageFriendLink);

/**
 * 前台获取友链展示列表
 * @route GET /w1/sys/friend/adminList
 * @group 友链相关 - 友链列表
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get("/adminList", friend_controller.adminShowFriendLink);

/**
 * 修改友链
 * @route POST /w1/sys/friend/update
 * @group 权限验证 - 登录注册相关
 * @param {string} email 友链邮箱
 * @param {string} linkName 友链名称
 * @param {string} link 友链地址
 * @param {string} describe 友链描述
 * @param {string} isShow 是否前台展示(0是未展示,1是展示)
 * @param {string} status 是否删除(0是删除,1是正常)
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post("/update", friend_controller.updateFriendLink);

module.exports = router;
