const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const visitorModel = require("../../../models/w1/blog/visitor_model.js");
const messageModel = require("../../../models/w1/blog/message_model.js");
const userModel = require("../../../models/w1/blog/user_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const sequeHandler = require("../../../utils/seqUtils.js");
const { getFullTimesTamps } = require("../../../utils/otherUtils.js");

/**
 * 后台首页获取访客总数和今日新增访客数
 * @date 2023/1/13
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */

exports.browsing = [
  async (req, res, next) => {
    try {
      const today = getFullTimesTamps(new Date());
      let sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
      let visitorCount = await visitorModel.sum("count");
      // let todayVisitor = await visitorModel.sum("count", {
      //   where: {
      //     createAt: {
      //       [Op.lt]: new Date(today),
      //       [Op.gt]: new Date(today - 24 * 60 * 60 * 1000),
      //     },
      //   },
      // });
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

      console.log(visitorCount);
      console.log(todayVisitor);
      // sequeHandler.list(visitorModel, {}, (list) => {
      //   console.log(list.data.data[0]);
      //   list.data.data.forEach((el) => {
      //     visitorCount += el.dataValues.count;
      //   });
      //   console.log(visitorCount);
      return apiResponse.successResponseWithData(res, "请求成功", list);
      // });
    } catch (err) {}
  },
];
