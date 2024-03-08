const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const friendLinkModel = require("../../../models/w1/blog/friend_link_model");
const apiResponse = require("../../../utils/apiResponse.js");
const { sendEmail } = require("../../../utils/sendEmail.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const { body, validationResult, query } = require("express-validator");
const sequeUtil = require("../../../utils/seqUtils");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");
const { deleteNullObj } = require("../../../utils/otherUtils");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication");

/**
 * 新增用户私信
 * @date 2024/3/5
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */

exports.createFriendLink = [
  actionRecords({ module: "创建友链" }),
  [
    body("email").notEmpty().withMessage("邮箱不能为空"),
    body("linkName").notEmpty().withMessage("友链名称不能为空"),
    body("link")
      .notEmpty()
      .withMessage("友链地址不能为空")
      .custom(async (value, { req }) => {
        const friend = await friendLinkModel.findOne({
          where: { link: value },
        });
        if (friend) {
          return Promise.reject(`友链:${friend.link}已经注册,请更换其他.`);
        }
      }),
    body("describe").notEmpty().withMessage("友链描述不能为空"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
      }
      let pm = req.body;
      sequeUtil.create(friendLinkModel, pm, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "友链创建失败");
        }
        return apiResponse.successResponse(res, "创建成功");
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 后台获取友链申请列表
 * @date 2024/3/5
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */
exports.manageFriendLink = [
  tokenAuthentication,
  checkApiPermission("sys:friend:manageList"),
  async (req, res, next) => {
    try {
      let pm = {
        pageSize: req.query.pageSize,
        pageNum: req.query.pageNum,
        where: {
          status: 1,
        },
      };
      req.query.email
        ? (pm.where.email = { [Op.substring]: `${req.query.email}` })
        : "";
      req.query.linkName
        ? (pm.where.linkName = { [Op.substring]: `${req.query.linkName}` })
        : "";
      console.log(pm);
      sequeUtil.list(friendLinkModel, pm, (list) => {
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "请求失败");
        }
        return apiResponse.successResponseWithData(res, "请求成功", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 前台获取友链展示列表
 * @date 2024/3/5
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */
exports.adminShowFriendLink = [
  async (req, res, next) => {
    try {
      let pm = {
        where: {
          status: 1,
          isShow: 1,
        },
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["email"] },
        raw: true,
      };
      friendLinkModel.findAndCountAll(pm).then((list) => {
        console.log(list);
        return apiResponse.successResponseWithData(res, "请求成功", list);
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 修改友链
 * @date 2024/3/5
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 响应对象
 */
exports.updateFriendLink = [
  tokenAuthentication,
  checkApiPermission("sys:friend:update"),
  [body("id").notEmpty().withMessage("id不能为空")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
      }
      let obj = req.body;
      sequeUtil.update(friendLinkModel, obj, { id: req.body.id }, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "更新失败");
        }
        return apiResponse.successResponse(res, "更新成功");
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];
