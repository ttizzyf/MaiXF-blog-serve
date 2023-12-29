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

(async () => {
  try {
    // 第一次运行要同步数据库，若没有这个数据库则新建，有则检查表结构与model是否一致，使用sync()当不一致时不作任何更改，不存在破坏性
    // await Book.sync();
    await userOptLogs.save();
    console.log("保存成功");
  } catch (error) {
    console.log("操作失败！\n" + error);
  }
})();
