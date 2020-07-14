import { Redirect, Route } from 'react-router-dom'
import React from 'react'

export const PrivateRoute = ({
    component: Component, roles, ...rest
}) => (
    <Route
        {...rest}
        render={(props) => {
            const currentUser = JSON.parse(localStorage.getItem('user'))

            if (!currentUser) {
                return <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />
            }

            if (roles && roles.indexOf(currentUser.tipoUser) === -1) {
                return <Redirect to={{ pathname: '/' }} />
            }

            return <Component {...props} />
        }}
    />
)
