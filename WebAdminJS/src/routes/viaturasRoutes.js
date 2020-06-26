import express from 'express'
import { authorize, Role} from '../middleware/jwt.js'

const viaturasRouter = express.Router()

import { viaturasController } from '../controllers/viaturasController.js'

viaturasRouter.get('/viaturas',
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaViaturas
)
viaturasRouter.get('/modelos',
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaModelos
)
viaturasRouter.get('/marcas',
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaMarcas
)
viaturasRouter.get('/seguradoras',
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaSeguradoras
)
viaturasRouter.get('/cores',
    authorize([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]),
    viaturasController.listaCores
)

viaturasRouter.post('/adicionarviatura',
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarViatura
)
viaturasRouter.post('/adicionarmarca',
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarMarca
)
viaturasRouter.post('/adicionarmodelo',
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarModelo
)
viaturasRouter.post('/adicionarcor',
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarCor
)
viaturasRouter.post('/adicionarseguradora',
    authorize([Role.Administrador,Role.AdministradorOperador]),
    viaturasController.adicionarSeguradora
)

export { viaturasRouter }
