const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Products.model');
const FertilizingName = require('./fertilizing_name');
const PesticideName = require('./pesticide_name');

const ProductFertilizingPesticide = sequelize.define('ProductFertilizingPesticide', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  product_code: {
    type: DataTypes.STRING,
    references: {
      model: Product,
      key: 'product_code'
    },
    allowNull: false
  },
  fertilizing_name: {
    type: DataTypes.INTEGER,
    references: {
      model: FertilizingName,
      key: 'id'
    },
    allowNull: false
  },
  pesticide_name: {
    type: DataTypes.INTEGER,
    references: {
      model: PesticideName,
      key: 'id'
    },
    allowNull: false
  }
}, {
  tableName: 'ProductFertilizingPesticide'
});
module.exports = ProductFertilizingPesticide;
