const express = require('express')
const router = express.Router()


router.get('/', function (req, res, next) {
    let user=false;
    res.render('schedule' , { title: 'Express' ,user:user});
})

module.exports = router;