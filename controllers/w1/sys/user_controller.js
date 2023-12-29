const sequelize = require("sequelize");
// 模糊匹配
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const { body, validationResult, query } = require("express-validator");
const userModel = require("../../../models/w1/blog/user_model.js");
const apiResponse = require("../../../utils/apiResponse.js");
const {
  getPublicIP,
  randomNum,
  getEmailAvatar,
  encryption,
  parseIP,
  decryption,
} = require("../../../utils/otherUtils.js");
const sendEmail = require("../../../utils/sendEmail.js");
const { info, error } = require("../../../utils/logger.js");
const actionRecords = require("../../../middlewares/actionLogsMiddleware.js");
const {
  uploadMiddleware,
} = require("../../../middlewares/uploadMiddleware.js");
const tokenAuthentication = require("../../../middlewares/tokenAuthentication.js");
const svgCaptcha = require("svg-captcha");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const chalk = require("chalk");
const UAParser = require("ua-parser-js");

/**
 * 用户注册接口
 * @date 2023/12/11
 * @param {Object} req - 请求对象，包含查询参数
 * @returns {Object} - 包含用户信息展示
 */

exports.register = [
  actionRecords({ module: "注册" }),
  [
    body("email")
      .notEmpty()
      .withMessage("邮箱不能为空")
      .custom(async (value, { req }) => {
        const user = await userModel.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject(`邮箱:${user.email}已经注册,请更换其他.`);
        }
      }),
    body("password")
      .notEmpty()
      .withMessage("密码不能为空.")
      .isLength({ min: 6, max: 22 })
      .trim()
      .withMessage("密码应为6-22位"),
    body("nickname").notEmpty().withMessage("昵称不能为空."),
    body("emailCode").notEmpty().withMessage("邮箱验证码不能为空"),
  ],
  async (req, res, next) => {
    try {
      console.log(chalk.bold.green(JSON.stringify(req.body)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
      }
      let { emailCode } = req.session;
      console.log(chalk.bold.green(emailCode));
      if (!emailCode) {
        return apiResponse.unauthorizedResponse(
          res,
          "邮箱验证码已过期,请重新发送"
        );
      }
      if (emailCode != req.body.emailCode) {
        return apiResponse.unauthorizedResponse(
          res,
          "邮箱验证码错误,请重新提交"
        );
      }
      const clientIP = getPublicIP(req);
      console.log(chalk.bold.green("IP地址" + clientIP));
      // 识别常见的浏览器操作系统以及设备信息等等
      const webInfo = new UAParser(req.headers["use-agent"]);
      // IP地址解析
      const address = await parseIP(clientIP);
      // 获取操作平台
      const equipment = webInfo.getBrowser().name
        ? `${webInfo.getBrowser().name}.v${webInfo.getBrowser().major}`
        : "未知";
      const avatar = getEmailAvatar(req.body.email);
      const enPassword = await encryption(req.body.password);
      console.log(chalk.bold.green("---头像地址---", avatar));
      console.log(chalk.bold.red("------加密密码", enPassword));
      let newUser = {
        userType: "user",
        email: req.body.email,
        password: enPassword,
        avatar,
        nickname: req.body.nickname,
        remark: "",
        status: 1,
        website: req.body.website,
        platform: equipment,
        userIp: clientIP,
        address,
      };
      const addInfo = userModel.create(newUser);
      if (addInfo) {
        sendEmail.sendEmail(
          "regisiter",
          req.body.email,
          "恭喜你已注册成功,感谢关注"
        );
        info(`新用户${req.body.email}注册成功`);
        return apiResponse.successResponse(res, "用户注册成功！");
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 邮箱验证码
 * @date 2023/12/11
 * @param {string}  email  邮箱
 * @returns {Object}
 */

exports.emailConfirmCode = [
  // 邮箱参数校验
  [
    query("email")
      .notEmpty()
      .withMessage("邮箱不能为空")
      .isEmail()
      .normalizeEmail()
      .withMessage("邮箱格式错误"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
      } else {
        let query = { email: req.query.email };
        const userInfo = await userModel.findOne({
          where: query,
          attributes: ["email"],
        });
        if (userInfo) {
          return apiResponse.unauthorizedResponse(res, "邮箱号码已验证");
        }
        let newCode = randomNum(4);
        console.log(chalk.bold.green(newCode));
        await sendEmail.sendEmail("sendEmail", req.query.email, newCode);
        req.session.emailCode = newCode;
        return apiResponse.successResponse(
          res,
          "验证码发送成功,请在5分钟内进行验证"
        );
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, JSON.stringify(err));
    }
  },
];

/**
 * 用户登录接口
 * @date 2023/12/13
 * @param {string}  email 邮箱账号
 * @param {string}  password 密码
 * @param {string}  code 验证码
 * @returns {Object} - 包含用户信息展示
 */

exports.login = [
  actionRecords({ module: "登录" }),
  [
    body("email").notEmpty().withMessage("邮箱账户不能为空"),
    body("password").notEmpty().withMessage("用户密码不能为空"),
    body("code").notEmpty().withMessage("验证码不能为空"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
      }
      const { code } = req.session;
      if (!code) {
        return apiResponse.validationErrorWithData(res, "验证码已经失效");
      }
      if (code !== req.body.code) {
        return apiResponse.validationErrorWithData(res, "验证码错误");
      }
      const userData = await userModel.findOne({
        where: { email: req.body.email },
      });
      console.log(chalk.bold.green(userData));
      if (!userData) {
        return apiResponse.validationErrorWithData(res, "用户名或密码错误");
      }
      const pass = await decryption(req.body.password, userData.password);
      console.log(pass);
      if (!pass) {
        return apiResponse.validationErrorWithData(res, "用户名或密码错误");
      }
      if (!userData.status) {
        return apiResponse.validationErrorWithData(
          res,
          "当前账户已被禁用,请与管理员联系"
        );
      }
      let userInfo = {
        userId: userData.userId,
        email: userData.email,
        nickname: userData.nickname,
        status: userData.status,
        avatar: userData.avatar,
        website: userData.website,
        platform: userData.platform,
      };
      userInfo.token =
        "Bearer " +
        jwt.sign(userInfo, process.env.SIGN_KEY, {
          expiresIn: 3600 * 24 * 3, //过期时间为3天
        });
      info(`昵称为${userInfo.nickname}的用户 登录成功`);
      return apiResponse.successResponseWithData(res, "登录成功", userInfo);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 生成验证码接口
 * @date 2023/12/13
 * @returns {string} - 包含验证码链接
 */

exports.captcha = [
  async (req, res, next) => {
    try {
      //验证码配置api
      let options = {
        //线条数
        noise: Math.floor(Math.random() * 5),
        color: true,
        fontSize: 55,
        width: 90,
        height: 38,
      };
      let captcha = svgCaptcha.createMathExpr(options);
      console.log(chalk.bold.green(captcha.text));
      req.session.code = captcha.text;
      return apiResponse.successResponseWithData(res, "成功", captcha.data);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * 修改用户信息接口
 * @date 2023/12/20
 * @returns {Object} - 修改后的用户信息
 */

exports.emitUser = [
  tokenAuthentication,
  actionRecords({ module: "修改用户信息" }),
  async (req, res) => {
    try {
      const Userinfo = await userModel.findOne({
        where: { userId: req.userId },
      });
      let user = Userinfo.get();
      console.log(user);
      let updateUserInfo = {};
      if (req.body?.email && req.body.email !== user.email)
        updateUserInfo.email = req.body.email;
      if (req.body?.nickname && req.body.nickname !== user.nickname)
        updateUserInfo.nickname = req.body.nickname;
      if (req.body?.avatar && req.body.avatar !== user.avatar)
        updateUserInfo.avatar = req.body.avatar;
      if (req.body.website !== user.website)
        updateUserInfo.website = req.body.website;
      if (Object.keys(updateUserInfo).length === 0) {
        return apiResponse.ErrorResponse(res, "数据未进行修改");
      }
      await userModel.update(updateUserInfo, {
        where: { userId: req.userId },
      });
      return apiResponse.successResponseWithData(
        res,
        "用户信息更新成功",
        updateUserInfo
      );
    } catch (error) {
      return apiResponse.ErrorResponse(res, JSON.stringify(error));
    }
  },
];
