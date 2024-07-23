const Joi = require('joi');

// Define Joi validation schema for creating an area
const createAreaSchema = Joi.object({
    Name: Joi.string().required(),
    Area_type: Joi.number().integer().required(),
    Address: Joi.string().required(),
    Description: Joi.string().allow('').optional(),
    Area_status: Joi.number().integer().default(1),
    // Image validation handled separately during image upload
});



module.exports = {
    createAreaSchema,
};