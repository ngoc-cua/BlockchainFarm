const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Retailer = sequelize.define('Retailer', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  },
   confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'retailer',
  timestamps: false,
  modelName:'Retailer'
});

module.exports = Retailer;
