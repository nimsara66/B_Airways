const express = require('express')
const passport = require('passport')
const router = express.Router()
const { 
    registerCustomer,
    loginCustomer,
    loginCustomerFailure,
    logoutCustomer
} = require('../controllers/authController')

/* register */
router.get('/register', function(req, res, next) {
    let msg = req.session.msg
    let user=false;
    delete req.session.msg
    res.render('login_register/regCustomer_register', {title:'Register', msg:msg, user:user})
})
router.post('/register', registerCustomer)

/* login */
router.get('/login', loginCustomer);
router.post('/login', passport.authenticate('customer', {
    failureRedirect: '/auth/login-failure',
    successRedirect: '/auth/login-success'
}))

// TODO
router.get('/login-success', (req, res, next) => {
    res.json({ data: req.user, msg: 'login successfully' })
})

// router.get('/login-failure', loginCustomerFailure)
router.get('/login-failure', (req, res, next) => {
    res.json({ data: req.user, msg: 'login failure' })
})

/* logout */
router.get('/logout', logoutCustomer)

module.exports = router