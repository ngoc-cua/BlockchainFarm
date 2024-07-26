const Joi = require('joi');

const confirmBoxingSchema = Joi.object({
    delivery_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmBoxingSchema
};
