const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyInfo = sequelize.define('company_info', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address: {
    type: DataTypes.STRING, // Adjust according to your schema
    allowNull: true
  },
  district_code: {
    type: DataTypes.STRING, // Adjust according to your schema
    allowNull: true
  },
  wards_code: {
    type: DataTypes.STRING, // Adjust according to your schema
    allowNull: true
  },
  provinces_code: {
    type: DataTypes.STRING, // Adjust according to your schema
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT, // Adjust according to your schema
    allowNull: true
  }
}, {
  tableName: 'company_info',
  timestamps: false  
});

module.exports = CompanyInfo;
