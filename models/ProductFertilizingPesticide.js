const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đường dẫn đến cấu hình sequelize
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
    }
  },
  fertilizing_name: {
    type: DataTypes.STRING,
    references: {
      model: FertilizingName,
      key: 'id'
    }
  },
  pesticide_name: {
    type: DataTypes.STRING,
    references: {
      model: PesticideName,
      key: 'id'
    }
  }
});

module.exports = ProductFertilizingPesticide;
