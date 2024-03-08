const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");
const userModel = require("./user_model.js");

let rolesModel = sequelize.define(
  "roles_model",
  {
    roleId: {
      type: Sequelize.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "角色ID",
    },
    roleAuth: {
      type: DataTypes.STRING,
      notNull: true,
      comment: "角色标识",
    },
    roleName: {
      type: DataTypes.STRING,
      notNull: true,
      comment: "角色名称",
    },
    perms: {
      type: DataTypes.TEXT,
      comment: "权限列表",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
    status: {
      type: DataTypes.BOOLEAN,
      comment: "是否隐藏(0是禁用,1是正常)",
      defaultValue: 1,
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "角色模型",
  }
);
// 用户与角色是1对1的关系
rolesModel.hasOne(userModel, {
  foreignKey: "roleId",
  as: "roleInfo",
});
// 用户与角色是1对1的关系
userModel.belongsTo(rolesModel, {
  foreignKey: "roleId",
  as: "roleInfo",
});

// (async () => {
//   await rolesModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = rolesModel;
