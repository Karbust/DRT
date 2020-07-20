import React, { useEffect, useState } from 'react'
import 'typeface-roboto'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Box, Grid } from '@material-ui/core'
import { useStyles } from '../components/MuiStyles'

import { backendUrl } from '../configs'
import '../css/ativacao.css'

export default function Ativacao() {
    const classes = useStyles()
    const { token } = useParams()

    const [status, setStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')

    useEffect(() => {
        axios
            .post(`${backendUrl}user/verificarcontalink`, { token })
            .then((data) => {
                if (data.data.success) {
                    setStatus(true)
                    setStatusMessage(data.data.message)
                } else {
                    setStatus(false)
                    setStatusMessage(data.data.message)
                }
            })
            .catch(() => {
                setStatus(false)
                setStatusMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
            })
    }, [token])

    return (
        <>
            <Box className={classes.jumbotron}>
                <Grid md={5} lg={4} xl={3} className={classes.grid} item>
                    <Box p={5}>
                        {status && (
                            <>
                                <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ display: 'flex' }}>
                                    <span className="swal2-success-line-tip"/>
                                    <span className="swal2-success-line-long"/>
                                    <div className="swal2-success-ring"/>
                                </div>
                                <h3>{statusMessage}</h3>
                            </>
                        )}

                        {!status && (
                            <>
                                <div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: 'flex' }}>
                                    <span className="swal2-x-mark">
                                        <span className="swal2-x-mark-line-left"/>
                                        <span className="swal2-x-mark-line-right"/>
                                    </span>
                                </div>
                                <h3>{statusMessage}</h3>
                            </>
                        )}
                    </Box>
                </Grid>
            </Box>
        </>
    )
}
