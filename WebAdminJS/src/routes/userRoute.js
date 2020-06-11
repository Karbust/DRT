let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt');

//importar os controladores
const userController = require('../controllers/utilizadoresController')
router.get('/list', middleware.checkToken, userController.list);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verifylogin', userController.verifylogin);
router.post('/testes', userController.testes);

module.exports = router;
