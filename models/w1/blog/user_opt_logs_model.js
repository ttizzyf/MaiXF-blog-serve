const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let userOptLogsModel = sequelize.define(
  "users_opt_logs",
  {
    actionId: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "操作ID",
    },
    operatorId: {
      type: DataTypes.STRING,
      comment: "操作人ID",
    },
    operator: {
      type: DataTypes.STRING,
      comment: "操作人",
    },
    module: {
      type: DataTypes.STRING,
      comment: "操作模块",
    },
    platform: {
      type: DataTypes.STRING,
      comment: "操作平台",
    },
    operatorIP: {
      type: DataTypes.STRING,
      comment: "设备IP",
    },
    address: {
      type: DataTypes.STRING,
      comment: "设备位置",
    },
    content: {
      type: DataTypes.STRING,
      comment: "操作内容",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "用户操作日志",
  }
);

module.exports = userOptLogsModel;
