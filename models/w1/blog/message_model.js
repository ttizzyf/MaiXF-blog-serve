const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");
// 留言模型
let messageModel = sequelize.define(
  "message_model",
  {
    messageId: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "留言内容ID",
    },
    messagePid: {
      type: DataTypes.UUID,
      comment: "父级ID",
    },
    userId: {
      type: DataTypes.UUID,
      notNull: true,
      comment: "本条消息用户id",
    },
    toUserId: {
      type: DataTypes.UUID,
      comment: "回复用户id",
    },
    relatedArticleId: {
      type: DataTypes.UUID,
      defaultValue: 0,
      comment: "是否为文章评论(如果是文章评论,值为文章ID,如果是留言,则为0)",
    },
    content: {
      type: DataTypes.TEXT,
      notNull: true,
      comment: "留言内容",
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      comment: "是否隐藏(0是隐藏,1是展示)",
      defaultValue: 1,
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

// (async () => {
//   await messageModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = messageModel;
