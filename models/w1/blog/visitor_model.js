const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let visitorModel = sequelize.define(
  "visitor_model",
  {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nickname: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: "用户昵称(登录之后显示用户昵称,未登录为visitor)",
    },
    platform: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: "操作平台",
    },
    userType: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      notNull: true,
      comment: "用户角色(0表示前台用户,1表示后台用户)",
    },
    count: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      notNull: true,
      comment: "访问次数",
      defaultValue: 1,
    },
    userIp: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: "IP地址",
    },
    loginLocation: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: "地址",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createAt、updateAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "用户访问信表",
    //用户今日今日时间
    createdAt: "createAt",
    //用户访问更新时间
    updatedAt: "updateAt",
  }
);
