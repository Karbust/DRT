import React, { useState } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import {
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Hidden,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import './css/all.min.css'
import Logo from './imagens/logo_muv.svg'
import { useStyles } from './components/MuiStyles'
import { Role } from './components/functions'
import { Routes } from './components/Routes'

export default function Dashboard() {
    const theme = useTheme()
    const [openNestedViagens, setOpenNestedViagens] = useState(false)
    const [openNestedViaturas, setOpenNestedViaturas] = useState(false)
    const [openNestedUsers, setOpenNestedUsers] = useState(false)
    const [openNestedSeccaoAdministracao, setOpenNestedSeccaoAdministracao] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const currentUser = JSON.parse(localStorage.getItem('user'))

    const classes = useStyles()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleClickViagens = () => {
        setOpenNestedViagens(!openNestedViagens)
    }
    const handleClickViaturas = () => {
        setOpenNestedViaturas(!openNestedViaturas)
    }
    const handleClickUsers = () => {
        setOpenNestedUsers(!openNestedUsers)
    }
    const handleClickSeccaoAdministracao = () => {
        setOpenNestedSeccaoAdministracao(!openNestedSeccaoAdministracao)
    }

    const { url } = useRouteMatch()

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                <ListItem
                    button
                    key="Dashboard"
                    component={NavLink}
                    to={`${url}`}
                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                    exact
                >
                    <ListItemIcon><i className="fa fa-location-arrow fa-lg" /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                {
                    ([Role.Administrador, Role.AdministradorOperador, Role.Telefonista, Role.AdministrativoOperador].includes(currentUser.tipoUser))
                    && (
                        <>
                            <ListItem button onClick={handleClickViagens}>
                                <ListItemIcon>
                                    <i className="fad fa-map fa-lg" />
                                </ListItemIcon>
                                <ListItemText primary="Viagens" />
                                {openNestedViagens
                                    ? <i className="fas fa-chevron-up" />
                                    : <i className="fas fa-chevron-down" />}
                            </ListItem>
                            <Collapse in={openNestedViagens} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        ([Role.Administrador, Role.AdministradorOperador, Role.Telefonista].includes(currentUser.tipoUser))
                                        && (
                                            <ListItem
                                                button
                                                key="Registar Viagem"
                                                component={NavLink}
                                                style={{ paddingLeft: theme.spacing(4) }}
                                                to={`${url}/Viagens/RegistarViagem`}
                                                activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact
                                            >
                                                <ListItemIcon><i className="far fa-map fa-lg" /></ListItemIcon>
                                                <ListItemText primary="Registar Viagem" />
                                            </ListItem>
                                        )
                                    }
                                    {
                                        ([Role.Administrador, Role.AdministradorOperador, Role.Telefonista].includes(currentUser.tipoUser))
                                        && (
                                            <ListItem
                                                button
                                                key="Pedidos de Viagem"
                                                component={NavLink}
                                                style={{ paddingLeft: theme.spacing(4) }}
                                                to={`${url}/Viagens/PedidosViagem`}
                                                activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact
                                            >
                                                <ListItemIcon><i className="fas fa-map fa-lg" /></ListItemIcon>
                                                <ListItemText primary="Pedidos Viagem" />
                                            </ListItem>
                                        )
                                    }
                                    {
                                        ([Role.Administrador, Role.Administrativo, Role.AdministradorOperador, Role.AdministrativoOperador].includes(currentUser.tipoUser))
                                        && (
                                            <>
                                                <ListItem
                                                    button
                                                    key="Histórico Viagens"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Viagens/HistoricoViagens`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="far fa-history fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Histórico Viagens" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Classificações Viagens"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Viagens/ClassificacoesViagens`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fas fa-star fa-lg"/></ListItemIcon>
                                                    <ListItemText primary="Classificações Viagens" />
                                                </ListItem>
                                            </>
                                        )
                                    }
                                    {
                                        ([Role.Administrador, Role.Administrativo].includes(currentUser.tipoUser))
                                        && (
                                            <>
                                                <ListItem
                                                    button
                                                    key="Lista de Dívidas"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Viagens/ListaDividas`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="far fa-euro-sign fa-lg"/></ListItemIcon>
                                                    <ListItemText primary="Lista de Dívidas" />
                                                </ListItem>
                                            </>
                                        )
                                    }
                                </List>
                            </Collapse>
                        </>
                    )
                }

                {
                    ([Role.Administrador, Role.Administrativo].includes(currentUser.tipoUser))
                    && (
                        <>
                            <ListItem button onClick={handleClickUsers}>
                                <ListItemIcon>
                                    <i className="fa fa-users fa-lg" />
                                </ListItemIcon>
                                <ListItemText primary="Clientes" />
                                {openNestedUsers
                                    ? <i className="fas fa-chevron-up" />
                                    : <i className="fas fa-chevron-down" />}
                            </ListItem>
                            <Collapse in={openNestedUsers} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem
                                        button
                                        key="Registar Cliente"
                                        component={NavLink}
                                        style={{ paddingLeft: theme.spacing(4) }}
                                        to={`${url}/Clientes/RegistarCliente`}
                                        activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                        exact
                                    >
                                        <ListItemIcon><i className="fa fa-user-plus fa-lg" /></ListItemIcon>
                                        <ListItemText primary="Registar Cliente" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        key="Listar Clientes"
                                        component={NavLink}
                                        style={{ paddingLeft: theme.spacing(4) }}
                                        to={`${url}/Clientes/ListarClientes`}
                                        activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                        exact
                                    >
                                        <ListItemIcon><i className="fa fa-users fa-lg" /></ListItemIcon>
                                        <ListItemText primary="Listar Clientes" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        key="Validar Registo Cliente"
                                        component={NavLink}
                                        style={{ paddingLeft: theme.spacing(4) }}
                                        to={`${url}/Clientes/ValidarRegistoCliente`}
                                        activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                        exact
                                    >
                                        <ListItemIcon><i className="fa fa-user-check fa-lg" /></ListItemIcon>
                                        <ListItemText primary="Validar Registo Cliente" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        key="Registos Não Validados"
                                        component={NavLink}
                                        style={{ paddingLeft: theme.spacing(4) }}
                                        to={`${url}/Clientes/RegistosNaoValidados`}
                                        activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                        exact
                                    >
                                        <ListItemIcon><i className="fa fa-user-times fa-lg" /></ListItemIcon>
                                        <ListItemText primary="Registos Não Validados" />
                                    </ListItem>
                                </List>
                            </Collapse>
                        </>
                    )
                }
                {
                    ([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador].includes(currentUser.tipoUser))
                    && (
                        <>
                            <ListItem button onClick={handleClickViaturas}>
                                <ListItemIcon>
                                    <i className="fa fa-cars fa-lg" />
                                </ListItemIcon>
                                <ListItemText primary="Viaturas" />
                                {openNestedViaturas
                                    ? <i className="fas fa-chevron-up" />
                                    : <i className="fas fa-chevron-down" />}
                            </ListItem>
                            <Collapse in={openNestedViaturas} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        ([Role.Administrador, Role.AdministradorOperador].includes(currentUser.tipoUser))
                                        && (
                                            <ListItem
                                                button
                                                key="Registar Viatura"
                                                component={NavLink}
                                                style={{ paddingLeft: theme.spacing(4) }}
                                                to={`${url}/Viaturas/RegistarViatura`}
                                                activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact
                                            >
                                                <ListItemIcon><i className="fa fa-car fa-lg" /></ListItemIcon>
                                                <ListItemText primary="Registar Viatura" />
                                            </ListItem>
                                        )
                                    }
                                    {
                                        ([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador].includes(currentUser.tipoUser))
                                        && (
                                            <ListItem
                                                button
                                                key="Lista Viaturas"
                                                component={NavLink}
                                                style={{ paddingLeft: theme.spacing(4) }}
                                                to={`${url}/Viaturas/ListaViaturas`}
                                                activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact
                                            >
                                                <ListItemIcon><i className="fa fa-cars fa-lg" /></ListItemIcon>
                                                <ListItemText primary="Lista Viaturas" />
                                            </ListItem>
                                        )
                                    }
                                </List>
                            </Collapse>
                        </>
                    )
                }
                {
                    ([Role.Administrador, Role.AdministradorOperador].includes(currentUser.tipoUser))
                    && (
                        <>
                            <ListItem button onClick={handleClickSeccaoAdministracao}>
                                <ListItemIcon>
                                    <i className="fa fa-users-cog fa-lg" />
                                </ListItemIcon>
                                <ListItemText primary="Administração" />
                                {openNestedSeccaoAdministracao
                                    ? <i className="fas fa-chevron-up" />
                                    : <i className="fas fa-chevron-down" />}
                            </ListItem>
                            <Collapse in={openNestedSeccaoAdministracao} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        ([Role.Administrador].includes(currentUser.tipoUser))
                                        && (
                                            <>
                                                <ListItem
                                                    button
                                                    key="Registar Administrador"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarAdministrador`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-crown fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Administrador" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Administradores"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarAdministradores`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-users-crown fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Administradores" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Registar Administrativos"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarAdministrativo`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-crown fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Administrativos" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Administrativos"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarAdministrativos`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-users-crown fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Administrativos" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Registar Administrador Operador"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarAdministradorOperador`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-cog fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Administrador Operador" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Administrador Operador"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarAdministradoresOperador`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-users-cog fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Administradores Operador" />
                                                </ListItem>
                                            </>
                                        )
                                    }
                                    {
                                        ([Role.Administrador, Role.AdministradorOperador].includes(currentUser.tipoUser))
                                        && (
                                            <>
                                                <ListItem
                                                    button
                                                    key="Registar Telefonista"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarTelefonista`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-headset fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Telefonista" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Telefonistas"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarTelefonistas`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-headset fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Telefonistas" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Registar Motorista"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarMotorista`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-tie fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Motorista" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Motoristas"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarMotoristas`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-user-tie fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Motoristas" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Registar Administrativo Operador"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/RegistarAdministrativoOperador`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-headset fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Registar Administrativo Operador" />
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    key="Listar Administrativos Operador"
                                                    component={NavLink}
                                                    style={{ paddingLeft: theme.spacing(4) }}
                                                    to={`${url}/Administracao/ListarAdministrativosOperador`}
                                                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                    exact
                                                >
                                                    <ListItemIcon><i className="fa fa-headset fa-lg" /></ListItemIcon>
                                                    <ListItemText primary="Listar Administrativos Operador" />
                                                </ListItem>
                                            </>
                                        )
                                    }
                                </List>
                            </Collapse>
                        </>
                    )
                }
            </List>
            <Divider />
            <List>
                <ListItem
                    button
                    key="Logout"
                    component={NavLink}
                    to="/Logout"
                    activeStyle={{ backgroundColor: theme.palette.primary.main }}
                    exact
                >
                    <ListItemIcon><i className="fas fa-sign-out fa-lg" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </>
    )

    return (
        <>
            <div className={classes.dashboard}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton3}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img src={Logo} width="150" alt="Logo MUV" />
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Hidden mdUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>

                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <Routes/>
                </main>
            </div>
        </>
    )
}
