import express from 'express'
import { authorize, Role } from '../middleware/jwt.js'

const estatisticasRouter = express.Router()

import { estatisticasController } from '../controllers/estatisticasController.js'

estatisticasRouter.get('/contador',
    authorize([
        Role.Administrador,
        Role.Administrativo,
        Role.AdministradorOperador,
        Role.Telefonista,
        Role.AdministrativoOperador
    ]),
    estatisticasController.contador
)
estatisticasRouter.get('/origemdestinodia/:localidade',
    authorize([
        Role.Administrador,
        Role.Administrativo,
        Role.AdministradorOperador,
        Role.Telefonista,
        Role.AdministrativoOperador
    ]),
    estatisticasController.origemDestinoDia
)
estatisticasRouter.get('/contadorviagensmotoristames/:motorista',
    authorize([
        Role.Administrador,
        Role.Administrativo,
        Role.AdministradorOperador,
        Role.Telefonista,
        Role.AdministrativoOperador,
        Role.Motorista
    ]),
    estatisticasController.contadorViagensMotoristaMes
)

export { estatisticasRouter }
