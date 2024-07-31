// models/productCompany.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Products.model'); // Đường dẫn đến mô hình Product
const CompanyInfo = require('./company_info.model'); 

const ProductCompany = sequelize.define('ProductCompany', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_code: {
    type: DataTypes.STRING,
    references: {
      model: Product,
      key: 'product_code'
    },
    allowNull: false
  },
    company_name: {
    type: DataTypes.INTEGER,
    references: {
      model: CompanyInfo ,
      key: 'id'
    },
    allowNull: false
  },
}, {
    tableName: 'ProductCompany',
    timestamps: false,
});

module.exports = ProductCompany;
