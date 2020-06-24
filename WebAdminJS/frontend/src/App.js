import React, { useEffect, useState } from 'react'
import {
    BrowserRouter as Router, Route, Switch, Redirect, useParams,
} from 'react-router-dom'
import axios from 'axios'

import AuthService from './components/auth.service'
import Login from './views/Login'
import Dashboard from './Dashboard'
import { backendUrl } from './configs'

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

/* export const PrivateRoute1 = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = AuthService.getCurrentUser()
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/' }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
) */

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/Ativacao/:token">
                    <Ativacao />
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
function Ativacao() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    const { token } = useParams()

    const [status, setStatus] = useState('')

    useEffect(() => {
        axios
            .post(`${backendUrl}user/verificarcontalink`, { token })
            .then((data) => {
                if (data.data.success) {
                    setStatus('Conta ativada com sucesso.')
                } else {
                    setStatus('Ocorreu um erro ao ativar a conta.')
                }
            }).catch(() => {
                setStatus('Ocorreu um erro ao enviar o pedido para o servidor.')
            })
    }, [token])

    return (
        <div>
            <h3>{status}</h3>
        </div>
    )
}
export default App
