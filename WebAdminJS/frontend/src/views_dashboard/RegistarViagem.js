import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
    Box,
    Grid,
} from '@material-ui/core'
import { Formik } from 'formik'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

import { useStyles } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { FormRegistarViagem } from '../components/formRegistarViagem'
import { RotaGoogleMap } from '../components/rotaGoogleMap'
import { backendUrl, GoogleMapsApiKey } from '../configs'
import { getUrl } from '../components/functions'
import { PaginasHeader } from '../components/PaginasHeader'

export default function RegistarViagem() {
    const classes = useStyles()

    const [localidades, setLocalidades] = useState([])
    const [clientes, setClientes] = useState([])
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
        if (destino !== null) {
            if (event.NR_LOCALIDADE !== destino.NR_LOCALIDADE) {
                setDestino(event)
            }
        } else {
            setDestino(event)
        }
    }

    const setDistanciaDuracao = useCallback((obj) => {
        setDistDur(obj)
    }, [])

    useEffect(() => {
        Promise.all([
            getUrl('api/localidades'),
            getUrl('user/listaclientesreduzida'),
        ]).then((data) => {
            const objLocalidades = data[0]
            const objClientes = data[1]

            if (objLocalidades.data.success) {
                setLocalidades(objLocalidades.data.data)
            } else {
                throw new Error(objLocalidades.data.message)
            }

            if (objClientes.data.success) {
                setClientes(objClientes.data.data)
            } else {
                throw new Error(objClientes.data.message)
            }
        }).catch((error) => {
            setMessage(error.message)
            setSeverity('error')
            setOpenAlert(true)
        }).finally(() => {
            setOpenBackdrop(false)
        })
    }, [])

    const onFormikSubmit = (values, formikActions) => {
        values.clientes = values.clientes.map((cliente) => cliente.NR_UTILIZADOR)
        return axios
            .post(`${backendUrl}viagens/registopedidoviagem`, values, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setOrigem(null)
                    setDestino(null)
                    setDistDur({
                        isSet: false,
                        duracaoText: '',
                        distanciaText: '',
                        duracaoValue: '',
                        distanciaValue: '',
                    })
                    formikActions.setStatus(1)
                    formikActions.resetForm()
                    setMessage(res.data.message)
                    setSeverity('success')
                } else {
                    setMessage(res.data.message)
                    setSeverity('error')
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
            })
            .finally(() => {
                setOpenAlert(true)
            })
    }

    return (
        <>
            <PaginasHeader
                openBackdrop={openBackdrop}
                handleCloseBackdrop={handleCloseBackdrop}
                openAlert={openAlert}
                handleCloseAlert={handleCloseAlert}
                severity={severity}
                message={message}
                titulo="Registar Viagem"
                url="/Dashboard/Viagens/RegistarViagem"
            />
            <Box mb={2}>
                <Grid container spacing={4}>
                    <Grid item sm={6} xs={12}>
                        <Formik
                            onSubmit={onFormikSubmit}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize
                            initialStatus={0}
                            initialValues={{
                                origem: 0,
                                destino: 0,
                                passageiros: '',
                                motivo: '',
                                datahora_ida: null,
                                datahora_volta: null,
                                nrcliente: '',
                                clientes: [],
                                observacoes: '',
                                distancia: 0,
                                duracao: 0,
                            }}
                        >
                            {({
                                submitForm,
                                status,
                            }) => {
                                return (
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        submitForm()
                                    }}
                                    >
                                        <FormRegistarViagem
                                            key={status}
                                            classes={classes}
                                            localidades={localidades}
                                            clientes={clientes}
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
                                    onRouteReceived={setDistanciaDuracao}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
