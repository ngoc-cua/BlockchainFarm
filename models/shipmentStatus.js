const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Đường dẫn tới file cấu hình database

const ShipmentStatus = sequelize.define('ShipmentStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  status_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Shipment_Status',
  timestamps: false,
  modelName: 'ShipmentStatus'
});

module.exports = ShipmentStatus;
