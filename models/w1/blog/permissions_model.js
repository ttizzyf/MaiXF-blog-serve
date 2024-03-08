const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let permissionsModel = sequelize.define(
  "permissions_model",
  {
    permissionId: {
      type: Sequelize.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "权限ID",
    },
    key: {
      type: DataTypes.STRING,
      notNull: true,
      comment: "权限键",
    },
    parent_key: {
      type: DataTypes.STRING,
      comment: "父级权限键(可选)",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
    auth: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      comment: "是否按钮权限(0是否,1是)",
    },
    status: {
      type: DataTypes.BOOLEAN,
      notNull: true,
      defaultValue: 1,
      comment: "状态: 0删除 1展示",
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      notNull: true,
      defaultValue: 0,
      comment: "状态: 0正常 1禁用",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "权限模型",
  }
);

// (async () => {
//   await permissionsModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = permissionsModel;
