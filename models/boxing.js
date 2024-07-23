// models/Watering.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boxing = sequelize.define('Boxing', {
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
  delivery_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Shipments',
      key: 'delivery_code'
    }
  }
}, {
  tableName: 'boxing',
  timestamps: false,
});

module.exports = Boxing;
