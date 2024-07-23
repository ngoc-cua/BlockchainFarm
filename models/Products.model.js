const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path based on your project structure

class Product extends Model {}

Product.init({
 Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Descripion: DataTypes.STRING,
  Image: DataTypes.JSON,
  product_code: {
    type: DataTypes.STRING,
   primaryKey: true// Make it unique instead of primary key
  },
  Expiry_date: DataTypes.INTEGER,
  Unit: DataTypes.INTEGER,
  Product_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  certify: DataTypes.JSON,
  Product_date: DataTypes.DATE,
  Product_type: DataTypes.INTEGER,
  Product_packing: DataTypes.INTEGER
}, { sequelize, modelName: 'Product',tableName:'products', timestamps: false });

module.exports = Product;