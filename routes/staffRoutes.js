const express = require('express')
const passport = require('passport')
const router = express.Router()
const staffAuth = require('../middleware/staffAuth')

const { 
    registerStaff,
    logoutStaff
} = require('../controllers/staffController')

router.post('/register', registerStaff)

/* login */
router.post('/login', passport.authenticate('staff', {
    failureRedirect: '/staff/login-failure',
    successRedirect: '/staff/login-success'
}))

// TODO
router.get('/login-success', (req, res, next) => {
    res.json({ data: req.user, msg: 'login successfully' })
})

router.get('/login-failure', (req, res, next) => {
    res.json({ data: req.user, msg: 'login failure' })
})

/* logout */
router.get('/logout', logoutStaff)

/* staff protected */
router.get('/protected', staffAuth, (req, res, next) => {
    res.json({ data: 'entered staff protected' })
})

router.get('/edit_airplanes', function (req, res, next) {
    let user=req.user;
    res.render('staff/edit_airplanes' , { title: 'Express' ,user:user});
})


module.exports = router