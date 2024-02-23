/**
 *@author MaiXF
 *@date 2024/2/22
 *@Description:后台管理首页接口
 */

const express = require("express");
const router = express.Router();
const roles = require("../../../controllers/w1/manage/roles_controller.js");

/**
 * 获取角色列表
 * @route GET /w1/manage/roles/list
 * @group 后台相关 - 后台角色获取角色列表
 * @param {string} pageSize 页面大小
 * @param {string} pageNum 当前页码
 * @param {string} roleName 备注
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.get("/list", roles.rolesList);

/**
 * 新建角色
 * @route GET /w1/manage/roles/create
 * @group 后台相关 - 后台角色新建角色
 * @param {string} roleName 角色名称
 * @param {string} roleAuth 角色标识
 * @param {string} remark 备注
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/create", roles.createRoles);

/**
 * 更新角色
 * @route GET /w1/manage/roles/update
 * @group 后台相关 - 后台角色新建角色
 * @param {string} roleId 角色ID
 * @param {string} roleAuth 角色标识
 * @param {string} roleName 角色名称
 * @param {string} remark 备注
 * @param {string} perms 角色权限
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/update", roles.updateRoles);

/**
 * 删除角色
 * @route POST /w1/manage/roles/delete
 * @group 后台相关 - 后台删除角色
 * @param {string} roleId 角色ID
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/delete", roles.deleteRoles);

/**
 * 根据角色查询权限
 * @route GET /w1/manage/roles/rolesPerms
 * @group 后台相关 - 后台删除角色
 * @param {string} roleId 角色ID
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/rolesPerms", roles.rolesPerms);

module.exports = router;
