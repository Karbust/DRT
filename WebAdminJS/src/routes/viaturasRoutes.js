let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt'),
    Role = require('../middleware/jwt').Role

const viaturasController = require('../controllers/viaturasController')

router.get('/viaturas',
    middleware.checkToken,
    middleware.authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaViaturas
)
router.get('/modelos',
    middleware.checkToken,
    viaturasController.listaModelos
)
router.get('/marcas',
    middleware.checkToken,
    viaturasController.listaMarcas
)
router.get('/seguradoras',
    middleware.checkToken,
    viaturasController.listaSeguradoras
)
router.get('/cores',
    middleware.checkToken,
    viaturasController.listaCores
)

router.post('/adicionarviatura',
    middleware.checkToken,
    middleware.authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarViatura
)
router.post('/adicionarmarca',
    middleware.checkToken,
    middleware.authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarMarca
)
router.post('/adicionarmodelo',
    middleware.checkToken,
    middleware.authorize([middleware.Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarModelo
)
router.post('/adicionarcor',
    middleware.checkToken,
    middleware.authorize([middleware.Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarCor
)
router.post('/adicionarseguradora',
    middleware.checkToken,
    middleware.authorize([middleware.Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarSeguradora
)

module.exports = router
