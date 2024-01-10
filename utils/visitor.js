const visitorModel = require("../models/w1/blog/visitor_model.js");
const sequelize = require("../db/mysqlConnection.js");
const UAParser = require("ua-parser-js");
const apiResponse = require("./apiResponse.js");
const { Op } = require("sequelize");
const os = require("os");
const logger = require("./logger.js");

/**
 * visitorRecord 访客记录
 * @param { Object } req 请求参数
 * @param { Object } body 请求体
 * @param { string } ip IP地址
 * @param { Object } params 请求
 * @returns {Promise} 记录成功
 */
exports.visitorRecord = (req, ipBody, ip) => {
  return new Promise((resolve, reject) => {
    let userAgent = new UAParser(req.headers["user-agent"]);
    let visitor = {
      nickname: req.user.nickname || "visitor",
      platform:
        userAgent.getBrowser().name + ".v" + userAgent.getBrowser().major,
      os: os.type() + os.release() + " " + os.arch(),
      userType: req.body.type, //0 admin 1 manage
      userIp: ip,
      visitorInfo: JSON.stringify(ipBody.data),
      loginLocation:
        ipBody.data.continent !== "保留IP"
          ? ipBody.data.country +
            "-" +
            ipBody.data.prov +
            "-" +
            ipBody.data.city
          : ipBody.data.continent,
    };
    console.log(ip);
    const start = new Date();
    visitorModel
      .create(visitor)
      .then((msg) => {
        const ms = new Date() - start;
        let ask = `访客：${ip} : ${req.method} ${req.url} - ${ms}ms`;
        logger.info(ask);
        resolve({ type: 1, ask });
      })
      .catch((error) => {
        const ms = new Date() - start;
        let ask = `访客记录错误：${ip} : ${req.method} ${req.url} - ${ms}ms`;
        logger.error(ask);
        reject({ type: 0, ask });
      });
  });
};

/**
 * visitorFindOne 查询当天的访客
 * @param { Function } model 请求模型
 * @param { Object } pm 查询参数
 * @returns {Promise}
 */
exports.visitorFindOne = (model, pm) => {
  return new Promise((resolve, reject) => {
    model
      .findOne({
        where: {
          [Op.and]: [
            pm,
            sequelize.where(
              sequelize.fn("DATE", sequelize.col("createAt")), // 表对应的字段
              // 取当前日期
              sequelize.literal("CURRENT_DATE")
            ),
          ],
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * updateVisitorCount 更新当天的老访客
 * @param { Function } model 请求参数
 * @param { Object } pm 请求参数
 * @param { String } ip ip地址
 * @returns {Promise}
 */

exports.updateVisitorCount = async (model, pm, ip) => {
  return new Promise((resolve, reject) => {
    model
      .update(pm, {
        where: ip,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
