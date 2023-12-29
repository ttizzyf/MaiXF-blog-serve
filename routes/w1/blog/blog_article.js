/**
 *@author MaiXF
 *@date 2023/12/10
 *@Description:博文管理相关的接口
 */
const express = require("express");
const router = express.Router();
const blog_article_controller = require("../../../controllers/w1/blog/blog_article_controller.js");

/**
 * 获取博文列表
 * @route GET /w1/blog/blog_article/list
 * @group 博文相关 - 博文管理相关接口
 * @param {string} current 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} title 博客名称
 * @param {string} columnKey 排列关键词
 * @param {string} sortOrder 正序或者倒叙排列
 * @param {string} recommended 是否精选(0是精选，1是非精选)
 * @param {string} category 博文分类
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", blog_article_controller.client_blog_articleList);

module.exports = router;
