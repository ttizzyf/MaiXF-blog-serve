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
const util = require("util");

exports.generateVisitorRecord = [
  async (req, res, next) => {
    request(
      `http://pv.sohu.com/cityjson`,
      { method: "GET" },
      function (error, response, bodys) {
        let ip = getPublicIP(req);
        console.log("123", ip);
        let userAgent = new UAParser(req.headers["user-agent"]);
        //查询今天之内的访客
        visitorFindOne(visitorModel, { userIp: ip }).then((todayVisitor) => {
          if (!todayVisitor) {
            //当日的新访客
            request(
              `https://api.xygeng.cn/openapi/ip/getInfo`,
              {
                method: "POST",
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                  "Content-Type": "application/json",
                  Accept: "*/*",
                  Connection: "keep-alive",
                },
                data: JSON.stringify({
                  ip: "156.251.239.13",
                }),
              },
              async function (error, response, body) {
                console.log(chalk.bold.green("------------", response));
                console.log("Status code:", response.statusCode);
                console.log("Headers:", response.headers);
                console.log("Body:", body);
                console.log("error", error);
                if (error !== null) {
                  console.log("error:", error);
                  let ask = `访客ip地址解析错误:${ip} : ${req.method} ${req.url}`;
                  logger.error(ask);
                  return apiResponse.validationErrorWithData(res, ask);
                }
                let info = await visitorRecord(req, body, ip);
                return info.type
                  ? apiResponse.successResponse(res, info.ask)
                  : apiResponse.ErrorResponse(res, info.ask);
              }
            );
          } else {
            // 老访客不入库 更新当天访问次数
            updateVisitorCount(
              visitorModel,
              {
                nickname: todayVisitor.nickname || "visitor",
                platform:
                  userAgent.getBrowser().name +
                  ".v" +
                  userAgent.getBrowser().major,
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
                return apiResponse.ErrorResponse(res, "老访客更新失败");
              });
          }
        });
      }
    );
  },
];
