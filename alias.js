const moduleAlias = require("module-alias");
const path = require("path");

/**
 * alias.js
 *
 *@author MaiXF
 *@date 2023/11/30
 *@Description:路径别名配置
 */

moduleAlias.addAliases({
  "@middlewares": path.join(__dirname, "middlewares"),
  "@models": path.join(__dirname, "models"),
  "@routes": path.join(__dirname, "routes"),
  "@db": path.join(__dirname, "db"),
  "@controllers": path.join(__dirname, "controllers"),
  "@config": path.join(__dirname, "config"),
  "@utils": path.join(__dirname, "utils"),
  "@scheduler": path.join(__dirname, "scheduler"),
});
