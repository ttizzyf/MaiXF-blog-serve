const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const visitorModel = require("../../../models/w1/blog/visitor_model.js");
const messageModel = require("../../../models/w1/blog/message_model.js");
const userModel = require("../../../models/w1/blog/user_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const sequeUtil = require("../../../utils/seqUtils.js");
const { getFullTimesTamps } = require("../../../utils/otherUtils.js");

/**
 * 后台首页访客信息列表记录
 * @date 2023/1/13
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */

exports.browsing = [
  async (req, res) => {
    try {
      const today = getFullTimesTamps(new Date());
      let findToday = {
        [Op.lt]: new Date(today),
        [Op.gt]: new Date(today - 24 * 60 * 60 * 1000),
      };
      let [
        visitorCount,
        todayVisitor,
        registerCount,
        registerToday,
        articleCount,
        articleToday,
        boardCount,
        boardToday,
      ] = await Promise.all([
        visitorModel.sum("count"),
        visitorModel.sum("count", {
          where: {
            createAt: findToday,
          },
        }),
        userModel.count({
          where: {
            status: {
              [Op.eq]: 1,
            },
          },
          raw: true,
        }),
        userModel.count({
          where: {
            status: {
              [Op.eq]: 1,
            },
            createAt: findToday,
          },
          raw: true,
        }),
        messageModel.count({
          where: {
            relatedArticleId: {
              [Op.ne]: 0,
            },
          },
          raw: true,
        }),
        messageModel.count({
          where: {
            relatedArticleId: {
              [Op.ne]: 0,
            },
            createAt: findToday,
          },
          raw: true,
        }),
        messageModel.count({
          where: {
            relatedArticleId: {
              [Op.eq]: 0,
            },
          },
          raw: true,
        }),
        messageModel.count({
          where: {
            relatedArticleId: {
              [Op.eq]: 0,
            },
            createAt: findToday,
          },
          raw: true,
        }),
      ]);
      let response = {
        visitorCount,
        todayVisitor,
        registerCount,
        registerToday,
        articleCount,
        articleToday,
        boardCount,
        boardToday,
      };
      return apiResponse.successResponseWithData(res, "获取", response);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 后台首页获取7日内访客记录
 * @date 2023/1/19
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */

exports.weekVistorAndRegister = [
  async (req, res, next) => {
    try {
      const today = getFullTimesTamps(new Date());
      //
      let sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
      // 7日访客记录
      let visitorRecords = await visitorModel.findAll({
        attributes: [
          [sequelize.fn("date", sequelize.col("createAt")), "date"],
          [sequelize.fn("sum", sequelize.col("count")), "totalCount"],
        ],
        where: {
          createAt: {
            [Op.between]: [sevenDaysAgo, new Date(today)],
          },
        },
        group: [sequelize.fn("date", sequelize.col("createAt"))],
        raw: true, // 设置 raw 为 true，以便返回原始数据而不是 Sequelize 模型
      });
      console.log(visitorRecords);
    } catch (err) {}
  },
];
