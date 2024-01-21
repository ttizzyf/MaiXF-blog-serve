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
const dayjs = require("dayjs");

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
      let response = await Promise.all([
        visitorModel.sum("count"),
        visitorModel.sum("count", {
          where: {
            createdAt: findToday,
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
            createdAt: findToday,
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
            createdAt: findToday,
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
            createdAt: findToday,
          },
          raw: true,
        }),
      ]);
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

// 辅助函数 - 获取两个日期之间的日期数组
const getDaysBetweenDates = (today) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(today - (i + 1) * 24 * 60 * 60 * 1000);
  }
  return days;
};

// 辅助函数 - 格式化数据
const formatData = (days, list) => {
  let Data = days.map((el) => {
    const matchingItem = list.find(
      (item) => el === dayjs(item.date).format("MM-DD")
    );
    return matchingItem ? parseInt(matchingItem.totalCount) : 0;
  });
  return Data;
};

exports.weekVistorAndRegister = [
  async (req, res, next) => {
    try {
      const today = getFullTimesTamps(new Date());
      //
      let sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
      // 7日访客记录
      let pm = {
        attributes: [
          [sequelize.fn("date", sequelize.col("createdAt")), "date"],
          [sequelize.fn("sum", sequelize.col("count")), "totalCount"],
        ],
        where: {
          createdAt: {
            [Op.between]: [sevenDaysAgo, new Date(today)],
          },
        },
        group: [sequelize.fn("date", sequelize.col("createdAt"))],
      };
      sequeUtil.list(visitorModel, pm, (visitor) => {
        let userPm = {
          attributes: [
            [sequelize.fn("date", sequelize.col("createdAt")), "date"],
            [sequelize.fn("count", sequelize.col("createdAt")), "totalCount"],
          ],
          where: {
            createdAt: {
              [Op.between]: [sevenDaysAgo, new Date(today)],
            },
          },
          group: [sequelize.fn("date", sequelize.col("createdAt"))],
        };
        sequeUtil.list(userModel, userPm, (user) => {
          // 获取日期范围
          const dateRange = getDaysBetweenDates(getFullTimesTamps(new Date()));
          // 初始化结果对象
          const result = {
            days: dateRange.map((date) => dayjs(date).format("MM-DD")),
            visitor: [],
            register: [],
          };
          result.visitor = formatData(result.days, visitor.data.data);
          result.register = formatData(result.days, user.data.data);
          return apiResponse.successResponseWithData(
            res,
            "数据获取成功",
            result
          );
        });
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 获取访客浏览器类型
 * @date 2023/1/19
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */

// 查询函数处理
const pmAPI = (type) => {
  return (pm = {
    where: {
      platform: {
        [Op.like]: type,
      },
    },
    raw: true,
  });
};

exports.visitorBrowserType = [
  async (req, res, next) => {
    try {
      // 定义平台类型
      const platformTypes = ["Chrome", "Firefox", "Edge", "IE"];
      // 构建模糊匹配条件
      const platformConditions = platformTypes.map((type) => ({
        [Op.like]: `%${type}`,
      }));

      let response = [];
      let pm = {
        where: {
          platform: {
            [Op.like]: "%Chrome",
          },
        },
        raw: true,
      };
      // sequeUtil.list(visitorModel, pm, (list) => {
      //   console.log(list);
      // }
      const result = await visitorModel.findAll({ raw: true });
      console.log(result);
      return apiResponse.successResponseWithData(res, "请求成功", result);
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
