/**
 *@author MaiXF
 *@date 2023/12/19
 *@Description:上传文件接口
 */

const express = require("express");
const router = express.Router();
const upload_file_controller = require("../../../controllers/w1/common/upload_file_controller.js");

/**
 * 上传文件
 * @route POST /w1/common/upload
 * @group 上传下载 - 上传下载相关
 * @param {Object} file 上传文件的file二进制数据
 * @returns {object} 200 - {"status": 1,"message": "文件上传成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.post("/", upload_file_controller.upload);

module.exports = router;
