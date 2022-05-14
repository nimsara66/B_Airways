const Joi = require('joi')

const GuestCustomerSchema = Joi.object({
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

    // TODO
    birthday: Joi.string()
        .allow(''),

    email: Joi.string()
        .lowercase()
        .email()
        .required()
})

module.exports = GuestCustomerSchema