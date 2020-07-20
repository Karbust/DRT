import express from 'express'
import { authorize, Role } from '../middleware/jwt.js'

const viagensRouter = express.Router()

import { viagensController } from '../controllers/viagensController.js'

viagensRouter.get('/historicoviagens',
    authorize([Role.Administrador, Role.Administrativo, Role.AdministradorOperador, Role.AdministrativoOperador]),
    viagensController.historicoViagens
)
viagensRouter.post('/registopedidoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Telefonista, Role.Utilizador]),
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
viagensRouter.get('/listadividas',
    authorize([Role.Administrador, Role.Administrativo]),
    viagensController.listaDividas
)
viagensRouter.post('/atualizarestadoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.atualizarEstadoViagem
)
viagensRouter.post('/atualizarestadoviagemcancelada',
    authorize([Role.Administrador, Role.Administrativo, Role.Utilizador]),
    viagensController.atualizarEstadoViagemCancelada
)
viagensRouter.post('/atualizarestadopagamentoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.atualizarEstadoPagamentoViagem
)
viagensRouter.post('/atualizarestadoclienteviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Motorista, Role.AdministrativoOperador]),
    viagensController.atualizarEstadoClienteViagem
)
viagensRouter.get('/classificacoes',
    authorize([Role.Administrador, Role.Administrativo, Role.AdministradorOperador, Role.AdministrativoOperador]),
    viagensController.classificacoes
)
viagensRouter.post('/classificacaoviagem',
    authorize([Role.Administrador, Role.AdministradorOperador, Role.Utilizador]),
    viagensController.classificacaoViagem
)
viagensRouter.post('/classificacoesviagensmotorista',
    authorize([Role.Administrador, Role.Motorista]),
    viagensController.classificacoesViagemMotorista
)
viagensRouter.post('/classificacoesviagenscliente',
    authorize([Role.Administrador, Role.Utilizador]),
    viagensController.classificacoesViagensCliente
)

export { viagensRouter }
