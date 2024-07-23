
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fertilizing_Name = sequelize.define('Fertilizing_Name', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Hữu cơ', 'Hóa học'),
    allowNull: false
  },
  origin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  effect: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'fertilizing_name'
});

module.exports = Fertilizing_Name;
