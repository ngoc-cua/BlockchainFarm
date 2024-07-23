const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserInfo = sequelize.define('user_info', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'user_info',
  timestamps: false  
});

module.exports = UserInfo;
