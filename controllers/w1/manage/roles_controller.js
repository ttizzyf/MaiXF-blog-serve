const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const rolesModel = require("../../../models/w1/blog/roles_model.js");
const permissionsModel = require("../../../models/w1/blog/permissions_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const { deleteNullObj, toTree } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware.js");
const sequeUtil = require("../../../utils/seqUtils");

/**
 * 获取角色列表
 * @date 2023/2/22
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.rolesList = [
  tokenAuthentication,
  // checkApiPermission("manage:roles:list"),
  async (req, res, next) => {
    try {
      console.log(req.query);
      let { pageSize, pageNum, roleName } = req.query;
      let pm = {
        pageSize,
        pageNum,
        roleName,
        where: {
          status: 1,
        },
        sort: {
          prop: "createdAt",
          order: "asc",
        },
        raw: true,
      };
      pm.roleName
        ? (pm.where.roleName = { [Op.substring]: `%${pm.roleName}%` })
        : "";
      sequeUtil.list(rolesModel, pm, (list) => {
        return apiResponse.successResponseWithData(
          res,
          "操作成功",
          list.data.count > 0 ? list.data : []
        );
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 新建角色
 * @date 2023/2/22
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.createRoles = [
  tokenAuthentication,
  checkApiPermission("manage:roles:create"),
  actionRecords({ module: "新增角色" }),
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          [Op.or]: [
            { roleName: req.body.roleName },
            { roleAuth: req.body.roleAuth },
          ],
        },
      };
      sequeUtil.findOne(rolesModel, pm, (data) => {
        // 角色名称或角色备注重复
        if (data.data) {
          return apiResponse.ErrorResponse(res, `角色名称或标识重复`);
        } else {
          // 数据库内没有该角色时
          sequeUtil.create(rolesModel, deleteNullObj(req.body), (data) => {
            if (data.code === 808) {
              return apiResponse.ErrorResponse(res, "角色创建失败");
            }
            return apiResponse.successResponse(
              res,
              `${req.body.roleName}角色新增成功`
            );
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 修改角色
 * @date 2023/2/23
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.updateRoles = [
  tokenAuthentication,
  checkApiPermission("manage:roles:update"),
  actionRecords({ module: "更新角色" }),
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          [Op.or]: [
            { roleName: req.body.roleName },
            { roleAuth: req.body.roleAuth },
          ],
          roleId: {
            [Op.ne]: req.body.roleId,
          },
        },
      };
      sequeUtil.findOne(rolesModel, pm, (data) => {
        // 角色名称或角色备注重复
        if (data.data && data.data.roleId !== req.body.roleId) {
          return apiResponse.ErrorResponse(res, `角色名称或标识重复`);
        } else {
          let obj = req.body;
          let key = {
            roleId: req.body.roleId,
          };
          sequeUtil.update(rolesModel, obj, key, (data) => {
            if (data.code === 808) {
              return apiResponse.ErrorResponse(res, "更新角色失败");
            } else {
              return apiResponse.successResponse(res, "更新角色成功");
            }
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 删除角色
 * @date 2023/2/23
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.deleteRoles = [
  tokenAuthentication,
  checkApiPermission("manage:roles:delete"),
  actionRecords({ module: "更新角色" }),
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          roleId: req.body.roleId,
        },
      };
      sequeUtil.findOne(rolesModel, pm, (data) => {
        if (data.data.roleAuth === "SUPER-ADMIN") {
          return apiResponse.ErrorResponse(res, "超级管理员不能删除");
        } else {
          sequeUtil.update(rolesModel, { status: 0 }, req.body, (data) => {
            if (data.code === 808) {
              return apiResponse.ErrorResponse(res, "删除角色失败");
            } else {
              return apiResponse.successResponse(res, "删除角色成功");
            }
          });
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 根据角色查询权限
 * @date 2023/2/23
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.rolesPerms = [
  tokenAuthentication,
  checkApiPermission("manage:roles:rolesPerms"),
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          roleAuth: req.query.roleAuth,
        },
      };
      sequeUtil.findOne(rolesModel, pm, async (data) => {
        let peresPm = {
          where: {
            permissionId: {
              [Op.in]: data.data.perms.split("、"),
            },
          },
          attributes: ["key"],
          raw: true,
        };
        const peresData = await permissionsModel.findAll(peresPm);
        console.log(peresData);
        let peresNewList = peresData.map((item) => {
          return item.key;
        });
        data.data.perms = peresNewList;
        return apiResponse.successResponseWithData(
          res,
          "获取权限成功",
          data.data
        );
      });
    } catch (err) {
      next(err);
    }
  },
];
