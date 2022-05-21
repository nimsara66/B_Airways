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
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.gender,
            req.body.contact_number,
            req.body.passport_number,
            req.body.address_line1,
            req.body.address_line2,
            req.body.birthday
        )
        
        await guestCustomer.create()
        req.session.schedule_id = req.body.schedule_id
        req.body = {
            email: req.body.email,
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

const logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

const loginSuccess = (req,res,next) => {
    let schedule_id = req.session.schedule_id;
    delete schedule_id;
    res.redirect(`/book/${schedule_id}`);
}

module.exports = { 
    registerGuest,
    logout,
    loginSuccess
}