import React, { useEffect, useState } from 'react'
import {
    Typography,
    Box,
    Button,
    Breadcrumbs,
    Link,
    Grid,
    CircularProgress,
    Snackbar,
    Slide,
} from '@material-ui/core'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { Formik } from 'formik'
import axios from 'axios'
import { Alert } from '@material-ui/lab'

import { useStyles } from '../components/MuiStyles'
import { backendUrl } from '../configs'
import authHeader from '../components/auth-header'
import { FormRegistarViatura } from '../components/formRegistarViatura'
import { MiniFormAdicionarMarca, MiniFormAdicionarModelo, MiniFormAdicionarCor, MiniFormAdicionarSeguradora } from '../components/miniFormsRegistosViaturas'

export default function RegistarViatura() {
    const classes = useStyles()

    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos] = useState([])
    const [cores, setCores] = useState([])
    const [seguradoras, setSeguradoras] = useState([])
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [isSubmittingNomeMarca, setIsSubmittingNomeMarca] = useState(false)
    const [isSubmittingNomeModelo, setIsSubmittingNomeModelo] = useState(false)
    const [isSubmittingNomeCor, setIsSubmittingNomeCor] = useState(false)
    const [isSubmittingNomeSeguradora, setIsSubmittingNomeSeguradora] = useState(false)

    const [openMarca, setOpenMarca] = useState(false)
    const [openModelo, setOpenModelo] = useState(false)
    const [openCor, setOpenCor] = useState(false)
    const [openSeguradora, setOpenSeguradora] = useState(false)

    // MARCA - START
    const handleCloseMarca = () => {
        setOpenMarca(false)
    }
    const handleSubmitMarca = (messagem, severidade) => {
        setMessage(messagem)
        setSeverity(severidade)
        setOpenAlert(true)
        setIsSubmittingNomeMarca(true)
    }
    const handleClickOpenMarca = () => {
        setOpenMarca(true)
    }
    // MARCA - END

    // MODELO - START
    const handleCloseModelo = () => {
        setOpenModelo(false)
    }
    const handleSubmitModelo = (messagem, severidade) => {
        setMessage(messagem)
        setSeverity(severidade)
        setOpenAlert(true)
        setIsSubmittingNomeModelo(true)
    }
    const handleClickOpenModelo = () => {
        setOpenModelo(true)
    }
    // MODELO - END

    // COR - START
    const handleCloseCor = () => {
        setOpenCor(false)
    }
    const handleSubmitCor = (messagem, severidade) => {
        setMessage(messagem)
        setSeverity(severidade)
        setOpenAlert(true)
        setIsSubmittingNomeCor(true)
    }
    const handleClickOpenCor = () => {
        setOpenCor(true)
    }
    // COR - END

    // SEGURADORA - START
    const handleCloseSeguradora = () => {
        setOpenSeguradora(false)
    }
    const handleSubmitSeguradora = (messagem, severidade) => {
        setMessage(messagem)
        setSeverity(severidade)
        setOpenAlert(true)
        setIsSubmittingNomeSeguradora(true)
    }
    const handleClickOpenSeguradora = () => {
        setOpenSeguradora(true)
    }
    // SEGURADORA - END

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    useEffect(() => {
        axios
            .get(`${backendUrl}viaturas/marcas`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setMarcas(res.data.data)
                }
            })
        axios
            .get(`${backendUrl}viaturas/modelos`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setModelos(res.data.data)
                }
            })
        axios
            .get(`${backendUrl}viaturas/cores`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setCores(res.data.data)
                }
            })
        axios
            .get(`${backendUrl}viaturas/seguradoras`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setSeguradoras(res.data.data)
                }
            })
    }, [isSubmittingNomeSeguradora, isSubmittingNomeCor, isSubmittingNomeModelo, isSubmittingNomeMarca])

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(`${backendUrl}viaturas/adicionarviatura`, values, { headers: authHeader() })
            .then((data) => {
                if (data.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    setMessage(data.data.message)
                    setSeverity('success')
                    setOpenAlert(true)
                    setIsSubmittingNomeMarca(true)
                } else {
                    setMessage(data.data.message)
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
    }

    return (
        <>
            <div className={classes.root}>
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
                        <Typography variant="h4">
                            Registar Viatura
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant="h5">
                            <Breadcrumbs
                                separator={<NavigateNext fontSize="small" />}
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
                                    to="/Dashboard/RegistarVeiculo"
                                    aria-current="page"
                                >
                                    Registar
                                    Viatura
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <MiniFormAdicionarMarca
                    handleSubmitMarca={handleSubmitMarca}
                    handleCloseMarca={handleCloseMarca}
                    openMarca={openMarca}
                />
                <MiniFormAdicionarModelo
                    handleSubmitModelo={handleSubmitModelo}
                    handleCloseModelo={handleCloseModelo}
                    openModelo={openModelo}
                    marcas={marcas}
                />
                <MiniFormAdicionarCor
                    handleSubmitCor={handleSubmitCor}
                    handleCloseCor={handleCloseCor}
                    openCor={openCor}
                />
                <MiniFormAdicionarSeguradora
                    handleSubmitSeguradora={handleSubmitSeguradora}
                    handleCloseSeguradora={handleCloseSeguradora}
                    openSeguradora={openSeguradora}
                />
                <Box mb={2}>
                    <Grid container spacing={4}>
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <Button className={classes.button3} variant="contained" color="primary" onClick={handleClickOpenMarca}>
                                Adicionar Marca
                            </Button>
                        </Grid>
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <Button className={classes.button3} variant="contained" color="primary" onClick={handleClickOpenModelo}>
                                Adicionar Modelo
                            </Button>
                        </Grid>
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <Button className={classes.button3} variant="contained" color="primary" onClick={handleClickOpenCor}>
                                Adicionar Cor
                            </Button>
                        </Grid>
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <Button className={classes.button3} variant="contained" color="primary" onClick={handleClickOpenSeguradora}>
                                Adicionar Seguradora
                            </Button>
                        </Grid>
                    </Grid>
                    <Formik
                        onSubmit={onFormikSubmit}
                        validateOnBlur={false}
                        validateOnChange={false}
                        initialValues={{
                            matricula: '',
                            ano: '',
                            modelo: 0,
                            cor: 0,
                            capacidade: '',
                            apolice: '',
                            seguradora: 0,
                        }}
                    >
                        {({
                            submitForm,
                            isValid,
                            isSubmitting,
                        }) => {
                            return (
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    submitForm()
                                }}
                                >
                                    <Grid container spacing={4}>
                                        <FormRegistarViatura
                                            cores={cores}
                                            modelos={modelos}
                                            seguradoras={seguradoras}
                                        />
                                    </Grid>

                                    <Box component="div" align="right" mt={5}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={submitForm}
                                            className={classes.button}
                                            disabled={!isValid || isSubmitting}
                                        >
                                            {isSubmitting && (<CircularProgress color="inherit" />)}
                                            {!isSubmitting && 'Concluir'}
                                        </Button>
                                    </Box>
                                </form>
                            )
                        }}
                    </Formik>
                </Box>
            </div>
        </>
    )
}
