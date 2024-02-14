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
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

/**
 * 获取文章评论接口
 * @date 2023/2/12
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_commentList = [
  tokenAuthentication,
  async (req, res) => {
    try {
      let pm = req.query;
      pm.where = {
        relatedArticleId: {
          [Op.not]: null,
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
      pm.include = [
        {
          model: userModel,
          attributes: { exclude: ["password"] },
          as: "userInfo",
        },
        {
          model: blogArticleModel,
          attributes: ["title", "id"],
          as: "articleInfo",
        },
      ];
      console.log(pm);
      seqUtils.list(messageModel, pm, async (list) => {
        console.log(list);
        let newList = modelData(list.data.data, "userInfo", "userInfo");
        let newArticle = modelData(newList, "articleInfo", "articleInfo");
        list.data.data = newArticle;
        let sonPromises = [];
        newList.forEach((item, index) => {
          let sonItem = {
            raw: true,
            sort: {
              prop: "createdAt",
              order: "desc",
            },
            where: {
              messagePid: item.messageId,
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
        return apiResponse.successResponseWithData(res, "操作成功", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 更新文章点赞或者反对
 * @date 2023/2/14
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_likeOrOppose = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      console.log(req.body.id);
      let pm = {};
      pm.where = {
        messageId: req.body.id,
        hidden: 1,
      };
      seqUtils.findOne(messageModel, pm, (data) => {
        if (data.code === 808) {
          apiResponse.ErrorResponse(res, "该留言未找到或已删除");
        }
        let obj;
        if (req.body.likeOrOppose === "like") {
          obj = {
            likeNum: (data.data.likeNum || 0) + 1,
          };
        } else {
          obj = {
            opposeNum: (data.data.opposeNum || 0) + 1,
          };
        }
        seqUtils.update(messageModel, obj, pm.where, (endData) => {
          if (endData.code === 808) {
            return apiResponse.ErrorResponse(res, "更新失败");
          }
          return apiResponse.successResponse(res, "操作成功");
        });
      });
    } catch (err) {
      next(err);
    }
  },
];
