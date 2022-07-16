const Staff = require('../models/Staff')
const StaffSchema = require('../validation/Staff')
const { BadRequestError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')

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
      state,
    } = await StaffSchema.validateAsync(req.body)

    // const {
    //     email,
    //     password,
    //     category,
    //     first_name,
    //     last_name,
    //     gender,
    //     contact_number,
    //     birthday,
    //     country,
    //     assigned_airport,
    //     state
    // } = req.body

    // check if employee exist
    const [employees, _] = await Staff.findByEmail(email)
    if (employees.length > 0) {
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

    // res.send({ msg: 'success' })
    res.redirect('/staff/login')
  } catch (error) {
    if (error.isJoi) {
      // error = new BadRequestError('please provide valid values')
      res.redirect('/staff/register')
      return
    }
    next(error)
  }
}

const loginStaff = (req, res, next) => {
  req.logout()
  res
    .status(StatusCodes.OK)
    .render('login_register/staff_login', { message: null, user: req.user })
}

const loginStaffFailure = (req, res, next) => {
  res
    .status(401)
    .render('login_register/staff_login', {
      message: 'Invalid Credentials',
      user: req.user,
    })
}

const logoutStaff = (req, res, next) => {
  req.logout()
  res.redirect('/')
}

module.exports = {
  registerStaff,
  logoutStaff,
  loginStaff,
  loginStaffFailure,
}
