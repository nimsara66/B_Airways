const Staff = require('../models/Staff')

const registerStaff = async (req, res, next) => {
    const {
        email,
        password,
        confirm_password,
        category,
        first_name,
        last_name,
        gender,
        contact_number,
        birthday,
        country,
        assigned_airport,
        state
    } = req.body

    try {
        // check if user exist
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
        
        // validate
        await staff.create()
        res.send({ msg: 'success' })
    } catch (error) {
        res.send({ msg: error.message })
    }
}

module.exports = {
    registerStaff
}