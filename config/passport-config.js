const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const RegisteredCustomer = require('../models/RegisteredCustomer')
const bcrypt = require('bcryptjs')

const customFields = {
	usernameField: 'email',
	passwordField: 'password'
}

const verifyCallback = async (username, password, done) => {
	try {
		let [user, _] = await RegisteredCustomer.findByEmail(username)
		if (user.length === 0) return done(null, false, {
			msg: 'Customer already exists'
		})
		user = user[0]

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return done(null, false, {
			msg: 'Invalid Credentials'
		})

		return done(null, user)
	} catch (error) {
		return done(error)
	}
}

passport.use(new LocalStrategy(customFields, verifyCallback))

passport.serializeUser(function (user, done) {
	done(null, user.customer_id);
});
passport.deserializeUser(async (customer_id, done) => {
	try {
		let [customer, _] = await RegisteredCustomer.findById(customer_id)
		customer = customer[0]
		delete customer['password']
		customer.customer_type = 'registered_customer'
		return done(null, customer)
	} catch (error) {
		return done(error)
	}
});

module.exports = passport;