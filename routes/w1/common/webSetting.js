/**
 *@author MaiXF
 *@date 2024/3/9
 *@Description:网站设置接口
 */

const express = require("express");
const router = express.Router();
const web_setting_controller = require("../../../controllers/w1/common/web_setting_controller.js");

/**
 * 获取网站设置
 * @route POST /w1/common/webSetting
 * @group 网站设置 - 网站设置
 * @returns {object} 200 - {"status": 1,"message": "文件上传成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.get("/", web_setting_controller.setting);

/**
 * 修改网站设置
 * @route POST /w1/common/webSetting/update
 * @group 网站设置 - 网站设置
 * @returns {object} 200 - {"status": 1,"message": "文件上传成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */
router.post("/update", web_setting_controller.update);

module.exports = router;
