const express = require('express')
const passport = require('passport')
const router = express.Router()

const { 
    registerAdmin
} = require('../controllers/adminController')

router.post('/register', registerAdmin)

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

module.exports = router