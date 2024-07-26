const Joi = require('joi');

const confirmRetailerSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
    // Add other validations as required
});

module.exports = { confirmRetailerSchema };
