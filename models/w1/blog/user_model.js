const sequelize = require("../../../db/mysqlConnection.js");
const { Sequelize, DataTypes } = require("sequelize");

let userModel = sequelize.define(
  "user_info",
  {
    userId: {
      type: Sequelize.UUID,
      notNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "用户ID",
    },
    roleId: {
      type: Sequelize.UUID,
      notNull: true,
      comment: "用户角色",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "用户头像",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "用户密码",
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "用户昵称",
    },
    email: {
      type: DataTypes.STRING,
      comment: "用户邮箱",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
    status: {
      type: DataTypes.TINYINT,
      comment: "用户状态(0禁用,1启用)",
    },
    userType: {
      type: DataTypes.STRING,
      defaultValue: "user",
      comment: "用户角色(user表示前台用户,admin表示后台用户)",
    },
    website: {
      type: DataTypes.STRING,
      comment: "用户站点",
    },
    platform: {
      type: DataTypes.STRING,
      comment: "操作平台",
    },
    userIp: {
      type: DataTypes.STRING,
      comment: "用户IP",
    },
    address: {
      type: DataTypes.STRING,
      comment: "设备位置",
    },
  },
  {
    // 启动时间，设置为ture会自动生成创建和更新时间，默认字段名称为createdAt、updatedAt。
    timestamps: true,
    //对应的表名将与model名相同
    freezeTableName: true,
    //表备注
    comment: "用户信息表",
  }
);

// (async () => {
//   await userModel.sync({ force: true });
//   // 这里是代码
// })();

module.exports = userModel;
