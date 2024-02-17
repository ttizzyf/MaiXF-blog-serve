const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const apiResponse = require("../../../utils/apiResponse.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const seqUtils = require("../../../utils/seqUtils.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const messageModel = require("../../../models/w1/blog/message_model.js");
const userModel = require("../../../models/w1/blog/user_model.js");
const blogArticleModel = require("../../../models/w1/blog/blog_article_model.js");
const { modelData } = require("../../../utils/otherUtils.js");
const { deleteNullObj } = require("../../../utils/otherUtils.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

/**
 * 获取留言列表
 * @date 2023/2/17
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_manage_MessageList = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      let pm = req.query;
      pm.where = {
        relatedArticleId: {
          [Op.is]: null,
        },
        // 主要一级评论
        messagePid: {
          [Op.is]: null,
        },
        hidden: 1,
        content: req.query.comment,
      };
      pm.where.content
        ? (pm.where.content = { [Op.substring]: `%${pm.where.content}%` })
        : (pm.where.content = "");
      pm.include = [
        {
          model: userModel,
          attributes: { exclude: ["password"] },
          as: "userInfo",
        },
      ];
      pm.sort = {
        prop: "createdAt",
        order: "desc",
      };
      seqUtils.list(messageModel, pm, async (list) => {
        let newList = modelData(list.data.data, "userInfo", "userInfo");
        list.data.data = newList;
        let sonPromises = [];
        newList.forEach((item, index) => {
          let sonItem = {
            raw: true,
            order: [["createdAt", "DESC"]],
            where: {
              messagePid: item.messageId,
              hidden: 1,
            },
            include: [
              {
                model: userModel,
                attributes: { exclude: ["password"] },
                as: "userInfo",
              },
              {
                model: userModel,
                attributes: { exclude: ["password"] },
                as: "toUserInfo",
              },
            ],
          };
          // 将每次的异步操作加入数组
          sonPromises.push(
            messageModel.findAndCountAll(sonItem).then((sonData) => {
              let newSon = modelData(sonData.rows, "userInfo", "userInfo");
              let newSonData = modelData(newSon, "toUserInfo", "toUserInfo");
              return newSonData; // 返回子评论数据
            })
          );
        });
        // 等待所有的异步操作完成
        let sonResults = await Promise.all(sonPromises);
        // 将子评论数据赋值给相应的父评论
        newList.forEach((item, index) => {
          list.data.data[index].replyInfo = sonResults[index];
        });
        return apiResponse.successResponseWithData(res, "获取成功", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];
