const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize instance

const Ward = sequelize.define('ward', {
  code: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name_en: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  full_name: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  full_name_en: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  code_name: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  district_code: {
    type: DataTypes.STRING(20),
    allowNull: true // Modify as per your schema if needed
  },
  administrative_unit_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Modify as per your schema if needed
  }
}, {
  tableName: 'wards',
  timestamps: false
});

module.exports = Ward;
