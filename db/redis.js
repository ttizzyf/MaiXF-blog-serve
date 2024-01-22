const { REDIS_CONF } = require("../config/index.js");
const redis = require("redis");
const chalk = require("chalk");

const redisClient = redis
  .createClient({
    url: "redis://120.55.46.157:6379",
  })
  .connect(() => {
    console.log(chalk.bold.green("----------REDIS连接成功------------"));
  })
  .catch((err) => {
    console.error(chalk.bold.red("----------REDIS连接出错------------", err));
  });

module.exports = redisClient;
