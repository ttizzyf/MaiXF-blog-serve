const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const letterModel = require("../../../models/w1/blog/letter_model");
const apiResponse = require("../../../utils/apiResponse.js");
const sendEmail = require("../../../utils/sendEmail.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const sequeUtil = require("../../../utils/seqUtils");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");
const { deleteNullObj } = require("../../../utils/otherUtils");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication");

/**
 * 新增用户私信
 * @date 2024/3/2
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.createLetter = [
  async (req, res, next) => {
    try {
      console.log(req.body);
      let pm = req.body;
      sequeUtil.create(letterModel, pm, (data) => {
        // console.log(data);
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "私信错误,请稍后再试");
        }
        return apiResponse.successResponse(res, "私信已发送");
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 获取用户私信列表
 * @date 2024/3/2
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.letterList = [
  tokenAuthentication,
  checkApiPermission("sys:letter:list"),
  async (req, res, next) => {
    try {
      console.log(req.query);
      let pm = {
        pageSize: req.query.pageSize,
        pageNum: req.query.pageNum,
        where: {},
      };
      delete req.query.pageSize;
      delete req.query.pageNum;
      pm.where = deleteNullObj(req.query);
      sequeUtil.list(letterModel, pm, (list) => {
        console.log(list);
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "私信列表获取失败");
        }
        return apiResponse.successResponseWithData(
          res,
          "私信列表获取成功",
          list.data
        );
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 更新用户私信状态
 * @date 2024/3/2
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.updateletter = [
  async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 回复用户私信
 * @date 2024/3/2
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.replyLetter = [
  async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
];
