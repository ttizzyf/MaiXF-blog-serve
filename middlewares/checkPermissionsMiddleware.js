const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const chalk = require("chalk");
const apiResponse = require("../utils/apiResponse.js");
const log = require("../utils/logger.js");
const permissionsModel = require("../models/w1/blog/permissions_model.js");
const rolesModel = require("../models/w1/blog/roles_model.js");
const sequeUtil = require("../utils/seqUtils");

/**
 *@author MaiXF
 *@date 2023/2/23
 *@Description:权限检测中间件
 * TODO:使用：checkApiPermission('sys:auth:emitUser')
 */
const checkApiPermission = (permission) => {
  return async (req, res, next) => {
    try {
      console.log(req.user.roleInfo.roleAuth);
      sequeUtil.findOne(
        rolesModel,
        { where: { roleAuth: req.user.roleInfo.roleAuth } },
        async (data) => {
          let role = data.data;
          if (!role.status) {
            return apiResponse.unauthorizedResponse(
              res,
              "您的角色已被禁用,请联系管理员"
            );
          }
          let perms = role.perms.split("、");
          let permsPm = {
            where: {
              permissionId: {
                [Op.in]: perms,
              },
            },
            attributes: ["key"],
            raw: true,
          };
          // 根据id获取权限列表
          permissionsModel.findAll(permsPm).then(async (PermsData) => {
            let peresList = PermsData.map((item) => {
              return item.key;
            });
            // 权限判断
            if (peresList.includes(permission)) {
              const permissionInfo = await permissionsModel.findOne({
                where: {
                  key: permission,
                },
                raw: true,
              });
              if (!permissionInfo.status) {
                console.error(
                  chalk.red("【权限已被禁用】: " + req.method + req.baseUrl)
                );
                return apiResponse.ErrorResponse(
                  res,
                  "您访问的权限已被禁用，请联系管理员"
                );
              }
              return next();
            } else {
              console.error(
                chalk.bold.red("*********************************")
              );
              console.error(chalk.red("【OPERATOR】: " + req.user.nickname));
              console.error(
                chalk.red("【权限未通过】: " + req.method + req.baseUrl)
              );
              console.error(
                chalk.red("【    DATE】: " + new Date().toLocaleString())
              );
              console.error(
                chalk.bold.red("*********************************")
              );
              return apiResponse.ErrorResponse(
                res,
                "您暂时没有权限访问,请联系管理员"
              );
            }
          });
        }
      );
    } catch (err) {
      console.error(chalk.bold.red("*********************************"));
      console.error(err);
      console.error(chalk.red("【    DATE】: " + new Date().toLocaleString()));
      console.error(chalk.bold.red("*********************************"));
      return apiResponse.validationErrorWithData(res, "接口权限验证错误", err);
    }
  };
};

module.exports = { checkApiPermission };
