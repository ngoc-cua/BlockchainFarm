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
const Retailer = require('../models/retailer');
const ProductFertilizingPesticide = require('../models/ProductFertilizingPesticide');
const Sequelize = require('sequelize');

async function getProduct(req, res) {
  try {
    const {query} = req.query;
    // if (!query) {
    //   return res.status(400).json({ error: 'Thiếu thông tin truy xuất. Vui lòng cung cấp tham số truy vấn.' });
    // }
    const product = await Product.findOne({
      where: {
        [Sequelize.Op.or]: [
          { product_code: query },
          { product_name: query }
        ]
      },
      attributes: ['Product_name', 'Image', 'Product_date', 'certify', 'Description', 'Expiry_date']
    });

    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const productCode = product.product_code;

    // Kiểm tra mã sản phẩm
    if (!productCode) {
      return res.status(500).json({ error: 'Mã sản phẩm không hợp lệ' });
    }

    const companyInfo = await Company_info.findOne({ where: { product_code: productCode }, attributes: ['Company_name', 'Address', 'Description'] });
    const boxing = await Boxing.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });
    const harvest = await Harvest.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });
    const fruitBagging = await Fruit_bagging.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });
    const fertilizing = await Fertilizing.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });
    const pesticide = await Pesticide.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });

    const productFP = await ProductFertilizingPesticide.findOne({ where: { product_code: productCode } });

    const fertilizingName = productFP && productFP.fertilizing_name
      ? await Fertilizing_name.findOne({ where: { id: productFP.fertilizing_name }, attributes: ['name', 'effect'] })
      : null;

    const pesticideName = productFP && productFP.pesticide_name
      ? await Pesticide_name.findOne({ where: { id: productFP.pesticide_name }, attributes: ['name', 'effect'] })
      : null;

    const watering = await Watering.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });
    const shipment = await Shipment.findOne({ where: { product_code: productCode }, attributes: ['shipment_date', 'Image', 'status'] });
    const retailer = await Retailer.findOne({ where: { product_code: productCode }, attributes: ['notes', 'Image'] });

    // Trả dữ liệu
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
      retailer
    });
  } catch (error) {
    console.error('Error searching product:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi truy xuất thông tin sản phẩm' });
  }
}

module.exports = { getProduct };
