const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 *@author MaiXF
 *@date 2023/12/9
 *@Description:上传文件中间件
 * TODO:使用：
 *
 * @param {String} uploadFilePath - 上传文件目标路径
 * @param {String} uploadFileName - 上传文件字段名 默认file,通过file.name取到文件名
 * @returns {Function} - Express 中间件函数
 */

const uploadFileMiddleware = (uploadFilePath, uploadFileName = "file") => {
  // 配置multer缓存
  const storage = multer.diskStorage({
    // 设置上传后文件的路径
    destination: (req, file, cb) => {
      // 这里的文件路径，不是相对路径，直接从项目的根目录开始写就行了
      let filePath;
      // 根据上传文件类型不同，将文件存储到不同的文件夹内
      if (
        file.mimetype.startsWith("image/") &&
        file.mimetype !== "image/svg+xml"
      ) {
        filePath = path.join(uploadFilePath, "images");
      } else if (
        file.mimetype.startsWith("video/") ||
        file.mimetype.startsWith("audio/")
      ) {
        filePath = path.join(uploadFilePath, "media");
      } else {
        filePath = path.join(uploadFilePath, "files");
      }
      cb(null, filePath);
    },
    // 给上传的文件重命名
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      // 用时间戳可以防止图片命名重复
      const newFilename = `${timestamp}${extension}`;
      cb(null, newFilename);
    },
  });

  const upload = multer({
    storage,
  });

  return upload.single(uploadFileName);
};

module.exports = { uploadFileMiddleware };
