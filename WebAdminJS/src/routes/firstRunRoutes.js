let express = require('express'),
    router = express.Router()

const firstRunController = require('../controllers/firstRunController')

router.get('/', firstRunController.firstRun)

module.exports = router
