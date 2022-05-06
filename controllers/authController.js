const RegisteredCustomer = require('../models/RegisteredCustomer')
const { StatusCodes } = require('http-status-codes')

const registerCustomer = async (req, res, next) => {
    const {
        email,
        password,
        confirm_password,
        first_name,
        last_name,
        gender,
        contact_number,
        passport_number,
        address_line1,
        address_line2,
        country,
        province,
        city,
        birthday
    } = req.body
    try {
        // check if user exist
        const registeredCustomer = new RegisteredCustomer(
            email,
            password,
            first_name,
            last_name,
            gender,
            contact_number,
            passport_number,
            address_line1,
            address_line2,
            country,
            province,
            city,
            birthday
        )
        // validate
        await registeredCustomer.create()
        res.send({ msg: 'success' })
    } catch (error) {
        res.send({ msg: error.message })
    }
}

const loginCustomer = (req, res, next) => {
    res.status(StatusCodes.OK).render('login_register/login', { message: null })
}

const loginCustomerFailure = (req, res, next) => {
    res.status(401).render('login', { message: 'Invalid Credentials' })
}

module.exports = {
    registerCustomer,
    loginCustomer,
    loginCustomerFailure
}