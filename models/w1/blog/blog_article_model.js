const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");
const userModel = require("./user_model.js");

let blogArticleModel = sequelize.define(
  "blog_article",
  {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      comment: "博文id",
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "博文标题",
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "博文封面",
    },
    abstract: {
      type: DataTypes.TEXT,
      comment: "博文摘要",
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "博文内容",
    },
    userId: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      references: {
        model: userModel,
        key: "userId",
      },
      comment: "作者",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
    category: {
      type: DataTypes.BOOLEAN,
      comment: "分类(1是技术,2是生活,3是其他)",
    },
    viewNum: {
      type: DataTypes.INTEGER(11),
      comment: "浏览量",
      defaultValue: 0,
    },
    likeNum: {
      type: DataTypes.INTEGER(11),
      comment: "点赞量",
      defaultValue: 0,
    },
    isReship: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      comment: "是否转载(1是转载2是原创)",
    },
    isReshipUrl: {
      type: DataTypes.STRING,
      comment: "转载文章地址(url)",
    },
    isReshipName: {
      type: DataTypes.STRING,
      comment: "转载文章名称(转载后的名字)",
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      comment: "是否精选(0是不精选,1是精选)",
      defaultValue: 0,
    },
    likeToken: {
      type: DataTypes.BOOLEAN,
      comment: "点赞的临时标识(0是未点赞,1是点赞)",
      defaultValue: 0,
    },
    status: {
      type: DataTypes.BOOLEAN,
      comment: "状态发布和草稿(0是删除,1是发布,2是草稿)",
      defaultValue: 2,
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "博客文章列表",
  }
);

// (async () => {
//   await blogArticleModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = blogArticleModel;
