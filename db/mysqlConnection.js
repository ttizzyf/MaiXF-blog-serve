/**
 *@author MaiXF
 *@date 2023/12/4 22:20:17
 *@Description: 配置sequelize,Sequelize是一个基于 promise 的 Node.js ORM,
 */

const { Sequelize } = require("sequelize");
const chalk = require("chalk");
const { MYSQL_CONF } = require("../config/index.js");

console.log(
  chalk.bold.red(MYSQL_CONF.database, MYSQL_CONF.user, MYSQL_CONF.password)
);

// 第一个参数：连接的数据库名
// 第二个参数：数据库的用户名
// 第三个参数：数据库的密码
const mysql = new Sequelize(
  MYSQL_CONF.database,
  MYSQL_CONF.user,
  MYSQL_CONF.password,
  {
    host: MYSQL_CONF.host,
    dialect: MYSQL_CONF.dialect,
    timezone: "+08:00", //东八时区
  }
);

// 测试连接是否成功
(async () => {
  try {
    await mysql.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = mysql;
