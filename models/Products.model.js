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
 
Product.associate = (models) => {
        Product.belongsTo(models.CompanyInfo, { 
            foreignKey: 'company_name', 
            targetKey: 'company_name',
            as: 'companyInfo' 
        });
        Product.hasMany(models.Boxing, { foreignKey: 'product_id' });
        Product.hasMany(models.Harvest, { foreignKey: 'product_id' });
        Product.hasMany(models.FruitBagging, { foreignKey: 'product_id' });
        Product.hasMany(models.Fertilizing, { foreignKey: 'product_id' });
        Product.hasMany(models.Pesticide, { foreignKey: 'product_id' });
        Product.hasMany(models.Watering, { foreignKey: 'product_id' });
        Product.hasMany(models.Shipment, { foreignKey: 'product_id' });
        Product.hasMany(models.Deliver, { foreignKey: 'product_id' });
    };

module.exports = Product;