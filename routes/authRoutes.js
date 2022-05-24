const express = require('express')
const passport = require('passport')
const router = express.Router()
const { 
    registerCustomer,
    loginCustomer,
    loginCustomerSuccess,
    loginCustomerFailure,
    logoutCustomer
} = require('../controllers/authController')

/* register */
router.get('/register', function(req, res, next) {
    let msg = req.session.msg
    let user=req.user;
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

router.get('/login-success', loginCustomerSuccess)

router.get('/login-failure', loginCustomerFailure)

/* logout */
router.get('/logout', logoutCustomer)

module.exports = router