const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../middleware/auth')
const { registerGuest } = require('../controllers/homeController')

router.get('/', function (req, res, next) {
    let user=false;
    console.log(req.user);
    res.render('index', { title: 'Express', user:user });
})

/* guest signup */
router.post('/register', registerGuest, passport.authenticate('guest', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success'
}))

// TODO
router.get('/login-success', (req, res, next) => {
    res.json({ data: req.user, msg: 'login successfully' })
})

router.get('/login-failure', (req, res, next) => {
    res.json({ data: req.user, msg: 'login failure' })
})

router.get('/protected', auth, function (req, res, next) {
    res.json({ data: 'entered customer protected' })
})

router.get('/test', (req, res, next) => {
    res.json({ data: req.user, msg: 'check cookie' })
})

module.exports = router