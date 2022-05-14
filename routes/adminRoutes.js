const express = require('express')
const passport = require('passport')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')

const { 
    registerAdmin,
    logoutAdmin
} = require('../controllers/adminController')

router.post('/register', registerAdmin)

/* login */
router.post('/login', passport.authenticate('admin', {
    failureRedirect: '/admin/login-failure',
    successRedirect: '/admin/login-success'
}))

// TODO
router.get('/login-success', (req, res, next) => {
    res.json({ data: req.user, msg: 'login successfully' })
})

router.get('/login-failure', (req, res, next) => {
    res.json({ data: req.user, msg: 'login failure' })
})

/* logout */
router.get('/logout', logoutAdmin)

/* admin protected */
router.get('/protected', adminAuth, (req, res, next) => {
    res.json({ data: 'entered admin protected' })
})

module.exports = router