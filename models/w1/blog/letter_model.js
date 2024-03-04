const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let letterModel = sequelize.define(
  "letter_model",
  {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      notEmpty: true,
      comment: "邮箱",
    },
    content: {
      type: DataTypes.TEXT,
      notEmpty: true,
      comment: "私信内容",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      notEmpty: true,
      defaultValue: 0,
      comment: "是否阅读(0是未读,1是已读)",
    },
    replyContent: {
      type: DataTypes.TEXT,
      comment: "私信回复内容",
    },
    isReply: {
      type: DataTypes.BOOLEAN,
      notEmpty: true,
      defaultValue: 0,
      comment: "是否回复(0是未回复,1是已回复)",
    },
    status: {
      type: DataTypes.BOOLEAN,
      notEmpty: true,
      defaultValue: 1,
      comment: "状态发布和草稿(0是删除,1是正常)",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    // freezeTableName: true,
    tableName: "letter_model",
    //表备注
    comment: "用户私信信息表",
  }
);

module.exports = letterModel;
