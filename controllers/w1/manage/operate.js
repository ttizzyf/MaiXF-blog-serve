const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const userOptLogsModel = require("../../../models/w1/blog/user_opt_logs_model.js");
const sequeUtil = require("../../../utils/seqUtils.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const apiResponse = require("../../../utils/apiResponse.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");
/**
 * 获取操作记录列表
 * @date 2023/2/19
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.userOptlogsList = [
  tokenAuthentication,
  checkApiPermission("manage:operate:list"),
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
        where: {
          status: 1,
        },
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

/**
 * 删除操作记录
 * @date 2023/2/19
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @returns {Object} - 获取访客记录
 */
exports.deleteOptlogsList = [
  tokenAuthentication,
  checkApiPermission("manage:operate:deteleList"),
  async (req, res, next) => {
    try {
      let obj = req.body.map((item) => {
        return {
          actionId: item,
          status: 0,
        };
      });
      await userOptLogsModel
        .bulkCreate(obj, { updateOnDuplicate: ["status"] })
        .then((result) => {
          return apiResponse.successResponse(res, "删除成功");
        })
        .catch((err) => {
          return apiResponse.ErrorResponse(res, "删除失败");
        });
    } catch (err) {
      next(err);
    }
  },
];
