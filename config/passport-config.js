const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const RegisteredCustomer = require('../models/RegisteredCustomer')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

function SessionConstructor(userId, userGroup) {
	this.userId = userId
	this.userGroup = userGroup
}

const customFields = {
	usernameField: 'email',
	passwordField: 'password'
}

const verifyCallbackCustomer = async (username, password, done) => {
	try {
		let [user, _] = await RegisteredCustomer.findByEmail(username)
		if (user.length === 0) return done(null, false, {
			msg: 'Customer already exists'
		})
		user = user[0]

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return done(null, false)
		return done(null, user)
	} catch (error) {
		return done(error)
	}
}

const verifyCallbackAdmin = async (username, password, done) => {
	try {
		let [user, _] = await Admin.findByEmail(username)
		if (user.length === 0) return done(null, false)
		user = user[0]

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return done(null, false)
		return done(null, user)
	} catch (error) {
		return done(error)
	}
}

passport.use('customer', new LocalStrategy(customFields, verifyCallbackCustomer))
passport.use('admin', new LocalStrategy(customFields, verifyCallbackAdmin))

passport.serializeUser(function (user, done) {
	if (user.customer_id !== undefined) {
		return done(null, new SessionConstructor(user.customer_id, 'registered_customer'))
	} else if (user.admin_id !== undefined) {
		return done(null, new SessionConstructor(user.admin_id, 'admin'))
	}
	return done(new Error('Invalid user type'))
})

passport.deserializeUser(async (sessionConstructor, done) => {
	try {
		if (sessionConstructor.userGroup == 'registered_customer') {
			let [customer, _] = await RegisteredCustomer.findById(sessionConstructor.userId)
			customer = customer[0]
			delete customer['password']
			customer.user_type = sessionConstructor.userGroup
			return done(null, customer)
		} else if (sessionConstructor.userGroup == 'admin') {
			let [admin, _] = await Admin.findById(sessionConstructor.userId)
			admin = admin[0]
			delete admin['password']
			admin.user_type = sessionConstructor.userGroup
			return done(null, admin)
		}
		return done(error)
	} catch (error) {
		return done(error)
	}
})

module.exports = passport