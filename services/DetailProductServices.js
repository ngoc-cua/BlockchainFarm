const { Product } = require('../models/Products.model');
const { CompanyInfo } = require('../models/company_info.model');
const { Boxing } = require('../models/boxing');
const { Harvest } = require('../models/harvest');
const { FruitBagging } = require('../models/fruit_bagging');
const { Fertilizing } = require('../models/fertilizing');
const { Pesticide } = require('../models/pesticide');
const { FertilizingName } = require('../models/fertilizing_name');
const { PesticideName } = require('../models/pesticide_name');
const { Watering } = require('../models/watering');
const { Shipment } = require('../models/shipment');
const { Deliver } = require('../models/deliver');
const { Op } = require('sequelize');

async function getProductDetails(req, res) {
    try {
        const { query } = req.query;

        // Tìm thông tin sản phẩm bằng mã sản phẩm hoặc tên sản phẩm
        const product = await Product.findOne({
            where: {
                [Op.or]: [
                    { product_code: query },
                    { name: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        // Xử lý khi không tìm thấy sản phẩm
        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy thông tin sản phẩm' });
        }

        // Tìm thông tin liên quan từ các bảng khác dựa trên product_id
        const companyInfo = await CompanyInfo.findOne({ where: { id: product.company_id } }) || null;
        const boxing = await Boxing.findAll({ where: { product_id: product.id } }) || null;
        const harvest = await Harvest.findAll({ where: { product_id: product.id } }) || null;
        const fruitBagging = await FruitBagging.findAll({ where: { product_id: product.id } }) || null;
        const fertilizing = await Fertilizing.findAll({
            where: { product_id: product.id },
            include: [{ model: FertilizingName, attributes: ['name', 'effect'] }]
        }) || null;
        const pesticide = await Pesticide.findAll({
            where: { product_id: product.id },
            include: [{ model: PesticideName, attributes: ['name', 'effect'] }]
        }) || null;
        const watering = await Watering.findAll({ where: { product_id: product.id } }) || null;
        const shipment = await Shipment.findAll({ where: { product_id: product.id } }) || null;
        const deliver = await Deliver.findAll({ where: { product_id: product.id } }) || null;

        // Trả về dữ liệu
        return res.status(200).json({
            product: {
                product_code: product.product_code,
                name: product.name,
                image: product.image,
                product_date: product.product_date,
                certify: product.certify,
                description: product.description,
                expiry_date: product.expiry_date
            },
            companyInfo,
            boxing,
            harvest,
            fruitBagging,
            fertilizing,
            pesticide,
            watering,
            shipment,
            deliver
        });
    } catch (error) {
        console.error('Error searching product:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm thông tin sản phẩm' });
    }
}

module.exports = { getProductDetails };
