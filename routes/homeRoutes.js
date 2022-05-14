const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { registerGuest } = require('../controllers/homeController')

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
})

/* guest signup */
router.post('/register', registerGuest)

router.get('/protected', auth, function (req, res, next) {
    res.json({ data: 'entered customer protected' })
})

module.exports = router