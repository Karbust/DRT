let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt')

const viagensController = require('../controllers/viagensController')

router.post('/historicoviagens', middleware.checkToken, viagensController.historicoViagens);
router.post('/registopedidoviagem', middleware.checkToken, viagensController.registoPedidoViagem);
router.get('/pedidosviagem', middleware.checkToken, viagensController.pedidoViagem);
router.post('/classificacaoviagem', middleware.checkToken, viagensController.classificacaoViagem);

module.exports = router;
