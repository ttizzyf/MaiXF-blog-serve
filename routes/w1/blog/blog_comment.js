/**
 *@author MaiXF
 *@date 2023/2/12
 *@Description:博文管理相关的接口
 */
const express = require("express");
const router = express.Router();
const blog_comment_controller = require("../../../controllers/w1/blog/blog_comment-controller.js");

/**
 * 获取博文评论列表
 * @route GET /w1/blog/blog_comment/list
 * @group 博文相关 - 博文评论相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} comment 博客名称
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get("/list", blog_comment_controller.client_blog_commentList);

/**
 * 文章点赞和反对
 * @route POST /w1/blog/blog_comment/likeOrOppose
 * @group 博文相关 - 博文评论相关接口
 * @param {string} id 文章id
 * @param {string} likeOrOppose 点赞或者反对
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/likeOrOppose", blog_comment_controller.client_blog_likeOrOppose);

module.exports = router;
