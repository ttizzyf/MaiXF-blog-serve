/**
 *@author MaiXF
 *@date 2023/2/12
 *@Description:博文管理相关的接口
 */
const express = require("express");
const router = express.Router();
const blog_comment_controller = require("../../../controllers/w1/blog/blog_comment_controller.js");

/**
 * 获取博文评论列表
 * @route GET /w1/blog/blog_comment/list
 * @group 博文相关 - 博文评论相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} comment 留言内容
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

/**
 * 新增文章评论或留言
 * @route POST /w1/blog/blog_comment/create
 * @group 博文相关 - 博文评论相关接口
 * @param {string} messagePid 父级id
 * @param {string} userId 本条消息用户id
 * @param {string} toUserId 回复用户id
 * @param {string} relatedArticleId 是否为文章评论(如果是文章评论,值为文章ID,如果是留言,则为null)
 * @param {string} content 留言或评论内容
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/create", blog_comment_controller.client_blog_comment_create);

/**
 * 更新文章评论或留言
 * @route POST /w1/blog/blog_comment/update
 * @group 博文相关 - 博文评论相关接口
 * @param {string} messageId 消息id
 * @param {string} relatedArticleId 是否为文章评论(如果是文章评论,值为文章ID,如果是留言,则为null)
 * @param {string} content 留言或评论内容
 * @param {string} hidden 是否隐藏(0是隐藏,1是展示)
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/update", blog_comment_controller.client_blog_comment_update);

/**
 * 删除文章评论或留言
 * @route POST /w1/blog/blog_comment/delete
 * @group 博文相关 - 博文评论相关接口
 * @param {string} messageId 消息id
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/delete", blog_comment_controller.client_blog_comment_delete);

/**
 * 获取留言列表
 * @route POST /w1/blog/manage_message/list
 * @group 博文相关 - 留言相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} comment 博客名称
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get(
  "/Messagelist",
  blog_comment_controller.client_blog_manage_MessageList
);

module.exports = router;
