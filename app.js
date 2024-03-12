// 路径别名
require("./alias.js");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const scheduler = require("./scheduler");
const isDev = process.env.NODE_ENV === "development";
const sessionAuth = require("./middlewares/sessionMiddleware");
const redisClient = require("./db/redis.js");
const RedisStore = require("connect-redis").default;
const sequelize = require("sequelize");
// 响应api工具函数
const apiResponse = require("./utils/apiResponse.js");
// 可以指定目录,进行解析分配路由,每一层路由就是
const mount = require("mount-routes");
// 错误处理模型
// const errorHandler = require("./utils/errorHandler.js");
const errorHandler = require("./utils/errorHandler");

// 访问不同的 .env 文件
require("dotenv").config({
  path: isDev ? "./.env.development" : "./.env.production",
});
// 引入之后可以捕获到异步的错误
require("express-async-errors");
// mysql 数据库连接
require("./db/mysqlConnection.js");

const app = express();

// session全局中间件配置
const options = require("./config/swagger.config.js"); // 配置信息
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(options);

app.use(sessionAuth);

// 处理post参数解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 解决跨域
app.use(cors());

// 设置跨域和设置允许的请求的头部信息
app.all("/w1/*", function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, token");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === "OPTIONS") res.send(200);
  /*让options请求快速返回*/ else next();
});

if (isDev) {
  console.log(chalk.bold.yellow("当前是开发环境"));
  app.use(logger("dev"));
} else {
  console.log(chalk.bold.yellow("当前是生产环境"));
}

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionStore = new RedisStore({
  client: redisClient,
});

// 监听SIGINT信号，当应用程序被强制关闭时停止所有定时任务
process.on("SIGINT", (signal) => {
  scheduler.stop();
  process.exit();
});

// 带路径的用法并且可以打印出路由表 true代表展示路由表在打印台
mount(app, "./routes", isDev);

// 添加全局错误处理中间件
app.use(errorHandler);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "404 --- 接口不存在");
});

app.listen(process.env.PORT, () => {
  /* 开启定时任务 */
  // scheduler.start();
  console.log(
    chalk.bold.green(`项目启动成功: ${process.env.URL}:${process.env.PORT}/w1`),
    chalk.bold.green(
      `swagger地址: ${process.env.URL}:${process.env.SWA_PORT}/swagger`
    )
  );
});

module.exports = app;
