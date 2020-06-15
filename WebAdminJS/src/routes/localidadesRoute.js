let express = require('express'),
  router = express.Router(),
  middleware = require('../middleware/jwt');

//importar os controladores
const localidadesController = require('../controllers/localidadesController')
router.get('/list', /*middleware.checkToken,*/ localidadesController.list);

module.exports = router;
