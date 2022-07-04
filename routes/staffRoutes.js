const express = require('express')
const passport = require('passport')
const router = express.Router()
const staffAuth = require('../middleware/staffAuth')

const { 
    registerStaff,
    logoutStaff,
    loginStaff,
    loginStaffFailure
} = require('../controllers/staffController')


router.get('/register', function(req, res, next) {
    let msg = req.session.msg
    let user=req.user;
    delete req.session.msg
    res.render('login_register/staff_register', {title:'Register', msg:msg, user:user})
})

router.post('/register', registerStaff)



router.get('/login', loginStaff);
/* login */
router.post('/login', passport.authenticate('staff', {
    failureRedirect: '/staff/login-failure',
    successRedirect: '/'
}))

// TODO
router.get('/login-success', (req, res, next) => {
    res.json({ data: req.user, msg: 'login successfully' })
})

router.get('/login-failure', loginStaffFailure)


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