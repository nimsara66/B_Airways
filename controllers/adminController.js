const Admin = require('../models/Admin')
const { StatusCodes } = require('http-status-codes')

const registerAdmin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        // check if user exist
        const admin = new Admin(email, password)
        // validate
        await admin.create()
        res.send({ msg: 'success' })
    } catch (error) {
        res.send({ msg: error.message })
    }
}

module.exports = {
    registerAdmin
}