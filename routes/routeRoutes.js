const express = require('express')
const passport = require('passport')
const router = express.Router()
const routeController = require('../controllers/routeController')

router.get('/', routeController.get_all_routes)


module.exports = router