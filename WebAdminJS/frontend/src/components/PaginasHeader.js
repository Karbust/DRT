import {
    Backdrop,
    Box, Breadcrumbs,
    CircularProgress, Link,
    Slide,
    Snackbar,
    Typography,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

import { useStyles } from './MuiStyles'
import clsx from 'clsx'

export const PaginasHeader = (props) => {
    const classes = useStyles()
    const {
        openBackdrop, handleCloseBackdrop, openAlert, handleCloseAlert, severity, message, titulo, url,
    } = props
    return (
        <>
            <Backdrop
                className={classes.backdrop}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                TransitionComponent={Slide}
            >
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            <Box mb={2} className={classes.container_header}>
                <Box mb={1} pt={1} className={classes.heading}>
                    <Typography variant="h5">
                        {titulo}
                    </Typography>
                </Box>

                <Box className={clsx(classes.box, classes.breadcrumbs)}>
                    <Typography variant="h5">
                        <Breadcrumbs
                            separator="›"
                            aria-label="breadcrumb"
                        >
                            <Link
                                color="inherit"
                                component={RouterLink}
                                to="/"
                            >
                                Início
                            </Link>
                            <Link
                                color="textPrimary"
                                component={RouterLink}
                                to={url}
                                aria-current="page"
                            >
                                {titulo}
                            </Link>
                        </Breadcrumbs>
                    </Typography>
                </Box>
            </Box>
        </>
    )
}
PaginasHeader.propTypes = {
    openBackdrop: PropTypes.bool.isRequired,
    handleCloseBackdrop: PropTypes.func.isRequired,
    openAlert: PropTypes.bool.isRequired,
    handleCloseAlert: PropTypes.func.isRequired,
    severity: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}
