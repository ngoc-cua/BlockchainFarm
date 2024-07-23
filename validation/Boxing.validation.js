const Joi = require('joi');

const createBoxingSchema = Joi.object({
    notes: Joi.string().required().messages({
        'string.empty': 'Notes are required',
    }),
    delivery_code: Joi.string().required().messages({
        'string.empty': 'Product code is required',
    })
});
const updateBoxingSchema = Joi.object({
    notes: Joi.string().optional(),
    delivery_code: Joi.string().optional(),
    // Add other fields here
});

module.exports = {
    createBoxingSchema,
    updateBoxingSchema
};
