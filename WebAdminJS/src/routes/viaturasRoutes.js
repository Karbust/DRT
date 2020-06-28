import express from 'express'
import { checkToken, authorize, Role} from '../middleware/jwt.js'

const viaturasRouter = express.Router()

import { viaturasController } from '../controllers/viaturasController.js'

viaturasRouter.get('/viaturas',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaViaturas
)
viaturasRouter.get('/modelos',
    checkToken,
    viaturasController.listaModelos
)
viaturasRouter.get('/marcas',
    checkToken,
    viaturasController.listaMarcas
)
viaturasRouter.get('/seguradoras',
    checkToken,
    viaturasController.listaSeguradoras
)
viaturasRouter.get('/cores',
    checkToken,
    viaturasController.listaCores
)

viaturasRouter.post('/adicionarviatura',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarViatura
)
viaturasRouter.post('/adicionarmarca',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarMarca
)
viaturasRouter.post('/adicionarmodelo',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarModelo
)
viaturasRouter.post('/adicionarcor',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarCor
)
viaturasRouter.post('/adicionarseguradora',
    checkToken,
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarSeguradora
)

export { viaturasRouter }
