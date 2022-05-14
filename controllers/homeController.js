const GuestCustomer = require('../models/GuestCustomer')
const { BadRequestError } = require('../errors/bad-request')
const { GuestCustomerSchema } = require('../validation/index')

const registerGuest = async (req, res, next) => {
    try {
        // validate
        const {
            email,
            first_name,
            last_name,
            gender,
            contact_number,
            passport_number,
            address_line1,
            address_line2,
            birthday
        } = await GuestCustomerSchema.validateAsync(req.body)

        const guestCustomer = new GuestCustomer(
            email,
            first_name,
            last_name,
            gender,
            contact_number,
            passport_number,
            address_line1,
            address_line2,
            birthday
        )
        
        await guestCustomer.create()
        req.body = {
            email: email,
            password: "password" // passport require this to be non empty
        }
        next()
    } catch (error) {
        if (error.isJoi) {
            error = new BadRequestError('please provide valid values')
        }
        next(error)
    }
}

module.exports = { 
    registerGuest
}