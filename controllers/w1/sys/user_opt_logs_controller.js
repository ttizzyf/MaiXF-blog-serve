const userOptLogsModel = require("@models/w1/blog/user_opt_logs_model.js");
const userOptLogs = userOptLogsModel.build({
  operatorId: 123456,
  operator: "老八",
  module: "登录",
  platform: "web",
  operatorIP: "127.0.0.1",
  address: "四川省成都市",
  content: "123456456789",
});
