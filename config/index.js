/**
 *@author MaiXF
 *@date 2023/12/3 16:18:34
 *@Description: 配置mysql和redis环境配置
 */

const env = process.env.NODE_ENV; // 环境参数

console.log(env);

let MYSQL_CONF;
let REDIS_CONF;

// 测试环境
if (env === "development") {
  MYSQL_CONF = {
    host: "120.55.46.157",
    user: "root",
    password: "w18880460748#",
    port: "3306",
    database: "W_BLOG",
    dialect: "mysql",
  };
  REDIS_CONF = {
    port: 6379,
    host: "120.55.46.157",
    password: "MaiXF",
  };
}

// 测试生产环境
if (env === "production") {
  MYSQL_CONF = {
    host: "120.55.46.157",
    user: "root",
    password: "w18880460748#",
    port: "3306",
    database: "W_BLOG",
    dialect: "mysql",
  };
  REDIS_CONF = {
    port: 6379,
    host: "120.55.46.157",
    password: "MaiXF",
  };
}

// 导出环境变量
module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
