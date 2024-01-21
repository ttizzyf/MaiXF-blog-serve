const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");
// 留言模型
let messageModel = sequelize.define(
  "message_model",
  {
    messageId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "留言内容ID",
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "留言用户id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "留言内容",
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      comment: "是否隐藏(0是隐藏,1是展示)",
      defaultValue: 1,
    },
    relatedArticleId: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
      comment: "是否为文章评论(如果是文章评论,值为文章ID,如果是留言,则为0)",
    },
    likeNum: {
      type: DataTypes.INTEGER(6),
      defaultValue: 0,
      comment: "留言点赞量",
    },
    opposeNum: {
      type: DataTypes.INTEGER(6),
      defaultValue: 0,
      comment: "留言反对量",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "用户留言表",
  }
);

module.exports = messageModel;
