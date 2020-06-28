import express from 'express'
import { checkToken, authorize, Role } from '../middleware/jwt.js'

const viagensRouter = express.Router()

import { viagensController } from '../controllers/viagensController.js'

viagensRouter.get('/historicoviagens',
    checkToken,
    authorize([Role.Administrador, Role.AdministradorOperador]),
    viagensController.historicoViagens
)
viagensRouter.post('/registopedidoviagem',
    checkToken, authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.registoPedidoViagem
)
viagensRouter.get('/pedidosviagem',
    checkToken, authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.pedidoViagem
)
viagensRouter.post('/editarviagem',
    checkToken, authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.editarViagem
)

// TODO: ROTAS ANDROID - CLASSIFICAÇÃO VIAGEM - VIAGENS ROUTES
viagensRouter.post('/classificacaoviagem', checkToken, viagensController.classificacaoViagem)
viagensRouter.get('/classificacoesviagens', checkToken, viagensController.classificacoesViagens)

export { viagensRouter }
