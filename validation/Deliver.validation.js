const Joi = require('joi');

const confirmDeliverSchema = Joi.object({
    delivery_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmDeliverSchema
};
