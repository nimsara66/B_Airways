const express = require('express')
const router = express.Router()

const { 
    home
} = require('../controllers/aircraftmodelController')

router.get('/',home)

module.exports = router;