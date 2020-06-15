let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt')

const apiController = require('../controllers/apiController')
router.get('/localidades', /*middleware.checkToken,*/ apiController.localidades)
router.get('/nacionalidades', /*middleware.checkToken,*/ apiController.nacionalidades)

module.exports = router;
