const express = require('express')
const router = express.Router()

const { 
    home
} = require('../controllers/scheduleController')

router.get('/',home)

module.exports = router;