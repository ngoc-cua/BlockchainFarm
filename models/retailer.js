// models/Watering.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Retailer = sequelize.define('Retailer', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Image: {
    type: DataTypes.JSON,
    allowNull: true
  },
  product_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'product_code'
    }
  }
}, {
  tableName: 'retailer',
  timestamps: false,
});

module.exports = Retailer;
