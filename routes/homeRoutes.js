const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../middleware/auth')
const { registerGuest } = require('../controllers/homeController')

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
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

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

router.get('/protected', auth, function (req, res, next) {
    res.json({ data: 'entered customer protected' })
})

router.get('/test', (req, res, next) => {
    res.json({ data: req.user, msg: 'check cookie' })
})

module.exports = router