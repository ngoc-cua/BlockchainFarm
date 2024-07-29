// services/DetailProductServices.js
const { Product, CompanyInfo, Boxing, Harvest, FruitBagging, Fertilizing, Pesticide, FertilizingName, PesticideName, Watering, Shipment, Deliver } = require('../models/detailProduct');
const { Op } = require('sequelize');

 function getProductDetails(identifier) {
    try {
        const product =  Product.findOne({
            where: {
                [Op.or]: [
                    { product_code: identifier },
                    { name: identifier }
                ]
            },
            include: [
                {
                    model: CompanyInfo,
                    attributes: ['company_name', 'address', 'description']
                },
                {
                    model: Boxing,
                    attributes: ['notes', 'image']
                },
                {
                    model: Harvest,
                    attributes: ['notes', 'image']
                },
                {
                    model: FruitBagging,
                    attributes: ['notes', 'image']
                },
                {
                    model: Fertilizing,
                    attributes: ['notes', 'image'],
                    include: [{ model: FertilizingName, attributes: ['name', 'effect'] }]
                },
                {
                    model: Pesticide,
                    attributes: ['notes', 'image'],
                    include: [{ model: PesticideName, attributes: ['name', 'effect'] }]
                },
                {
                    model: Watering,
                    attributes: ['notes', 'image']
                },
                {
                    model: Shipment,
                    attributes: ['destination', 'status', 'shipment_code']
                },
                {
                    model: Deliver,
                    attributes: ['notes', 'image']
                }
            ]
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        throw error;
    }
}

module.exports = { getProductDetails };
