/**
 *@author MaiXF
 *@date 2023/12/4 17:28:34
 *@Description: 配置swaggerui
 */
const path = require("path");

const options = {
  swaggerDefinition: {
    info: {
      title: "W-NODE-MYSQL-API",
      version: "1.0.0",
      description: `基于Express + mysql编写的基本API骨架。`,
    },
    host: `${process.env.SWA_HOST}:${process.env.SWA_PORT}`,
    basePath: "/",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "authorization",
        description: "token",
      },
    },
  },
  route: {
    url: "/swagger", //打开swagger文档页面地址
    docs: "/swagger.json", //swagger文件 api
  },
  basedir: __dirname, //app absolute path
  files: [
    //在那个文件夹下面收集注释
    "../routes/**/**/*.js",
  ],
};

module.exports = options;
