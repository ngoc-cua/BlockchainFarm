const Product = require('../models/Products.model');
const Company_info = require('../models/company_info.model');
const Boxing = require('../models/boxing');
const Harvest = require('../models/harvest');
const Fruit_bagging = require('../models/fruit_bagging');
const Fertilizing = require('../models/fertilizing');
const Pesticide = require('../models/pesticide');
const Fertilizing_name = require('../models/fertilizing_name');
const Pesticide_name = require('../models/pesticide_name');
const Watering = require('../models/watering');
const Shipment = require('../models/shipment');
const Deliver = require('../models/deliver');
const Sequelize = require('sequelize');

// Controller function to handle search request by product code or name
async function getProduct(req, res) {
  try {
    const { query } = req.query;

    // Find product by product_code or product_name
    const product = await Product.findOne({
      where: {
        [Sequelize.Op.or]: [
          { product_code: query },
          { product_name: query }
        ]
      },
      attributes: ['product_name', 'image', 'product_date', 'certify', 'description', 'expiry_date', 'product_code']
    });

    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const productCode = product.product_code;
    console.log('Product code:', productCode); // Log the product_code for debugging

    // Check if productCode is defined
    if (!productCode) {
      return res.status(500).json({ error: 'product_code is undefined' });
    }

    // Find related information from other tables based on product_code
    const companyInfo = await Company_info.findOne({ where: { product_code: productCode }, attributes: ['company_name', 'address', 'description'] });
    const boxing = await Boxing.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const harvest = await Harvest.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const fruitBagging = await Fruit_bagging.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const fertilizing = await Fertilizing.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const pesticide = await Pesticide.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const fertilizingName = await Fertilizing_name.findOne({ where: { product_code: productCode }, attributes: ['name', 'effect'] });
    const pesticideName = await Pesticide_name.findOne({ where: { product_code: productCode }, attributes: ['name', 'effect'] });
    const watering = await Watering.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });
    const shipment = await Shipment.findOne({ where: { product_code: productCode }, attributes: ['destination', 'status', 'shipment_code'] });
    const deliver = await Deliver.findOne({ where: { product_code: productCode }, attributes: ['notes', 'image'] });

    // Return the data
    return res.status(200).json({
      product,
      companyInfo,
      boxing,
      harvest,
      fruitBagging,
      fertilizing,
      pesticide,
      fertilizingName,
      pesticideName,
      watering,
      shipment,
      deliver
    });
  } catch (error) {
    console.error('Error searching product:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm thông tin sản phẩm' });
  }
}

module.exports = { getProduct };
