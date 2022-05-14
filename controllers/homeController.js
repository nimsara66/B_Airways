const GuestCustomer = require('../models/GuestCustomer')
const { StatusCodes } = require('http-status-codes')

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
        await guestCustomer.create()
        res.send({ msg: 'success' })
    } catch (error) {
        res.send({ msg: error.message })
    }
}

module.exports = { 
    registerGuest
}