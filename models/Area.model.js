const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  User_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Area_type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING(299),
    allowNull: false
  },
  Address: {
    type: DataTypes.STRING(299),
    allowNull: false
  },
  Image: {
    type: DataTypes.JSON
  },
  description: {
    type: DataTypes.TEXT
  },
  Area_status: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'area',
  timestamps: false
});

module.exports = Area;
