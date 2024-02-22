/**
 *@author MaiXF
 *@date 2023/2/22
 *@Description:权限相关的接口
 */

const express = require("express");
const router = express.Router();
const permissions = require("../../../controllers/w1/manage/permissions_controller");

/**
 * 获取权限列表
 * @route GET /w1/manage/permissions/list
 * @group 权限验证 - 登录注册相关
 * @param {string} pageSize 页面大小
 * @param {string} pageNum 当前页码
 * @param {string} remark 备注
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", permissions.permissionsList);

/**
 * 新增权限
 * @route POST /w1/manage/permissions/create
 * @group 权限验证 - 登录注册相关
 * @param {string} remark 备注
 * @param {string} key 权限键
 * @param {string} parent_key 父级权限键
 * @param {string} auth 是否按钮权限(0是否,1是)
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/create", permissions.newCreatePermissions);

/**
 * 修改权限
 * @route POST /w1/manage/permissions/update
 * @group 权限验证 - 登录注册相关
 * @param {string} permissionId 权限ID
 * @param {string} remark 备注
 * @param {string} key 权限键
 * @param {string} parent_key 父级权限键
 * @param {string} auth 是否按钮权限(0否,1是)
 * @param {string} status 是否按钮权限(0删除,1展示)
 * @param {string} disabled 是否按钮权限(0正常,1禁用)
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/update", permissions.updatePermisssions);

module.exports = router;
