/**
 * @author MaiXF
 * @date 2023/12/11
 * @Description:发送邮件工具
 * TODO 使用:
 * @param {string} type - 发送的类型(sendEmail为发送验证码,regisiter为注册成功,callback为回复留言)
 * @param {string} to - 发送邮件的目标邮箱
 * @param {string} content - 发送邮件的内容
 * @returns {Promise} - 邮件发送状况
 */

const nodemailer = require("nodemailer");

exports.sendEmail = (type, to, content) => {
  // 构建nodemailer传输器,用qq邮箱的smtp运输协议
  let transporter = nodemailer.createTransport({
    service: "QQ",
    port: 465, //对应的端口号QQ邮箱的端口号是465
    secureConnection: true, //是否使用ssl
    auth: {
      //用户信息
      user: "1374144742@qq.com", //用来发邮件的邮箱账户
      pass: "zhzxfwrzkwrgiich", //这里的密码是qq的smtp授权码，可以去qq邮箱后台开通查看
    },
  });
  return new Promise((resolve, reject) => {
    let emailOptions;
    // 发送邮箱验证码
    if (type === "sendEmail") {
      emailOptions = {
        from: "MaiXF.ADMIN 1374144742@qq.com",
        to: to,
        subject: `邮箱验证码为:${content} 有效期5分钟`,
        html: `
        <p style="font-weight: bold">${content}</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>`,
      };
    } else if (type === "regisiter") {
      emailOptions = {
        from: "MaiXF.ADMIN 1374144742@qq.com",
        to: to,
        subject: `账号注册成功`,
        html: `
        <p style="font-weight: bold">${content}</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>`,
      };
    } else if (type === "callback") {
      emailOptions = {
        from: "MaiXF.ADMIN 1374144742@qq.com",
        to: to,
        subject: `来自MaiXF.ADMIN的消息回复`,
        html: `
        <p style="font-weight: bold">${content}</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>`,
      };
    } else if (type === "replyLetter") {
      emailOptions = {
        from: "MaiXF.ADMIN 1374144742@qq.com",
        to: to,
        subject: `来自MaiXF.ADMIN的私信回复`,
        html: `
        <p style="font-weight: bold">${content}</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>`,
      };
    }
    const res = transporter.sendMail(emailOptions, function (error, info) {
      if (!error) {
        resolve("邮件发送成功");
      } else {
        reject("邮件发送失败");
      }
    });
  });
};
