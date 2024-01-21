const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");
// 回复模型
let replyModel = sequelize.define(
  "reply_model",
  {
    replyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "本条回复ID",
    },
    replyMessageId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "父级留言ID",
    },
    toUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "回复目标用户ID",
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "本条回复用户ID",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "回复内容",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "用户回复表",
  }
);

module.exports = replyModel;
