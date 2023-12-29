const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let blogArticleModel = sequelize.define(
  "blog_article",
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: "博文id",
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
      type: DataTypes.STRING,
      comment: "博文摘要",
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "博文内容",
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "作者",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
    category: {
      type: DataTypes.STRING,
      comment: "分类",
    },
    viewNum: {
      type: DataTypes.INTEGER(11),
      comment: "浏览量",
    },
    likeNum: {
      type: DataTypes.INTEGER(11),
      comment: "点赞量",
    },
    isReship: {
      type: DataTypes.STRING,
      comment: "是否转载",
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
      type: DataTypes.TINYINT,
      comment: "是否精选(0是精选,1不是精选)",
    },
    likeToken: {
      type: DataTypes.TINYINT,
      comment: "点赞的临时标识(0是点赞,1是未点赞)",
    },
    status: {
      type: DataTypes.TINYINT,
      comment: "状态发布和草稿(0是发布,1是草稿)",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createAt、updateAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "博客文章列表",
    //创建时间字段别名或不展示
    createdAt: "createAt",
    //更新时间字段别名或不展示
    updatedAt: "updateAt",
  }
);

module.exports = blogArticleModel;
