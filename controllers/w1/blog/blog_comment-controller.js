const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const apiResponse = require("../../../utils/apiResponse.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const seqUtils = require("../../../utils/seqUtils.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const messageModel = require("../../../models/w1/blog/message_model.js");
const userModel = require("../../../models/w1/blog/user_model.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

userModel.belongsTo(messageModel, {
  foreignKey: "userId", // 指定外键，即文章表中关联用户的字段
  targetKey: "messageId", // 指定关联的模型的主键，即用户表中关联用户的字段
});

// 获取文章评论列表
exports.client_blog_commentList = [
  tokenAuthentication,
  async (req, res) => {
    try {
      let pm = req.query;
      pm.where = {
        relatedArticleId: {
          [Op.not]: 0,
        },
        // 主要一级评论
        messagePid: {
          [Op.is]: null,
        },
        content: req.query.comment,
      };
      pm.where.content
        ? (pm.where.content = { [Op.substring]: `%${pm.where.content}%` })
        : (pm.where.content = "");
      pm.include = [];

      seqUtils.list(messageModel, pm, (list) => {
        console.log(list.data.data);
        return apiResponse.successResponse(res, "操作成功");
      });
    } catch (err) {
      next(err);
    }
  },
];
