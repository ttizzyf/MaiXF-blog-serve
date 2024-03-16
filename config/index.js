/**
 *@author MaiXF
 *@date 2023/12/3 16:18:34
 *@Description: 配置mysql和redis环境配置
 */

const env = process.env.NODE_ENV; // 环境参数

console.log(process.env.NODE_ENV);

let MYSQL_CONF;
let REDIS_CONF;

// 测试环境
if (env === "development") {
  MYSQL_CONF = {
    host: "x",
    user: "x",
    password: "x",
    port: "x",
    database: "x",
    dialect: "x",
  };
  REDIS_CONF = {
    port: 1,
    host: "x",
    password: "x",
  };
}

// 测试生产环境
if (env === "production") {
  MYSQL_CONF = {
    host: "x",
    user: "x",
    password: "x",
    port: "x",
    database: "x",
    dialect: "x",
  };
  REDIS_CONF = {
    port: 1,
    host: "x",
    password: "x",
  };
}

// 导出环境变量
module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
