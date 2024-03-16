const { REDIS_CONF } = require("../config/index.js");
const redis = require("redis");
const chalk = require("chalk");

const redisClient = redis
  .createClient({
    url: `redis://${REDIS_CONF.host}:${REDIS_CONF.port}`,
  })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

module.exports = redisClient;
