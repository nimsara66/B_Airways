const express = require('express')
const path = require('path')
const router = express.Router()

const bookController = require("../controllers/bookController")


router.get('/', function (req, res, next) {
    res.redirect('/');
});

router.get('/:schedule_id', bookController.viewBook);
router.post('/:schedule_id', bookController.bookTickets);

module.exports = router;