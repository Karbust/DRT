import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Typography,
    Box,
    Breadcrumbs,
    Link,
    Grid,
} from '@material-ui/core'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useStyles } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { Formik } from 'formik'
import { FormRegistarViagem } from '../components/formRegistarViagem'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { RotaGoogleMap } from '../components/rotaGoogleMap'
import { backendUrl } from '../configs'

export default function RegistarViagem() {
    const classes = useStyles()

    const [motoristas, setMotoristas] = useState([])
    const [localidades, setLocalidades] = useState([])
    const [origem, setOrigem] = useState(null)
    const [destino, setDestino] = useState(null)
    const [origemMaps, setOrigemMaps] = useState({
        lat: 0,
        lng: 0,
    })
    const [destinoMaps, setDestinoMaps] = useState({
        lat: 0,
        lng: 0,
    })
    const [distDur, setDistDur] = useState({
        isSet: false,
        duracaoText: '',
        distanciaText: '',
        duracaoValue: '',
        distanciaValue: '',
    })

    const handleChangeOrigem = (event) => {
        // const localidade_selecionada = localidades.find((localidade) => localidade.NR_LOCALIDADE === event.target.value)
        if(origem !== null) {
            if (event.NR_LOCALIDADE !== origem.NR_LOCALIDADE) {
                setOrigem(event)
            }
        } else {
            setOrigem(event)
        }
        /*setOrigemMaps({
            lat: event.LATITUDE,
            lng: event.LONGITUDE,
        })*/
    }
    const handleChangeDestino = (event) => {
        // const localidade_selecionada = localidades.find((localidade) => localidade.NR_LOCALIDADE === event.target.value)
        if(destino !== null) {
            if (event.NR_LOCALIDADE !== destino.NR_LOCALIDADE) {
                setDestino(event)
            }
        } else {
            setDestino(event)
        }
        setDestinoMaps({
            lat: event.LATITUDE,
            lng: event.LONGITUDE,
        })
    }

    useEffect(() => {
        axios
            .get(backendUrl + 'api/localidades', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setLocalidades(res.data.data)
                }
            })
        axios
            .get(backendUrl + 'user/motoristas', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setMotoristas(res.data.data)
                }
            })
    }, [])

    const onFormikSubmit = (values, formikActions) => {
        // setMessage('')
        formikActions.setSubmitting(true)
        console.log(values)
        /* return axios
            .post('http://localhost:5000/user/testes', values)
            .then(() => {
                formikActions.setSubmitting(false)
            }, (reason) => {
                throw new Error('Utilizador Inválido')
            }) */
    }

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant={'h4'}>
                            RegistarViagem
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant={'h5'}>
                            <Breadcrumbs
                                separator={<NavigateNext fontSize="small"/>}
                                aria-label="breadcrumb">
                                <Link color="inherit" component={RouterLink}
                                    to='/'>
                                    Início
                                </Link>
                                <Link color="textPrimary" component={RouterLink}
                                    to='/Dashboard/RegistarViagem'
                                    aria-current="page">RegistarViagem</Link>
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
                                    ncc: '',
                                    motorista: 0,
                                    observacoes: '',
                                    distancia: 0,
                                }}
                            >
                                {({
                                    submitForm,
                                    errors: formErrors,
                                }) => {
                                    return (
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            submitForm()
                                        }}>
                                            <FormRegistarViagem classes={classes}
                                                localidades={localidades}
                                                motoristas={motoristas}
                                                distDur={distDur}
                                                callbackOrigem={handleChangeOrigem}
                                                callbackDestino={handleChangeDestino}/>
                                        </form>
                                    )
                                }}
                            </Formik>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <LoadScript
                                /*googleMapsApiKey="AIzaSyCjX2Bhd023B83EgYkUr1wyqZfUUIWIKgE"*/>
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
                                    <RotaGoogleMap destino={destino}
                                        origem={origem}
                                        onRouteReceived={setDistDur}/>
                                </GoogleMap>
                            </LoadScript>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    )
}
