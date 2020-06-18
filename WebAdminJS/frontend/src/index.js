import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { muiTheme } from './components/MuiStyles'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'
import ConfirmProvider from 'material-ui-confirm'

ReactDOM.render(
    <React.Fragment>
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <ConfirmProvider>
                <App />
            </ConfirmProvider>
        </ThemeProvider>
    </React.Fragment>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
