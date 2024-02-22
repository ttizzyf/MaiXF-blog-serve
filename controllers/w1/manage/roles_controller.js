const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const rolesModel = require("../../../models/w1/blog/roles_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const { deleteNullObj, toTree } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
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
  async (req, res, next) => {
    try {
      console.log(req.query);
      let { pageSize, pageNum, roleName } = req.query;
      let pm = {
        pageSize,
        pageNum,
        roleName,
        where: {},
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
  async (req, res, next) => {
    try {
      sequeUtil.create(rolesModel, deleteNullObj(req.body), (data) => {
        if (data.code === 808) {
          return apiResponse.successResponse(res, "角色已存在");
        }
        return apiResponse.successResponse(res, "新增角色成功");
      });
    } catch (err) {
      next(err);
    }
  },
];
