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
const { sendEmail } = require("../../../utils/sendEmail.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");

/**
 * 获取文章评论接口
 * @date 2023/2/12
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_commentList = [
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
        {
          model: blogArticleModel,
          attributes: ["title", "id"],
          as: "articleInfo",
        },
      ];
      pm.sort = {
        prop: "createdAt",
        order: "desc",
      };
      seqUtils.list(messageModel, pm, async (list) => {
        let newList = modelData(list.data.data, "userInfo", "userInfo");
        let newArticle = modelData(newList, "articleInfo", "articleInfo");
        list.data.data = newArticle;
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

/**
 * 新建文章评论或留言
 * @date 2023/2/15
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_comment_create = [
  tokenAuthentication,
  actionRecords({ module: "新增留言或评论" }),
  async (req, res, next) => {
    try {
      let pm = deleteNullObj(req.body);
      pm.userId = req.user.userId;
      // 是否发送邮件
      if (req.body.isSendEmail) {
        seqUtils.findOne(
          userModel,
          { where: { userId: req.body.toUserId } },
          async (toUserInfo) => {
            if (toUserInfo.code === 808) {
              return apiResponse.ErrorResponse(res, "回复用户不存在");
            }
            await sendEmail("callback", toUserInfo.data.email, pm.content);
          }
        );
      }
      seqUtils.create(messageModel, pm, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "创建失败");
        }
        return apiResponse.successResponse(res, "评论成功");
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 修改文章评论
 * @date 2023/2/15
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_comment_update = [
  tokenAuthentication,
  checkApiPermission("blog:blog_comment:update"),
  actionRecords({ module: "修改留言或评论" }),
  async (req, res, next) => {
    try {
      console.log(req.body);
      let key = {
        messageId: req.body.messageId,
      };
      let obj = {
        relatedArticleId: req.body?.relatedArticleId || "",
        content: req.body.content,
      };
      seqUtils.update(messageModel, deleteNullObj(obj), key, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "修改失败");
        }
        // 当一级评论修改文章选项之后,需要评论回复也将文章选项修改
        if (req.body?.relatedArticleId) {
          let replyKey = {
            messagePid: req.body.messageId,
          };
          let replyObj = {
            relatedArticleId: req.body?.relatedArticleId,
          };
          seqUtils.update(messageModel, replyObj, replyKey, (replyData) => {
            if (data.code === 808) {
              return apiResponse.ErrorResponse(res, "修改失败");
            }
            return apiResponse.successResponse(res, "修改成功");
          });
        } else {
          return apiResponse.successResponse(res, "修改成功");
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 删除文章评论
 * @date 2023/2/17
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_comment_delete = [
  tokenAuthentication,
  checkApiPermission("blog:blog_comment:delete"),
  actionRecords({ module: "删除留言或评论" }),
  async (req, res, next) => {
    try {
      let key = {
        messageId: req.body.messageId,
      };
      seqUtils.update(messageModel, { hidden: 0 }, key, (data) => {
        if (data.code === 808) {
          return apiResponse.ErrorResponse(res, "删除失败");
        }
        let replyKey = {
          messagePid: req.body.messageId,
        };
        seqUtils.update(messageModel, { hidden: 0 }, replyKey, (ReplyData) => {
          return apiResponse.successResponse(res, "删除成功");
        });
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 获取留言列表
 * @date 2023/2/17
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.client_blog_manage_MessageList = [
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
      pm.messageId
        ? (pm.where.messageId = { [Op.eq]: `${pm.messageId}` })
        : (pm.messageId = "");
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
