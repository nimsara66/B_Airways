const express = require('express')
const router = express.Router()

const { 
    viewAircraftModels,
    insertAircraftmodel
} = require('../controllers/aircraftmodelController')

router.get('/',viewAircraftModels)
router.post('/', insertAircraftmodel)
module.exports = router;