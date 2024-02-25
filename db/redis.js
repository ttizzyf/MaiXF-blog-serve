const { REDIS_CONF } = require("../config/index.js");
const redis = require("redis");
const chalk = require("chalk");

const redisClient = redis
  .createClient({
    url: `redis://${REDIS_CONF.host}:${REDIS_CONF.port}`,
  })
  .connect(() => {
    console.log(chalk.bold.green("----------REDIS连接成功------------"));
  })
  .catch((err) => {
    console.error(chalk.bold.red("----------REDIS连接出错------------", err));
  });

module.exports = redisClient;
