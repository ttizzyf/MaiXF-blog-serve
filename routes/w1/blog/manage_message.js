/**
 *@author MaiXF
 *@date 2023/2/17
 *@Description:博文管理相关的接口
 */
const express = require("express");
const router = express.Router();
const manage_message_controller = require("../../../controllers/w1/blog/blog_manage_message_controller");

/**
 * 删除文章评论或留言
 * @route POST /w1/blog/manage_message/list
 * @group 博文相关 - 留言相关接口
 * @param {string} pageNum 当前页码
 * @param {string} pageSize 页面大小
 * @param {string} comment 博客名称
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.get("/list", manage_message_controller.client_blog_manage_MessageList);

module.exports = router;
