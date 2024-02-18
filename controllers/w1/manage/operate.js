const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const userOptLogsModel = require("../../../models/w1/blog/user_opt_logs_model.js");
const sequeUtil = require("../../../utils/seqUtils.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const apiResponse = require("../../../utils/apiResponse.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");

exports.userOptlogsList = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      let { pageNum, pageSize, nickname, module, platform, operatorIP } =
        req.query;
      let pm = {
        pageNum,
        pageSize,
        sort: {
          prop: "createdAt",
          order: "desc",
        },
        where: {},
      };
      nickname ? (pm.where.operator = { [Op.like]: `%${nickname}%` }) : "";
      module ? (pm.where.module = { [Op.like]: `%${module}%` }) : "";
      platform ? (pm.where.platform = { [Op.like]: `%${platform}%` }) : "";
      operatorIP ? (pm.where.operatorIP = { [Op.eq]: `${operatorIP}` }) : "";
      console.log(pm);
      sequeUtil.list(userOptLogsModel, pm, (list) => {
        if (list.code === 808) {
          return apiResponse.ErrorResponse(res, "请求错误");
        }
        return apiResponse.successResponseWithData(res, "请求成功", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];
