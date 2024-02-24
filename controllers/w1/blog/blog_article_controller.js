const sequelize = require("sequelize");
// sequlize运算符Op
const Op = sequelize.Op;
const { body, validationResult } = require("express-validator");
const blogArticleModel = require("../../../models/w1/blog/blog_article_model.js");
const userModel = require("../../../models/w1/blog/user_model.js");
const messageModel = require("../../../models/w1/blog/message_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const {
  getPublicIP,
  modelData,
  deleteNullObj,
} = require("../../../utils/otherUtils.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const seqUtils = require("../../../utils/seqUtils.js");
const {
  uploadFileMiddleware,
} = require("../../../middlewares/uploadMiddleware.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const chalk = require("chalk");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");

let objStr = "userInfo";

blogArticleModel.belongsTo(userModel, {
  foreignKey: "userId", // 指定外键，即文章表中关联用户的字段
  targetKey: "userId", // 指定关联的模型的主键，即用户表中关联用户的字段
  as: objStr,
});
userModel.hasMany(blogArticleModel, { foreignKey: "userId", as: "article" });

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
      let {
        pageNum = 1,
        pageSize = 10,
        title = "",
        category = "",
        recommended = "",
        isReship = "",
      } = req.query;
      let pm = {
        where: {
          title,
          category,
          recommended,
          isReship,
          status: {
            [Op.not]: 0,
          },
        },
        pageSize,
        pageNum,
        attributes: [
          "id",
          "title",
          "category",
          "cover",
          "viewNum",
          "likeNum",
          "status",
          "recommended",
          "isReship",
          "createdAt",
          "abstract",
        ],
        include: [
          {
            model: userModel,
            attributes: ["userId", "nickname", "email"], // 指定要返回的用户字段
            as: objStr,
          },
        ],
        sort: {
          prop: "createdAt",
          order: "desc",
        },
      };
      pm.where.title
        ? (pm.where.title = { [Op.substring]: `%${pm.where.title}%` })
        : (pm.where.title = "");
      seqUtils.list(blogArticleModel, pm, async (list) => {
        let newList = modelData(list.data.data, objStr, objStr);
        list.data.data = newList;
        let messagePromises = [];
        list.data.data.forEach((item, index) => {
          let messagePm = {
            where: {
              relatedArticleId: item.id,
              hidden: 1,
            },
            raw: true,
          };
          messagePromises.push(
            messageModel.findAndCountAll(messagePm).then((message) => {
              // 统计评论总数
              return message.count;
            })
          );
        });
        await Promise.all(messagePromises).then((data) => {
          list.data.data.forEach((item, index) => {
            item["messageNum"] = data[index];
          });
        });
        return apiResponse.successResponseWithData(res, "success", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];
/**
 * 后台获取博文列表
 * @date 2023/12/11
 * @param {Object} req - 请求对象，包含查询参数
        }
        return apiResponse.successResponseWithData(res, "success", list.data);
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 通过id修改获取博文
 * @date 2023/2/3
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */

exports.blog_article_update = [
  tokenAuthentication,
  checkApiPermission("blog:blog_article:update"),
  async (req, res, next) => {
    try {
      let pm = req.body;
      key = { id: req.body.id };
      seqUtils.update(blogArticleModel, pm, key, (data) => {
        if (data.code === 200) {
          return apiResponse.successResponse(res, data.message);
        } else {
          return apiResponse.ErrorResponse(res, data.message);
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 通过id查询文章详情
 * @date 2023/2/3
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */

exports.get_article_details = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      let pm = {};
      pm.where = req.body;
      seqUtils.findOne(blogArticleModel, pm, (data) => {
        if (data.code === 200) {
          return apiResponse.successResponseWithData(
            res,
            data.message,
            data.data
          );
        } else {
          return apiResponse.ErrorResponse(res, data.message);
        }
      });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * 上传md文件并解析
 * @date 2023/2/6
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.upload_article_md = [
  tokenAuthentication,
  checkApiPermission("blog:blog_article:uploadArticleMd"),
  uploadFileMiddleware("uploads/"),
  async (req, res) => {
    try {
      if (!req.file) return apiResponse.ErrorResponse(res, "没有上传文件");
      const file = req.file;
      const fileName = file.filename;
      const filePath = path.join(process.cwd(), "uploads/files", fileName);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          // 文件读取失败
          console.error(err);
          return apiResponse.ErrorResponse(res, "文件不存在");
        }
        let fileData = data;
        // 提取图片地址
        const imgSrcRegex = /<img[^>]+src="([^">]+)"/g;
        const imgSrcMatches = fileData.match(imgSrcRegex);
        const imageUrls = imgSrcMatches
          ? imgSrcMatches.map((match) => match.match(/src="([^">]+)"/)[1])
          : [];
        // 提取部分文字作为摘要
        const excerptLength = 150; // 摘要长度
        const cleanedFileData = marked
          .parse(fileData)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/\n/g, "")
          .replace(/\\"/g, ""); // 移除 HTML 标签
        const plainTextExcerpt = cleanedFileData.slice(0, excerptLength);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return apiResponse.ErrorResponse(res, "文件删除失败");
          }
          // 返回成功响应
          return apiResponse.successResponseWithData(res, "解析成功", {
            fileName,
            fileData,
            imageUrls,
            plainTextExcerpt,
          });
        });
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 删除博文
 * @date 2023/2/6
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.delete_article = [
  tokenAuthentication,
  checkApiPermission("blog:blog_article:delete"),
  actionRecords({ module: "删除博文" }),
  async (req, res) => {
    try {
      console.log(req.user);
      seqUtils.update(blogArticleModel, { status: 0 }, req.body, (data) => {
        if (data.code === 200) {
          return apiResponse.successResponse(res, "删除成功");
        } else {
          return apiResponse.ErrorResponse(res, data.message);
        }
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 新建博文
 * @date 2023/2/10
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */

exports.new_create_article = [
  tokenAuthentication,
  checkApiPermission("blog:blog_article:create"),
  actionRecords({ module: "新建博文" }),
  async (req, res) => {
    try {
      let pm = deleteNullObj(req.body);
      pm.userId = req.user.userId;
      seqUtils.create(blogArticleModel, pm, (info) => {
        return apiResponse.successResponse(res, "新建成功");
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 获取博文列表
 * @date 2023/2/15
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文列表展示
 */
exports.get_blog_select_list = [
  tokenAuthentication,
  async (req, res, next) => {
    try {
      let pm = {
        attributes: ["id", "title"],
        raw: true,
      };
      blogArticleModel.findAll(pm).then((list) => {
        return apiResponse.successResponseWithData(res, "获取成功", list);
      });
    } catch (err) {
      next(err);
    }
  },
];
