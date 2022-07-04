const express = require('express')
const passport = require('passport')
const router = express.Router()
const staffauth= require('../middleware/staffAuth')
const routeController = require('../controllers/routeController')

router.get('/',staffauth, routeController.get_all_routes)


module.exports = router