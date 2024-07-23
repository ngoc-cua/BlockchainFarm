// validation/wateringValidation.js
const Joi = require('joi');

const createHarvestSchema = Joi.object({
    notes: Joi.string().required().messages({
        'string.empty': 'Notes are required',
    }),
    product_code: Joi.string().required().messages({
        'string.empty': 'Product code is required',
    })
});

module.exports = {
    createHarvestSchema
};
