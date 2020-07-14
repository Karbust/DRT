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


viagensRouter.post('/pedidosviagemmotorista',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.pedidosViagemMotorista
)
/*viagensRouter.post('/pedidosviagemdetalhes',
    authorize([Role.Administrador, Role.Motorista, Role.Utilizador]),
    viagensController.pedidosViagemDetalhes
)*/

viagensRouter.post('/historicoviagemcliente',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador, Role.Utilizador]),
    viagensController.historicoViagensUtilizador
)
viagensRouter.post('/historicoviagemmotorista',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.historicoViagensMotorista
)

viagensRouter.post('/pedidosviagemcliente',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador, Role.Utilizador]),
    viagensController.pedidosViagemCliente
)
viagensRouter.post('/verificardividacliente',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador, Role.Utilizador]),
    viagensController.verificarDividaCliente
)
viagensRouter.post('/atualizarestadoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.atualizarEstadoViagem
)
viagensRouter.post('/atualizarestadopagamentoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.atualizarEstadoPagamentoViagem
)
viagensRouter.post('/classificacaoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Utilizador]),
    viagensController.classificacaoViagem
)
viagensRouter.get('/classificacoesviagens',
    viagensController.classificacoesViagens
)

export { viagensRouter }
