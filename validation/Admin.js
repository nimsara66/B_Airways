const Joi = require('joi')

const AdminSchema = Joi.object({
    email: Joi.string()
        .lowercase()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),

    confirm_password: Joi.ref('password'),
})

module.exports = AdminSchema