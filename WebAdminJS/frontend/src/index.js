import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import { MuiThemeProvider } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ConfirmProvider } from 'material-ui-confirm'

import App from './App'
import * as serviceWorker from './serviceWorker'
import { muiTheme } from './components/MuiStyles'

ReactDOM.render(
    <>
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <ConfirmProvider>
                <App />
            </ConfirmProvider>
        </MuiThemeProvider>
    </>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
