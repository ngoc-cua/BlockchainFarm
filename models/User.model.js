const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserInfo = require('./user_info.model');
const CompanyInfo = require('./company_info.model');
const Role = require('./role.model');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verification_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_info_id: {
    type: DataTypes.INTEGER,
    references: {
      model: UserInfo,
      key: 'id'
    }
  },
  company_info_id: {
    type: DataTypes.INTEGER,
    references: {
      model: CompanyInfo,
      key: 'id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
}
}, {
  tableName: 'user',
  timestamps: false  
});

User.belongsTo(UserInfo, { foreignKey: 'user_info_id' });
User.belongsTo(CompanyInfo, { foreignKey: 'company_info_id' });

module.exports = User;
