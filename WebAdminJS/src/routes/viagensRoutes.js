import express from 'express'
import { authorize, Role } from '../middleware/jwt.js'

const viagensRouter = express.Router()

import { viagensController } from '../controllers/viagensController.js'

viagensRouter.get('/historicoviagens',
    authorize([Role.Administrador, Role.AdministradorOperador]),
    viagensController.historicoViagens
)
viagensRouter.post('/registopedidoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.registoPedidoViagem
)
viagensRouter.get('/pedidosviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.pedidoViagem
)
viagensRouter.post('/editarviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista]),
    viagensController.editarViagem
)

// TODO: ROTAS ANDROID - CLASSIFICAÇÃO VIAGEM - VIAGENS ROUTES
viagensRouter.post('/classificacaoviagem', viagensController.classificacaoViagem)
viagensRouter.get('/classificacoesviagens', viagensController.classificacoesViagens)

export { viagensRouter }
