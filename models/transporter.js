const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Đường dẫn tới file cấu hình database

const Transporter = sequelize.define('Transporter', {
  transporter_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Transporters',
  timestamps: false,
});

module.exports = Transporter;
