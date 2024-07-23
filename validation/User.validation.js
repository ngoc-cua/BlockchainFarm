const Joi = require('joi');

class Validator {
  static get RegisterSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      company_name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
      re_password: Joi.string().required().valid(Joi.ref('password')),
      role_id: Joi.number().integer().min(1).max(3).required()
    });
  }

  static get VerifySchema() {
    return Joi.object({
      // email: Joi.string().email().required(),
      code: Joi.string().length(6).required()
    });
  }

  static get ResendVerificationSchema() {
    return Joi.object({
      email: Joi.string().email().required()
    });
  }

  static get LoginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
  }

  static get ChangePasswordSchema() {
    return Joi.object({
      old_password: Joi.string().min(6).required(),
      new_password: Joi.string().min(6).required(),
      re_new_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
        'any.only': 'New passwords do not match'
      })
    });
  }
  
  static get UpdateUserInfoSchema() {
    return Joi.object({
      phone: Joi.number().integer().optional(),
      email: Joi.string().email().optional()
    }).or('phone', 'email');
  }

  static validate(schema, data) {
    return schema.validate(data);
  }

  static validate(schema, data) {
    return schema.validate(data);
  }
}

module.exports = Validator;
