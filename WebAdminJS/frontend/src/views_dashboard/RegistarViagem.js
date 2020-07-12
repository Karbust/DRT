import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Typography,
    Box,
    Breadcrumbs,
    Link,
    Grid, Slide,
    Snackbar,
    Backdrop, CircularProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { Formik } from 'formik'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

import { useStyles } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { FormRegistarViagem } from '../components/formRegistarViagem'
import { RotaGoogleMap } from '../components/rotaGoogleMap'
import { backendUrl, GoogleMapsApiKey } from '../configs'

export default function RegistarViagem() {
    const classes = useStyles()

    const [localidades, setLocalidades] = useState([])
    const [origem, setOrigem] = useState(null)
    const [destino, setDestino] = useState(null)
    const [distDur, setDistDur] = useState({
        isSet: false,
        duracaoText: '',
        distanciaText: '',
        duracaoValue: '',
        distanciaValue: '',
    })
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    const handleChangeOrigem = (event) => {
        if (origem !== null) {
            if (event.NR_LOCALIDADE !== origem.NR_LOCALIDADE) {
                setOrigem(event)
            }
        } else {
            setOrigem(event)
        }
    }
    const handleChangeDestino = (event) => {
        // const localidade_selecionada = localidades.find((localidade) => localidade.NR_LOCALIDADE === event.target.value)
        if (destino !== null) {
            if (event.NR_LOCALIDADE !== destino.NR_LOCALIDADE) {
                setDestino(event)
            }
        } else {
            setDestino(event)
        }
    }

    useEffect(() => {
        axios
            .get(`${backendUrl}api/localidades`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setLocalidades(res.data.data)
                }
            })
        setOpenBackdrop(false)
    }, [])

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(`${backendUrl}viagens/registopedidoviagem`, values, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    setMessage('Viagem registada com sucesso')
                    setSeverity('success')
                } else {
                    formikActions.setSubmitting(false)
                    setMessage('Ocorreu um erro ao registar a viagem.')
                    setSeverity('error')
                }
            })
            .catch(() => {
                formikActions.setSubmitting(false)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
            })
            .finally(() => {
                setOpenAlert(true)
            })
    }

    return (
        <>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
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
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant="h5">
                            Registar Viagem
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
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
                                    to="/Dashboard/RegistarViagem"
                                    aria-current="page"
                                >
                                    Registar Viagem
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <Grid container spacing={4}>
                        <Grid item sm={6} xs={12}>
                            <Formik
                                onSubmit={onFormikSubmit}
                                validateOnBlur={false}
                                validateOnChange={false}
                                initialValues={{
                                    origem: 0,
                                    destino: 0,
                                    passageiros: '',
                                    motivo: '',
                                    datahora_ida: null,
                                    datahora_volta: null,
                                    nrcliente: '',
                                    observacoes: '',
                                    distancia: 0,
                                    duracao: 0,
                                }}
                            >
                                {({
                                    submitForm,
                                }) => {
                                    return (
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            submitForm()
                                        }}
                                        >
                                            <FormRegistarViagem
                                                classes={classes}
                                                localidades={localidades}
                                                distDur={distDur}
                                                callbackOrigem={handleChangeOrigem}
                                                callbackDestino={handleChangeDestino}
                                            />
                                        </form>
                                    )
                                }}
                            </Formik>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <LoadScript
                                googleMapsApiKey={GoogleMapsApiKey}
                            >
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '600px',
                                    }}
                                    center={{
                                        lat: 40.6565861,
                                        lng: -7.9124712,
                                    }}
                                    zoom={10}
                                >
                                    <RotaGoogleMap
                                        destino={destino}
                                        origem={origem}
                                        onRouteReceived={setDistDur}
                                    />
                                </GoogleMap>
                            </LoadScript>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    )
}
