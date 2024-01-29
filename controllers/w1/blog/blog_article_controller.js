const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const { body, validationResult } = require("express-validator");
const blogArticleModel = require("../../../models/w1/blog/blog_article_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const { getPublicIP } = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const seqUtils = require("../../../utils/seqUtils.js");
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
      let pm;

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
