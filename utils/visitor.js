const bcrypt = require("bcryptjs");
const request = require("request");
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
 * @returns {Promise} true/false 两个密码是否相同
 */
exports.visitorRecord = (req, body, ip, params) => {
  let userAgent = new UAParser(req.headers["user-agent"]);
  let visitor = {
    nickname: req.body.nickname || "visitor",
    platform: userAgent.getBrowser().name + ".v" + userAgent.getBrowser().major,
    os: os.type() + os.release() + " " + os.arch(),
    type: params.type, //1 admin 0 client
    userIp: ip,
    loginLocation:
      JSON.parse(body).code === 200
        ? JSON.parse(body).data.country +
          "-" +
          JSON.parse(body).data.region +
          "-" +
          JSON.parse(body).data.city
        : JSON.parse(body).msg,
  };
  const start = new Date();
  visitorModel
    .create(visitor)
    .then(() => {
      const ms = new Date() - start;
      logger.info(`访客：${ip} : ${req.method} ${req.url} - ${ms}ms`);
    })
    .catch((error) => {
      const ms = new Date() - start;
      logger.error(`访客记录错误：${ip} : ${req.method} ${req.url} - ${ms}ms`);
    });
};
