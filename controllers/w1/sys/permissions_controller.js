const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const { body, validationResult, query } = require("express-validator");
const userModel = require("../../../models/w1/blog/user_model.js");
const permissionsModel = require("../../../models/w1/blog/permissions_model");
const apiResponse = require("../../../utils/apiResponse.js");
const { deleteNullObj, toTree } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  uploadMiddleware,
} = require("../../../middlewares/uploadMiddleware.js");
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
  async (req, res, next) => {
    try {
      const { pageSize, pageNum, remark } = req.query;
      let pm = {
        where: {
          status: 1,
        },
        pageSize,
        pageNum,
        remark,
        sort: {
          prop: "createdAt",
          order: "desc",
        },
      };
      pm.remark ? (pm.where.remark = { [Op.substring]: `%${pm.remark}%` }) : "";
      console.log(pm);
      sequeUtil.list(permissionsModel, pm, (list) => {
        let treeData = toTree(list.data.data);
        list.data.data = treeData;
        return apiResponse.successResponseWithData(res, "请求成功", list.data);
      });
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
