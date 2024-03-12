const fs = require("fs");
const path = require("path");
const apiResponse = require("../../../utils/apiResponse.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware.js");

/**
 * 获取网站设置
 * @date 2023/3/9
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.setting = [
  async (req, res, next) => {
    try {
      const webSetting = require("../../../webSetting.js");
      return apiResponse.successResponseWithData(res, "加载成功", webSetting);
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 修改网站设置
 * @date 2023/3/9
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.update = [
  tokenAuthentication,
  checkApiPermission("common:setting:update"),
  async (req, res, next) => {
    try {
      const newSettingsString = `module.exports = ${JSON.stringify(
        req.body,
        null,
        2
      )};`;
      const filePath = path.join(__dirname, "../../../webSetting.js");
      fs.writeFile(filePath, newSettingsString, (err) => {
        if (err) {
          apiResponse.ErrorResponse(res, "配置更新失败");
          return;
        }
        apiResponse.successResponse(res, "配置更新成功");
      });
    } catch (err) {
      next(err);
    }
  },
];
