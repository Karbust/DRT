let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt')

const viagensController = require('../controllers/viagensController')

router.post('/testes', viagensController.testes);

module.exports = router;
