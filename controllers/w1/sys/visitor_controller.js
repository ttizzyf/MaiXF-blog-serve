const request = require("request");
const visitorModel = require("../../../models/w1/blog/visitor_model.js");
const { getPublicIP } = require("../../../utils/otherUtils.js");
const os = require("os");
const UAParser = require("ua-parser-js");
const apiResponse = require("../../../utils/apiResponse.js");
const logger = require("../../../utils/logger.js");
const {
  visitorRecord,
  visitorFindOne,
  updateVisitorCount,
} = require("../../../utils/visitor.js");
const chalk = require("chalk");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const util = require("util");

exports.generateVisitorRecord = [
  tokenAuthentication,
  async (req, res, next) => {
    // console.log(req);
    let ip = getPublicIP(req);
    console.log("123", ip);
    let userAgent = new UAParser(req.headers["user-agent"]);
    //查询今天之内的访客
    visitorFindOne(visitorModel, { userIp: ip }).then((todayVisitor) => {
      if (!todayVisitor) {
        //当日的新访客
        request(
          `https://qifu.baidu.com/ip/geo/v1/district?ip=120.55.46.157`,
          {
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
              "Content-Type": "application/json;charset=UTF-8",
              Accept: "application/json, text/plain, */*",
              Connection: "keep-alive",
            },
          },
          async function (error, response, ipData) {
            let ipBody = JSON.parse(ipData);
            console.log(ipBody);
            if (ipBody.code !== "Success") {
              console.log("error:", error);
              let ask = `访客ip地址解析错误:${ip} : ${req.method} ${req.url}`;
              logger.error(ask);
              return apiResponse.successResponse(res, ask);
            }
            let info = await visitorRecord(req, ipBody, ip);
            return info.type
              ? apiResponse.successResponse(res, info.ask)
              : apiResponse.successResponse(res, info.ask);
          }
        );
      } else {
        // 老访客不入库 更新当天访问次数
        updateVisitorCount(
          visitorModel,
          {
            nickname: req.user.nickname || "visitor",
            platform:
              userAgent.getBrowser().name + ".v" + userAgent.getBrowser().major,
            os: os.type() + os.release() + " " + os.arch(),
            userType: req.body.type, // 0 admin 1 manage
            count: todayVisitor.count + 1,
          },
          {
            userIp: todayVisitor.userIp,
          }
        )
          .then((update) => {
            console.log("老访客更新成功");
            return apiResponse.successResponse(res, "老访客更新成功");
          })
          .catch((err) => {
            console.log("老访客更新失败", err);
            return apiResponse.successResponse(res, "老访客更新失败");
          });
      }
    });
  },
];
