import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import AuthService from './components/auth.service'
import Login from './views/Login'
import Dashboard from './Dashboard'

function PrivateRoute ({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={() => {
                return AuthService.getCurrentUser() ? (
                    children
                ) : (
                    <Redirect to="/Login"/>
                )
            }
            }
        />
    )
}

/*export const PrivateRoute1 = ({ component: Component, roles, ...rest }) => (
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
)*/

function App () {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/" exact>
                    <Redirect push to="/Dashboard" />
                </PrivateRoute>
                <PrivateRoute path="/Dashboard">
                    <Dashboard />
                </PrivateRoute>
                <Route path="/Login" >
                    <LoginPage />
                </Route>
                <Route path="/Logout" >
                    <Logout />
                </Route>
                <Route path='*' exact={true}>
                    <Redirect to="/"/>
                </Route>
            </Switch>
        </Router>
    )
}

function LoginPage () {
    if (!AuthService.getCurrentUser()) { return <Login /> }
    return <Redirect to="/Dashboard" />
}

function Logout () {
    if (AuthService.getCurrentUser()) {
        AuthService.logout()
    }
    return <Redirect to="/Login" />
}

export default App
