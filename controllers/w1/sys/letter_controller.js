const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const letterModel = require("../../../models/w1/blog/letter_model");
const apiResponse = require("../../../utils/apiResponse.js");
const { sendEmail } = require("../../../utils/sendEmail.js");
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
      pm.where.status = 1;
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
  tokenAuthentication,
  checkApiPermission("sys:letter:update"),
  async (req, res, next) => {
    try {
      let key = {
        id: req.body.id,
      };
      delete req.body.id;
      let obj = req.body;
      sequeUtil.update(letterModel, obj, key, (data) => {
        console.log(data);
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "私信状态更新失败");
        }
        return apiResponse.successResponse(res, "私信状态更新成功");
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 回复用户私信
 * @date 2024/3/4
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.replyLetter = [
  tokenAuthentication,
  checkApiPermission("sys:letter:reply"),
  async (req, res, next) => {
    try {
      console.log(req.body);
      sendEmail("replyLetter", req.body.email, req.body.replyContent).then(
        () => {
          let obj = {
            replyContent: req.body.replyContent,
            isReply: 1,
          };
          let key = {
            id: req.body.id,
          };
          sequeUtil.update(letterModel, obj, key, (data) => {
            if (data.code === 808) {
              return apiResponse.ErrorResponse(res, "私信更新失败");
            }
            return apiResponse.successResponse(res, "回复私信成功");
          });
        }
      );
    } catch (err) {
      next(err);
    }
  },
];
