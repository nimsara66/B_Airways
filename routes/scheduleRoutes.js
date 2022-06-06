const express = require('express')
const router = express.Router()

const { 
    home
} = require('../controllers/scheduleController')


router.get('/', function (req, res, next) {
    let user=req.user;
    res.render('schedule' , { title: 'Express' ,user:user});
})


module.exports = router;