import { Redirect, Route } from 'react-router-dom'
import React from 'react'

export const PrivateRoute = ({
    component: Component, roles, ...rest
}) => (
    <Route {...rest} render={props => {
        const currentUser = JSON.parse(localStorage.getItem('user'))

        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.tipoUser) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/' }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)
