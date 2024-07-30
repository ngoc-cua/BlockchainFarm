
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pesticides_Name = sequelize.define('Pesticides_Name', {
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
  tableName: 'pesticides_name'
});

module.exports = Pesticides_Name;
