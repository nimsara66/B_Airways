const express = require('express')
const router = express.Router()

const { 
    viewAircraftModels
} = require('../controllers/aircraftmodelController')

router.get('/',viewAircraftModels)

module.exports = router;