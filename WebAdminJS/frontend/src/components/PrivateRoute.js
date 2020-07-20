import { Redirect, Route } from 'react-router-dom'
import React from 'react'

export const PrivateRoute = (props) => {
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const { roles, ...remaining_props } = props

    if (!currentUser) {
        return <Redirect to={{
            pathname: '/Login',
            state: { from: props.location }
        }}/>
    }

    if (roles && roles.indexOf(currentUser.tipoUser) === -1) {
        return <Redirect to={{ pathname: '/' }}/>
    }

    return (
        <Route {...remaining_props}/>
    )
}
