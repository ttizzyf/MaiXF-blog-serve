const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const { body, validationResult } = require("express-validator");
const blogArticleModel = require("../../../models/w1/blog/blog_article_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const { getPublicIP } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  uploadMiddleware,
} = require("../../../middlewares/uploadMiddleware.js");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const chalk = require("chalk");

/**
 * 前台获取博文列表
 * @date 2023/12/11
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */

exports.client_blog_articleList = [
  async (req, res, next) => {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 15;
      // 排列参数
      let sortColumn = req.query.columnKey || "createdAt"; // 以什么关键词进行排序
      let sortOrder = req.query.sortOrder || 1; // 确认排序方式 1 升序 -1降序
      // 搜索条件(没有则不添加)
      let title = req.query.title || "";
      let recommended = req.query.recommended || ""; //是否精选0是精选，1是非精选
      let category = req.query.category || ""; // 博文分类
      // 聚合搜索条件
      let searchArticleListParams = {
        where: {
          title: { [Op.like]: `%${title}%` },
          // recommended: { [Op.ne]: "" },
        },
        order: [[sortColumn, sortOrder === 1 ? "ASC" : "DESC"]],
        limit: Number(pageSize),
        offset: Number(pageSize) * (current - 1),
      };
      // 添加条件搜索
      if (recommended === "0" || recommended === "1") {
        searchArticleListParams.where.recommended = recommended;
      }
      if (category) {
        searchArticleListParams.where.category = category;
      }
      const articleList = await blogArticleModel.findAll(
        searchArticleListParams
      );
      console.log(searchArticleListParams);
      console.log(chalk.bold.green(articleList));
      return apiResponse.successResponseWithData(
        res,
        "success",
        articleList.length > 0 ? articleList : []
      );
    } catch (err) {
      next(err);
    }
  },
];
