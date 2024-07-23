const Joi = require('joi');

const createShipmentSchema = Joi.object({
    product_code: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    status: Joi.number().integer().required(),
});

const updateShipmentSchema = Joi.object({
    product_code: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).optional(),
    status: Joi.number().integer().optional(),
});

module.exports = {
    createShipmentSchema,
    updateShipmentSchema
};
