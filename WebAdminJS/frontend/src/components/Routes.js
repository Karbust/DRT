import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import DashboardView from '../views_dashboard/DashboardView'
import { Role } from './functions'
import RegistarViagem from '../views_dashboard/RegistarViagem'
import PedidosViagem from '../views_dashboard/PedidosViagem'
import HistoricoViagens from '../views_dashboard/HistoricoViagens'
import ClassificacoesViagens from '../views_dashboard/ClassificacoesViagens'
import RegistarUtilizador from '../views_dashboard/RegistarUtilizador'
import ListaClientes from '../views_dashboard/ListaClientes'
import ValidarRegistos from '../views_dashboard/ValidarRegistos'
import RegistosNaoValidados from '../views_dashboard/RegistosNaoValidados'
import ListaAdministradores from '../views_dashboard/ListaAdministradores'
import ListaAdministrativos from '../views_dashboard/ListaAdministrativos'
import ListaAdministradoresOperador from '../views_dashboard/ListaAdministradoresOperador'
import ListaTelefonistas from '../views_dashboard/ListaTelefonistas'
import ListaMotoristas from '../views_dashboard/ListaMotoristas'
import ListaAdministrativosOperador from '../views_dashboard/ListaAdministrativosOperador'
import RegistarViatura from '../views_dashboard/RegistarViatura'
import ListaViaturas from '../views_dashboard/ListaViaturas'
import ListaDividas from '../views_dashboard/ListaDividas'

export const Routes = () => {
    const { path } = useRouteMatch()

    const RegistoUtilizador = (tipoUser, tipoUserString, linkPagina) => (
        <RegistarUtilizador tipoUser={tipoUser} tipoUserString={tipoUserString} linkPagina={linkPagina}/>
    )

    return (
        <Switch>
            <PrivateRoute exact path={path} component={DashboardView} />

            <PrivateRoute exact path={`${path}/Viagens`} component={DashboardView} />
            <PrivateRoute exact path={`${path}/Viagens/RegistarViagem`} roles={[Role.Administrador, Role.AdministradorOperador, Role.Telefonista]} component={RegistarViagem} />
            <PrivateRoute exact path={`${path}/Viagens/PedidosViagem`} roles={[Role.Administrador, Role.AdministradorOperador, Role.Telefonista]} component={PedidosViagem} />
            <PrivateRoute exact path={`${path}/Viagens/HistoricoViagens`} roles={[Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador]} component={HistoricoViagens} />
            <PrivateRoute exact path={`${path}/Viagens/ClassificacoesViagens`} roles={[Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador]} component={ClassificacoesViagens} />
            <PrivateRoute exact path={`${path}/Viagens/ListaDividas`} roles={[Role.Administrador, Role.Administrativo]} component={ListaDividas} />
            <PrivateRoute path={`${path}/Viagens/*`} component={DashboardView} />

            <PrivateRoute exact path={`${path}/Clientes`} component={DashboardView} />
            <PrivateRoute exact path={`${path}/Clientes/RegistarCliente`} roles={[Role.Administrador, Role.Administrativo]} render={() => (
                RegistoUtilizador(7, 'Cliente', 'Clientes/RegistarCliente')
            )} />
            <PrivateRoute exact path={`${path}/Clientes/ListarClientes`} roles={[Role.Administrador, Role.Administrativo]} component={ListaClientes} />
            <PrivateRoute exact path={`${path}/Clientes/ValidarRegistoCliente`} roles={[Role.Administrador, Role.Administrativo]} component={ValidarRegistos} />
            <PrivateRoute exact path={`${path}/Clientes/RegistosNaoValidados`} roles={[Role.Administrador, Role.Administrativo]} component={RegistosNaoValidados} />
            <PrivateRoute path={`${path}/Clientes/*`} component={DashboardView} />

            <PrivateRoute exact path={`${path}/Administracao`} component={DashboardView} />
            <PrivateRoute exact path={`${path}/Administracao/RegistarAdministrador`} roles={[Role.Administrador]} render={() => (
                RegistoUtilizador(1, 'Administrador', 'Administracao/RegistarAdministrador')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarAdministradores`} roles={[Role.Administrador]} component={ListaAdministradores} />

            <PrivateRoute exact path={`${path}/Administracao/RegistarAdministrativo`} roles={[Role.Administrador]} render={() => (
                RegistoUtilizador(2, 'Administrativo', 'Administracao/RegistarAdministrativo')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarAdministrativos`} roles={[Role.Administrador]} component={ListaAdministrativos} />

            <PrivateRoute exact path={`${path}/Administracao/RegistarAdministradorOperador`} roles={[Role.Administrador]} render={() => (
                RegistoUtilizador(3, 'Administrador Operador', 'Administracao/RegistarAdministradorOperador')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarAdministradoresOperador`} roles={[Role.Administrador]} component={ListaAdministradoresOperador} />

            <PrivateRoute exact path={`${path}/Administracao/RegistarTelefonista`} roles={[Role.Administrador, Role.AdministradorOperador]} render={() => (
                RegistoUtilizador(4, 'Telefonista', 'Administracao/RegistarTelefonista')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarTelefonistas`} roles={[Role.Administrador, Role.AdministradorOperador]} component={ListaTelefonistas} />

            <PrivateRoute exact path={`${path}/Administracao/RegistarMotorista`} roles={[Role.Administrador, Role.AdministradorOperador]} render={() => (
                RegistoUtilizador(5, 'Motorista', 'Administracao/RegistarMotorista')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarMotoristas`} roles={[Role.Administrador, Role.AdministradorOperador]} component={ListaMotoristas} />

            <PrivateRoute exact path={`${path}/Administracao/RegistarAdministrativoOperador`} roles={[Role.Administrador, Role.AdministradorOperador]} render={() => (
                RegistoUtilizador(6, 'Administrativo Operador', 'Administracao/RegistarAdministrativoOperador')
            )} />
            <PrivateRoute exact path={`${path}/Administracao/ListarAdministrativosOperador`} roles={[Role.Administrador, Role.AdministradorOperador]} component={ListaAdministrativosOperador} />

            <PrivateRoute path={`${path}/Administracao/*`} component={DashboardView} />

            <PrivateRoute exact path={`${path}/Viaturas`} component={DashboardView} />
            <PrivateRoute exact path={`${path}/Viaturas/RegistarViatura`} roles={[Role.Administrador, Role.AdministradorOperador]} component={RegistarViatura} />
            <PrivateRoute exact path={`${path}/Viaturas/ListaViaturas`} roles={[Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador]} component={ListaViaturas} />
            <PrivateRoute exact path={`${path}/Viaturas/*`} component={DashboardView} />
        </Switch>
    )
}
