import React, { useState } from 'react'
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserTie, faUserPlus, faUserCheck, faUsers, faUserCog, faHeadset, faUserShield
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
    ChevronLeft,
    ChevronRight,
    MapTwoTone,
    Person,
    DirectionsCar,
    NearMe,
    ExitToApp,
    PeopleAlt,
    ExpandLess,
    ExpandMore
} from '@material-ui/icons'
import Logo from './imagens/logo_muv.svg'
import { useStyles } from './components/MuiStyles'
import RegistarCliente from './views_dashboard/RegistarCliente'
import RegistarMotorista from './views_dashboard/RegistarMotorista'
import RegistarVeiculo from './views_dashboard/RegistarVeiculo'
import RegistarViagem from './views_dashboard/RegistarViagem'
import DashboardView from './views_dashboard/DashboardView'
import ValidarRegistos from './views_dashboard/ValidarRegistos'
import clsx from 'clsx'

export default function Dashboard () {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [openNestedViagens, setOpenNestedViagens] = React.useState(false)
    const [openNestedUsers, setOpenNestedUsers] = React.useState(false)

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
                        <ListItem button onClick={handleClickViagens}>
                            <ListItemIcon>
                                <MapTwoTone/>
                            </ListItemIcon>
                            <ListItemText primary="Viagens" />
                            {openNestedViagens ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openNestedViagens} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button key="Registar Viagem" component={NavLink} className={classes.nested}
                                    to={`${url}/Viagens/RegistarViagem`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                    <ListItemIcon><MapTwoTone/></ListItemIcon>
                                    <ListItemText primary="Registar Viagem"/>
                                </ListItem>
                                <ListItem button key="Pedidos de Viagem" component={NavLink} className={classes.nested}
                                    to={`${url}/Viagens/PedidosViagem`} activeStyle={{ backgroundColor: theme.palette.primary.main }} exact>
                                    <ListItemIcon><MapTwoTone/></ListItemIcon>
                                    <ListItemText primary="Pedidos Viagem"/>
                                </ListItem>
                            </List>
                        </Collapse>

                        <ListItem button onClick={handleClickUsers}>
                            <ListItemIcon>
                                <Icon component={FontAwesomeIcon} icon={faUsers} fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText primary="Utilizadores" />
                            {openNestedUsers ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openNestedUsers} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button key="Validar Registo Cliente" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/ValidarRegistoCliente`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserCheck} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Validar Registo Cliente"/>
                                </ListItem>
                                <ListItem button key="Registar Cliente" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/RegistarCliente`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserPlus} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Registar Cliente"/>
                                </ListItem>
                                <ListItem button key="Registar Motorista" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/RegistarMotorista`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserTie} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Registar Motorista"/>
                                </ListItem>
                                <ListItem button key="Registar Administrador" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/RegistarAdministrador`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserShield} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Registar Administrador"/>
                                </ListItem>
                                <ListItem button key="Registar Operador" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/RegistarOperador`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserCog} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Registar Operador"/>
                                </ListItem>
                                <ListItem button key="Registar Telefonista" component={NavLink} className={classes.nested}
                                    to={`${url}/Utilizadores/RegistarTelefonista`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                                    exact>
                                    <ListItemIcon><Icon component={FontAwesomeIcon} icon={faHeadset} fontSize='small'/></ListItemIcon>
                                    <ListItemText primary="Registar Telefonista"/>
                                </ListItem>
                            </List>
                        </Collapse>


                        <ListItem button key="Registar Veículo" component={NavLink}
                            to={`${url}/RegistarVeiculo`} activeStyle={{ backgroundColor: theme.palette.primary.main }}
                            exact>
                            <ListItemIcon><DirectionsCar/></ListItemIcon>
                            <ListItemText primary="Registar Veículo"/>
                        </ListItem>

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
                        <Route exact path={path} component={DashboardView}/>

                        <Route exact path={`${path}/Viagens`} component={DashboardView}/>
                        <Route exact path={`${path}/Viagens/RegistarViagem`} component={RegistarViagem}/>
                        <Route exact path={`${path}/Viagens/PedidosViagem`} component={DashboardView}/>

                        <Route exact path={`${path}/Utilizadores`} component={DashboardView}/>
                        <Route exact path={`${path}/Utilizadores/ValidarRegistoCliente`} component={ValidarRegistos}/>
                        <Route exact path={`${path}/Utilizadores/RegistarCliente`} component={RegistarCliente}/>
                        <Route exact path={`${path}/Utilizadores/RegistarMotorista`} component={RegistarMotorista}/>
                        <Route exact path={`${path}/Utilizadores/RegistarAdministrador`} component={RegistarCliente}/>
                        <Route exact path={`${path}/Utilizadores/RegistarOperador`} component={RegistarCliente}/>
                        <Route exact path={`${path}/Utilizadores/RegistarTelefonista`} component={RegistarCliente}/>

                        <Route exact path={`${path}/RegistarVeiculo`} component={RegistarVeiculo}/>
                    </Switch>
                </main>
            </div>
        </>
    )
}
