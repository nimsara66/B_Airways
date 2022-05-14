const Admin = require('../models/Admin')
const AdminSchema = require('../validation/Admin')
const { BadRequestError } = require('../errors/index')

const registerAdmin = async (req, res, next) => {
    try {
        // validate
        const { email, password } = await AdminSchema.validateAsync(req.body)

        // check if admin exist
        const [ admins, _ ] = await Admin.findByEmail(email)
        if (admins.length>0) {
            throw new BadRequestError('Admin already exists')
        }

        const admin = new Admin(email, password)
        await admin.create()
        // TODO
        res.send({ msg: 'success' })
    } catch (error) {
        if (error.isJoi) {
            error = new BadRequestError('please provide valid values')
        }
        next(error)
    }
}

const logoutAdmin = (req, res, next) => {
    req.logout();
    res.redirect('/')
}

module.exports = {
    registerAdmin,
    logoutAdmin
}