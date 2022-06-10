const express = require('express')
const router = express.Router()

const scheduleController = require('../controllers/scheduleController')




router.get('/', scheduleController.home);

router.get('/create/:route_id', scheduleController.getCreate);
router.post('/create/:route_id', scheduleController.create);


module.exports = router;