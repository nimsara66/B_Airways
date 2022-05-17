const Joi = require('joi')

const RegisteredCustomerSchema = Joi.object({
    first_name: Joi.string()
        .required(),

    last_name: Joi.string()
        .required(),

    gender: Joi.any()
        .valid('male', 'female')
        .required(),
    
    contact_number: Joi.string()
        .pattern(/^[0-9]*$/)
        .allow(''),

    passport_number: Joi.string()
        .alphanum()
        .allow(''),

    address_line1: Joi.string()
        .allow(''),

    address_line2: Joi.string()
        .allow(''),

    country: Joi.string()
        .allow(''),

    province: Joi.string()
        .allow(''),

    city: Joi.string()
        .allow(''),

    password: Joi.string()
        .min(6)
        .required(),

    confirm_password: Joi.ref('password'),

    // TODO
    birthday: Joi.string()
        .allow(''),

    email: Joi.string()
        .lowercase()
        .email()
        .required()
})

module.exports = RegisteredCustomerSchema