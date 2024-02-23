const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const permissionsModel = require("../../../models/w1/blog/permissions_model");
const apiResponse = require("../../../utils/apiResponse.js");
const { deleteNullObj, toTree } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const sequeUtil = require("../../../utils/seqUtils");

/**
 * 用户权限列表接口
 * @date 2024/2/22
 * @param {Object} req - 请求对象，包含查询参数
 * @returns {Object} - 包含用户信息展示
 */

exports.permissionsList = [
  tokenAuthentication,
  checkApiPermission("manage:permissions:list"),
  async (req, res, next) => {
    try {
      const { remark } = req.query;
      let pm = {
        where: {
          status: 1,
        },
        remark,
        sort: {
          prop: "createdAt",
          order: "desc",
        },
        raw: true,
      };
      pm.remark ? (pm.where.remark = { [Op.substring]: `%${pm.remark}%` }) : "";
      console.log(pm);
      permissionsModel.findAndCountAll(pm).then((list) => {
        let treeData = toTree(list.rows);
        list.rows = treeData;
        return apiResponse.successResponseWithData(
          res,
          "请求成功",
          list.rows.length > 0 ? list : []
        );
      });
      // sequeUtil.list(permissionsModel, pm, (list) => {
      //  ;
      //   list.data.data = treeData;

      // });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 新增权限词条
 * @date 2024/2/22
 * @param {Object} req - 请求对象，包含查询参数
 * @returns {Object} - 包含用户信息展示
 */
exports.newCreatePermissions = [
  tokenAuthentication,
  checkApiPermission("manage:permissions:create"),
  actionRecords({ module: "新增权限词条" }),
  async (req, res, next) => {
    try {
      let pm = deleteNullObj(req.body);
      sequeUtil.create(permissionsModel, pm, (list) => {
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "权限词条新建错误");
        }
        return apiResponse.successResponse(res, "请求成功");
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 修改权限词条
 * @date 2024/2/22
 * @param {Object} req - 请求对象，包含查询参数
 * @returns {Object} - 包含用户信息展示
 */
exports.updatePermisssions = [
  tokenAuthentication,
  checkApiPermission("manage:permissions:update"),
  actionRecords({ module: "新增权限词条" }),
  async (req, res, next) => {
    try {
      let { permissionId, remark, key, parent_key, auth, status, disabled } =
        req.body;
      let where = {
        permissionId,
      };
      console.log(typeof disabled);
      let obj = {
        remark: remark || "",
        key: key || "",
        parent_key: parent_key || "",
        auth: auth || "",
        status: typeof status === "number" ? status : "",
        disabled: typeof disabled === "number" ? disabled : "",
      };
      sequeUtil.update(permissionsModel, deleteNullObj(obj), where, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "修改失败");
        }
        return apiResponse.successResponse(res, "修改成功");
      });
    } catch (err) {
      next(err);
    }
  },
];
