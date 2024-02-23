const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const apiResponse = require("../../../utils/apiResponse.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  uploadFileMiddleware,
} = require("../../../middlewares/uploadMiddleware.js");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const {
  checkApiPermission,
} = require("../../../middlewares/checkPermissionsMiddleware");

/**
 * 用户上传接口
 * @date 2023/12/19
 * @param {Object} file - 上传文件的file二进制数据
 * @returns {Object} - 返回图片路径和图片名称
 */

exports.upload = [
  tokenAuthentication,
  checkApiPermission("common:upload"),
  actionRecords({ module: "上传文件" }),
  uploadFileMiddleware("uploads/"),
  async (req, res) => {
    try {
      const file = req.file;
      const fileName = file.filename;
      let fileFolder;
      if (
        file.mimetype.startsWith("image/") &&
        file.mimetype !== "image/svg+xml"
      ) {
        fileFolder = "images";
      } else if (
        file.mimetype.startsWith("video/") ||
        file.mimetype.startsWith("audio/")
      ) {
        fileFolder = "media";
      } else {
        fileFolder = "files";
      }
      const fileUrl = `${process.env.URL}:${process.env.NGPORT}/uploads/${fileFolder}/${fileName}`;
      return apiResponse.successResponseWithData(res, "文件上传成功", {
        file,
        fileName,
        fileUrl,
      });
    } catch (err) {
      console.log(chalk.bold.red("上传文件失败"));
      return apiResponse.ErrorResponse(res, "上传文件失败");
    }
  },
];
