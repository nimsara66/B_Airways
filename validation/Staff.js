const Joi = require('joi')

const StaffSchema = Joi.object({
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

    country: Joi.string()
        .allow(''),

    state: Joi.string()
        .allow(''),

    // TODO
    assigned_airport: Joi.string()
        .allow(''),
    
    // TODO 
    category: Joi.string()
        .allow(''),
    
    // TODO
    birthday: Joi.string()
        .allow(''),

    password: Joi.string()
        .min(6)
        .required(),

    confirm_password: Joi.ref('password'),

    email: Joi.string()
        .lowercase()
        .email()
        .required()
})

module.exports = StaffSchema