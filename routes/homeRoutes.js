const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
})

router.get('/protected', auth, function (req, res, next) {
    res.json({ data: 'entered customer protected' })
})

module.exports = router;