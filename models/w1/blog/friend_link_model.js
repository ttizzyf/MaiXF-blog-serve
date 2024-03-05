const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let friendLinkModel = sequelize.define(
  "friend_link_model",
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
      comment: "友链邮箱",
    },
    linkName: {
      type: DataTypes.STRING,
      notEmpty: true,
      comment: "友链名称",
    },
    link: {
      type: DataTypes.STRING,
      notEmpty: true,
      comment: "友链地址",
    },
    describe: {
      type: DataTypes.TEXT,
      notEmpty: true,
      comment: "友链描述",
    },
    isShow: {
      type: DataTypes.BOOLEAN,
      notEmpty: true,
      defaultValue: 0,
      comment: "是否展示(0是未展示,1是展示)",
    },
    status: {
      type: DataTypes.BOOLEAN,
      notEmpty: true,
      defaultValue: 1,
      comment: "是否删除(0是删除,1是正常)",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    // freezeTableName: true,
    tableName: "friend_link_model",
    //表备注
    comment: "友链信息表",
  }
);

// (async () => {
//   await friendLinkModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = friendLinkModel;
