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
 * @param {string} pageNum 当前页码
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

/**
 * 新建博文
 * @route POST /w1/blog/blog_article/create
 * @group 博文相关 - 博文管理相关接口
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/create", blog_article_controller.new_create_article);

/**
 * 根据id修改博文
 * @route POST /w1/blog/blog_article/update
 * @group 博文相关 - 博文管理相关接口
 * @param {string} id 博文id
 * @param {string} title 博文标题
 * @param {string} cover 博文封面
 * @param {string} abstract 博文摘要
 * @param {string} content 博文内容
 * @param {string} userId 作者id
 * @param {string} remark 备注
 * @param {number} category 分类(1是技术,2是生活,3是其他)
 * @param {number} isReship 是否转载(1是转载2是原创)
 * @param {string} isReshipUrl 转载地址
 * @param {string} isReshipName 转载地址
 * @param {number} recommended 是否精选(0是不精选,1是精选)
 * @param {number} likeToken 点赞的临时标识(0是未点赞,1是点赞)
 * @param {number} status 状态发布和草稿(0是删除,1是发布,2是草稿)
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.post("/update", blog_article_controller.blog_article_update);

/**
 * 根据id查询文章详情
 * @route POST /w1/blog/blog_article/details
 * @group 博文相关 - 博文管理相关接口
 * @param {string} id 博文id
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/details", blog_article_controller.get_article_details);

/**
 * 上传md文件并解析
 * @route POST /w1/blog/blog_article/uploadArticleMd
 * @group 博文相关 - 博文管理相关接口
 * @param {Blob} file md文件
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/uploadArticleMd", blog_article_controller.upload_article_md);

/**
 * 删除博文
 * @route POST /w1/blog/blog_article/delete
 * @group 博文相关 - 博文管理相关接口
 * @param {Blob} file md文件
 * @returns {object} 200 - {"status": 1,"message": "success.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post("/delete", blog_article_controller.delete_article);

module.exports = router;
