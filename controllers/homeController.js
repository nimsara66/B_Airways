const GuestCustomer = require('../models/GuestCustomer')
// const { BadRequestError } = require('../errors/bad-request')

const registerGuest = async (req, res, next) => {
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
    } = req.body
    try {
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
        // validate
        const [ result, _ ] = await guestCustomer.create()
        console.log(result)
        if (result.affectedRows) {
            req.body = {
                email: email,
                password: "password" // passport require this to be non empty
            }
            next()
        } else {
            // throw new BadRequestError('Invalid Inputs')
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { 
    registerGuest
}