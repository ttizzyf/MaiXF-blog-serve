const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const userModel = require("../../../models/w1/blog/user_model.js");
const userOptLogsModel = require("../../../models/w1/blog/user_opt_logs_model.js");
const rolesModel = require("../../../models/w1/blog/roles_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const sequeUtil = require("../../../utils/seqUtils.js");
const { encryption, modelData } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");

/**
 * 获取用户列表
 * @date 2023/2/18
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */

exports.userList = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      console.log(req.query);
      let { pageSize, pageNum, email, nickname } = req.query;
      let pm = {
        pageSize,
        pageNum,
        email,
        nickname,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: rolesModel,
            attributes: ["roleAuth", "roleName", "perms", "remark"], // 指定要返回的用户字段
            as: "roleInfo",
          },
        ],
        where: {},
      };
      pm.nickname
        ? (pm.where.nickname = { [Op.like]: `%${pm.nickname}%` })
        : "";
      pm.email ? (pm.where.email = { [Op.like]: `%${pm.email}%` }) : "";
      sequeUtil.list(userModel, pm, (list) => {
        console.log(list);
        let newData = modelData(list.data.data, "roleInfo", "roleInfo");
        list.data.data = newData;
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "创建失败");
        }
        return apiResponse.successResponseWithData(
          res,
          "用户列表获取成功",
          list.data
        );
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 重置用户密码
 * @date 2023/2/18
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.resetPassword = [
  tokenAuthentication,
  actionRecords({ module: "用户密码重置" }),
  async (req, res, next) => {
    try {
      let key = {
        userId: req.body.userId,
      };
      const newPassword = await encryption(123456);
      let obj = {
        password: newPassword,
      };
      sequeUtil.update(userModel, obj, key, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "密码重置失败");
        }
        return apiResponse.successResponse(
          res,
          "密码重置成功,重置密码为123456"
        );
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 是否启用账户
 * @date 2023/2/18
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.userIsEnable = [
  tokenAuthentication,
  actionRecords({ module: "是否启用账户" }),
  async (req, res, next) => {
    try {
      let key = {
        userId: req.body.userId,
      };
      let obj = {
        status: req.body.status,
      };
      sequeUtil.update(userModel, obj, key, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "用户状态更改失败");
        }
        return apiResponse.successResponse(
          res,
          `用户状态更改成功,当前用户状态为${req.body.status ? "启用" : "禁用"}`
        );
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 查看用户操作日志
 * @date 2023/2/18
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.optlogs = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          operatorId: {
            [Op.eq]: req.query.userId,
          },
        },
        pageNum: req.query.pageNum,
        pageSize: req.query.pageSize,
        sort: {
          prop: "createdAt",
          order: "desc",
        },
      };
      sequeUtil.list(userOptLogsModel, pm, (list) => {
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "用户操作日志获取失败");
        }
        return apiResponse.successResponseWithData(
          res,
          "操作日志获取成功",
          list.data
        );
      });
    } catch (err) {
      next(err);
    }
  },
];
