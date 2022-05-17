const Staff = require('../models/Staff')
const StaffSchema = require('../validation/Staff')
const { BadRequestError } = require('../errors/index')

const registerStaff = async (req, res, next) => {
    try {
        // validate
        const {
            email,
            password,
            category,
            first_name,
            last_name,
            gender,
            contact_number,
            birthday,
            country,
            assigned_airport,
            state
        } = await StaffSchema.validateAsync(req.body)
        
        // check if employee exist
        const [ employees, _ ] = await Staff.findByEmail(email)
        if (employees.length>0) {
            throw new BadRequestError('Employee already exists')
        }

        const staff = new Staff(
            email,
            password,
            category,
            first_name,
            last_name,
            gender,
            contact_number,
            birthday,
            country,
            assigned_airport,
            state
        )
        await staff.create()
        // TODO
        res.send({ msg: 'success' })
    } catch (error) {
        if (error.isJoi) {
            error = new BadRequestError('please provide valid values')
        }
        next(error)
    }
}

const logoutStaff = (req, res, next) => {
    req.logout();
    res.redirect('/')
}

module.exports = {
    registerStaff,
    logoutStaff
}