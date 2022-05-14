const RegisteredCustomer = require('../models/RegisteredCustomer')
const RegisteredCustomerSchema = require('../validation/RegisteredCustomer')
const { BadRequestError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')

const registerCustomer = async (req, res, next) => {
    try {
        // validate
        const {
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
        } = await RegisteredCustomerSchema.validateAsync(req.body)

        // check if user exist
        const [ customers, _ ] = await RegisteredCustomer.findByEmail(email)
        if (customers.length>0) {
            throw new BadRequestError('Customer already exists')
        }

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
        await registeredCustomer.create()
        // TODO
        res.send({ msg: 'success' })
    } catch (error) {
        if (error.isJoi) {
            error = new BadRequestError('please provide valid values')
        }
        next(error)
    }
}

const loginCustomer = (req, res, next) => {
    let user=false;
    res.status(StatusCodes.OK).render('login_register/login', { message: null, user:user })
}

const loginCustomerFailure = (req, res, next) => {
    res.status(401).render('login', { message: 'Invalid Credentials' })
}

const logoutCustomer = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

module.exports = {
    registerCustomer,
    loginCustomer,
    loginCustomerFailure,
    logoutCustomer
}