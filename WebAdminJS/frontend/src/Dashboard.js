import React, { useState } from 'react'
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
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
    ListItemText
} from '@material-ui/core'
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    MapTwoTone,
    Person,
    DirectionsCar,
    NearMe,
    ExitToApp
} from '@material-ui/icons'
import Logo from './imagens/logo_muv.svg'
import { useStyles } from './components/MuiStyles'
import RegistarCliente from './views_dashboard/RegistarCliente'
import RegistarMotorista from './views_dashboard/RegistarMotorista'
import RegistarVeiculo from './views_dashboard/RegistarVeiculo'
import RegistarViagem from './views_dashboard/RegistarViagem'
import DashboardView from './views_dashboard/DashboardView'
import clsx from 'clsx'

export default function Dashboard () {
    const theme = useTheme()
    const [open, setOpen] = useState(false)

    const classes = useStyles()

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
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
                            activeClassName={classes.gold} exact>
                            <ListItemIcon><NearMe/></ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItem>
                        <ListItem button key="Registar Viagem" component={NavLink}
                            to={`${url}/RegistarViagem`} activeClassName={classes.gold} exact>
                            <ListItemIcon><MapTwoTone/></ListItemIcon>
                            <ListItemText primary="Registar Viagem"/>
                        </ListItem>

                        <ListItem button key="Registar Cliente" component={NavLink}
                            to={`${url}/RegistarCliente`} activeClassName={classes.gold}
                            exact>
                            <ListItemIcon><Person/></ListItemIcon>
                            <ListItemText primary="Registar Cliente"/>
                        </ListItem>

                        <ListItem button key="Registar Veículo" component={NavLink}
                            to={`${url}/RegistarVeiculo`} activeClassName={classes.gold}
                            exact>
                            <ListItemIcon><DirectionsCar/></ListItemIcon>
                            <ListItemText primary="Registar Veículo"/>
                        </ListItem>

                        <ListItem button key="Registar Motorista" component={NavLink}
                            to={`${url}/RegistarMotorista`} activeClassName={classes.gold}
                            exact>
                            <ListItemIcon><Icon component={FontAwesomeIcon} icon={faUserTie}/></ListItemIcon>
                            <ListItemText primary="Registar Motorista"/>
                        </ListItem>
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button key="Logout" component={NavLink} to="/Logout"
                            activeClassName={classes.gold} exact>
                            <ListItemIcon><ExitToApp/></ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route exact path={path} component={DashboardView}/>
                        <Route path={`${path}/RegistarCliente`}
                            component={RegistarCliente}/>
                        <Route path={`${path}/RegistarMotorista`}
                            component={RegistarMotorista}/>
                        <Route path={`${path}/RegistarVeiculo`}
                            component={RegistarVeiculo}/>
                        <Route path={`${path}/RegistarViagem`} component={RegistarViagem}/>
                    </Switch>
                </main>
            </div>
        </>
    )
}
