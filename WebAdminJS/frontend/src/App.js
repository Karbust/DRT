import React from 'react'
import {
    BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'

import AuthService from './components/auth.service'
import Login from './views/Login'
import Dashboard from './Dashboard'
import Microsite from './views/Microsite'
import Ativacao from './views/Ativacao'

function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={() => {
                return AuthService.getCurrentUser() ? (
                    children
                ) : (
                    <Redirect to="/Login" />
                )
            }}
        />
    )
}

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/Ativacao/:token">
                    <Ativacao />
                </Route>
                <Route path="/Ativacao">
                    <Redirect push to="/Microsite" />
                </Route>
                <Route path="/Microsite">
                    <Microsite />
                </Route>
                <PrivateRoute path="/" exact>
                    <Redirect push to="/Dashboard" />
                </PrivateRoute>
                <PrivateRoute path="/Dashboard">
                    <Dashboard />
                </PrivateRoute>
                <Route path="/Login">
                    <LoginPage />
                </Route>
                <Route path="/Logout">
                    <Logout />
                </Route>
                <Route path="*" exact>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>
    )
}

function LoginPage() {
    if (!AuthService.getCurrentUser()) { return <Login /> }
    return <Redirect to="/Dashboard" />
}

function Logout() {
    if (AuthService.getCurrentUser()) {
        AuthService.logout()
    }
    return <Redirect to="/Login" />
}
export default App
