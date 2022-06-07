const express = require('express')
const router = express.Router()

const scheduleController = require('../controllers/scheduleController')


router.get('/', function (req, res, next) {
    let user=req.user;
    res.render('schedule' , { title: 'Express' ,user:user});
})


router.get('/create/:route_id', scheduleController.getCreate);
router.post('/create/:route_id', scheduleController.create);


module.exports = router;