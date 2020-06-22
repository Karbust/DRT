import React, { useState } from 'react'
import { NavLink, Switch, useRouteMatch } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserTie, faUserPlus, faUserCheck, faUsers, faUserCog, faHeadset, faUserShield, faUserTimes
} from '@fortawesome/free-solid-svg-icons'
import {
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Divider,
    Icon,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse
} from '@material-ui/core'
import {
    Menu,
    History,
    ChevronLeft,
    ChevronRight,
    Map,
    MapTwoTone,
    MapOutlined,
    DirectionsCar,
    NearMe,
    ExitToApp,
    ExpandLess,
    ExpandMore
} from '@material-ui/icons'
import Logo from './imagens/logo_muv.svg'
import { useStyles } from './components/MuiStyles'
import RegistarCliente from './views_dashboard/RegistarCliente'
import RegistarMotorista from './views_dashboard/RegistarMotorista'
import RegistarViagem from './views_dashboard/RegistarViagem'
import DashboardView from './views_dashboard/DashboardView'
import ValidarRegistos from './views_dashboard/ValidarRegistos'
import PedidosViagem from './views_dashboard/PedidosViagem'
import HistoricoViagens from './views_dashboard/HistoricoViagens'
import RegistarViatura from './views_dashboard/RegistarViatura'
import ListaViaturas from './views_dashboard/ListaViaturas'
import clsx from 'clsx'
import RegistosNaoValidados from './views_dashboard/RegistosNaoValidados'
import { Role } from './components/functions'
import { PrivateRoute } from './components/PrivateRoute'

export default function Dashboard () {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [openNestedViagens, setOpenNestedViagens] = React.useState(false)
    const [openNestedViaturas, setOpenNestedViaturas] = React.useState(false)
    const [openNestedUsers, setOpenNestedUsers] = React.useState(false)

    const currentUser = JSON.parse(localStorage.getItem('user'))

    const classes = useStyles()

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
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

    const { path, url } = useRouteMatch()

    return (
        <>
            <div className={classes.dashboard}>
                <CssBaseline/>
                <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open
                    })}
                >
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer"
                            onClick={handleDrawerOpen} edge="start"
                            className={clsx(classes.menuButton2, {
                                [classes.hide]: open
                            })}
                        >
                            <Menu/>
                        </IconButton>
                        <img src={Logo} width="150" alt={'Logo MUV'}/>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open
                        })
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRight/> : <ChevronLeft/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button key="Dashboard" component={NavLink} to={`${url}`}
                            activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                            <ListItemIcon><NearMe/></ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItem>
                        {
                            ([Role.Administrador,Role.AdministradorOperador,Role.Telefonista].includes(currentUser.tipoUser)) &&
                                <>
                                    <ListItem button onClick={handleClickViagens}>
                                        <ListItemIcon>
                                            <MapTwoTone/>
                                        </ListItemIcon>
                                        <ListItemText primary="Viagens" />
                                        {openNestedViagens ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={openNestedViagens} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                ([Role.Administrador,Role.AdministradorOperador,Role.Telefonista].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Viagem" component={NavLink} className={classes.nested}
                                                to={`${url}/Viagens/RegistarViagem`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                                <ListItemIcon><MapOutlined/></ListItemIcon>
                                                <ListItemText primary="Registar Viagem"/>
                                            </ListItem>
                                            }
                                            {
                                                ([Role.Administrador,Role.AdministradorOperador,Role.Telefonista].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Pedidos de Viagem" component={NavLink} className={classes.nested}
                                                to={`${url}/Viagens/PedidosViagem`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                                <ListItemIcon><Map/></ListItemIcon>
                                                <ListItemText primary="Pedidos Viagem"/>
                                            </ListItem>
                                            }
                                            {
                                                ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Histórico Viagens" component={NavLink} className={classes.nested}
                                                to={`${url}/Viagens/HistoricoViagens`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                                <ListItemIcon><History/></ListItemIcon>
                                                <ListItemText primary="Histórico Viagens"/>
                                            </ListItem>
                                            }
                                        </List>
                                    </Collapse>
                                </>
                        }

                        {
                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                            <>
                                <ListItem button onClick={handleClickUsers}>
                                    <ListItemIcon>
                                        <Icon component={FontAwesomeIcon} icon={faUsers} fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText primary="Utilizadores" />
                                    {openNestedUsers ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openNestedUsers} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Validar Registo Cliente" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/ValidarRegistoCliente`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserCheck} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Validar Registo Cliente"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registos Não Validados" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistosNaoValidados`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserTimes} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registos Não Validados"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Cliente" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistarCliente`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserPlus} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registar Cliente"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Motorista" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistarMotorista`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserTie} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registar Motorista"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Administrador" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistarAdministrador`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserShield} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registar Administrador"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Operador" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistarOperador`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserCog} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registar Operador"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Telefonista" component={NavLink} className={classes.nested}
                                                to={`${url}/Utilizadores/RegistarTelefonista`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><Icon component={FontAwesomeIcon} icon={faHeadset} fontSize='small'/></ListItemIcon>
                                                <ListItemText primary="Registar Telefonista"/>
                                            </ListItem>
                                        }
                                    </List>
                                </Collapse>
                            </>
                        }

                        {
                            ([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador].includes(currentUser.tipoUser)) &&
                            <>
                                <ListItem button onClick={handleClickViaturas}>
                                    <ListItemIcon>
                                        <MapTwoTone/>
                                    </ListItemIcon>
                                    <ListItemText primary="Viaturas" />
                                    {openNestedViaturas ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openNestedViaturas} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Registar Viatura" component={NavLink} className={classes.nested}
                                                to={`${url}/Viaturas/RegistarViatura`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                                exact>
                                                <ListItemIcon><DirectionsCar/></ListItemIcon>
                                                <ListItemText primary="Registar Viatura"/>
                                            </ListItem>
                                        }
                                        {
                                            ([Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador].includes(currentUser.tipoUser)) &&
                                            <ListItem button key="Lista Viaturas" component={NavLink} className={classes.nested}
                                                to={`${url}/Viaturas/ListaViaturas`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                                <ListItemIcon><Map/></ListItemIcon>
                                                <ListItemText primary="Lista Viaturas"/>
                                            </ListItem>
                                        }
                                    </List>
                                </Collapse>
                            </>
                        }
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button key="Logout" component={NavLink} to="/Logout"
                            activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                            <ListItemIcon><ExitToApp/></ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <PrivateRoute exact path={path} component={DashboardView}/>

                        <PrivateRoute exact path={`${path}/Viagens`} component={DashboardView}/>
                        <PrivateRoute exact path={`${path}/Viagens/RegistarViagem`} roles={[Role.Administrador,Role.AdministradorOperador,Role.Telefonista]} component={RegistarViagem}/>
                        <PrivateRoute exact path={`${path}/Viagens/PedidosViagem`} roles={[Role.Administrador,Role.AdministradorOperador,Role.Telefonista]} component={PedidosViagem}/>
                        <PrivateRoute exact path={`${path}/Viagens/HistoricoViagens`} roles={[Role.Administrador,Role.AdministradorOperador]} component={HistoricoViagens}/>

                        <PrivateRoute exact path={`${path}/Utilizadores`} component={DashboardView}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/ValidarRegistoCliente`} roles={[Role.Administrador,Role.Administrativo]} component={ValidarRegistos}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistosNaoValidados`} roles={[Role.Administrador,Role.Administrativo]} component={RegistosNaoValidados}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistarCliente`} roles={[Role.Administrador,Role.Administrativo]} component={RegistarCliente}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistarMotorista`} roles={[Role.Administrador,Role.AdministradorOperador]} component={RegistarMotorista}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistarAdministrador`} roles={[Role.Administrador]} component={RegistarCliente}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistarOperador`} roles={[Role.Administrador]} component={RegistarCliente}/>
                        <PrivateRoute exact path={`${path}/Utilizadores/RegistarTelefonista`} roles={[Role.Administrador,Role.AdministradorOperador]} component={RegistarCliente}/>

                        <PrivateRoute exact path={`${path}/Viaturas`} component={DashboardView}/>
                        <PrivateRoute exact path={`${path}/Viaturas/RegistarViatura`} roles={[Role.Administrador,Role.AdministradorOperador]} component={RegistarViatura}/>
                        <PrivateRoute exact path={`${path}/Viaturas/ListaViaturas`} roles={[Role.Administrador,Role.AdministradorOperador,Role.AdministrativoOperador]} component={ListaViaturas}/>
                    </Switch>
                </main>
            </div>
        </>
    )
}
