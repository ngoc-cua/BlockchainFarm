const Joi = require('joi');

// Define Joi validation schema for creating a product
const createProductSchema = Joi.object({
    Name: Joi.string().required(),
    Descripion: Joi.string().required(),
    Expiry_date: Joi.number().integer().required(),
    Unit: Joi.number().integer().required(),
    Product_status: Joi.number().integer().default(1), // Assuming certify is a JSON object
    Product_type: Joi.number().integer().required(),
    Product_packing: Joi.number().integer().required()
    // Image validation will be handled separately during image upload
});

module.exports = {
    createProductSchema,
};
