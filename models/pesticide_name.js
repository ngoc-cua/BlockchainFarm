
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pesticide_Name = sequelize.define('Pesticide_Name', {
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
  tableName: 'pesticide_name'
});

module.exports = Pesticide_Name;
