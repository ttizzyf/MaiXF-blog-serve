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
  async (req, res, next) => {
    try {
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
