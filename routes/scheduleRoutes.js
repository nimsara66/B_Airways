const express = require('express')
const router = express.Router()
const staffauth= require('../middleware/staffAuth')

const scheduleController = require('../controllers/scheduleController')




router.get('/', scheduleController.home);

router.get('/create/:route_id',staffauth, scheduleController.getCreate);
router.post('/create/:route_id',staffauth, scheduleController.create);


module.exports = router;