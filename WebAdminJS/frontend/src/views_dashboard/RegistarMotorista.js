import React, { useEffect, useState } from 'react'
import {
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
} from '@material-ui/core'
import 'moment/locale/pt'
import { Formik } from 'formik'
import axios from 'axios'

import { FormDadosConta } from '../components/formDadosConta'
import { FormDadosPessoais } from '../components/formDadosPessoais'
import { FormDocumentos } from '../components/formDocumentos'
import { useStyles } from '../components/MuiStyles'
import { backendUrl } from '../configs'
import { getUrl } from '../components/functions'
import { PaginasHeader } from '../components/PaginasHeader'
import authHeader from '../components/auth-header'

function getSteps() {
    return ['Detalhes Pessoais', 'Detalhes da Conta', 'Documentos']
}

export default function RegistarMotorista() {
    const classes = useStyles()

    const [activeStep, setActiveStep] = useState(0)
    const [nacionalidades, setNacionalidades] = useState([])
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

    const steps = getSteps()
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
    const handleReset = () => setActiveStep(0)

    useEffect(() => {
        getUrl('api/nacionalidades')
            .then((res) => {
                if (res.data.success) {
                    setNacionalidades(res.data.data)
                } else {
                    setMessage('Não foi possível obter a lista de nacionalidades.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido de nacionalidades para o servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
            .finally(() => {
                setOpenBackdrop(false)
            })
    }, [])

    const onFormikSubmit = (values, formikActions) => {
        const formData = new FormData()
        const { files, ...remaining_values } = values
        Object.keys(remaining_values).forEach((key) => formData.append(key, remaining_values[key]))
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }
        return axios
            .post(`${backendUrl}user/registar`, formData, { headers: authHeader() })
            .then((data) => {
                if (data.data.success) {
                    formikActions.setStatus(1)
                    setActiveStep(3)
                    formikActions.resetForm()
                    setMessage(data.data.message)
                    setSeverity('success')
                } else {
                    setMessage(data.data.message)
                    setSeverity('error')
                }
            }).catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
            })
            .finally(() => {
                setOpenAlert(true)
            })
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <FormDadosPessoais classes={classes} nacionalidades={nacionalidades} />
            case 1:
                return <FormDadosConta classes={classes} />
            case 2:
                return (
                    <Box ml={10} mr={10}>
                        <Typography variant="h6" paragraph>
                            Documentos necessários: carta
                            de condução e cartão de
                            cidadão. Os ficheiros têm de ter os seguintes nomes:
                            carta_conducao e
                            cartao_cidadao
                        </Typography>
                        <FormDocumentos />
                    </Box>
                )
            default:
                return 'Unknown step'
        }
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
                titulo="Registar Motorista"
                url="/Dashboard/Administracao/RegistarMotorista"
            />
            <Box mb={2}>
                <Stepper
                    className={classes.stepper}
                    alternativeLabel
                    activeStep={activeStep}
                >
                    {steps.map((label) => (
                        <Step key={label} className={classes.step}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <Box>
                            <Formik
                                onSubmit={onFormikSubmit}
                                validateOnBlur={false}
                                validateOnChange={false}
                                enableReinitialize
                                initialStatus={0}
                                initialValues={{
                                    nome: '',
                                    datanascimento: null,
                                    genero: '',
                                    ncc: '',
                                    nss: '',
                                    nif: '',
                                    telemovel: '',
                                    telefone: '',
                                    nacionalidade: 0,
                                    morada: '',
                                    codpostal: '',
                                    localidade: '',
                                    email: '',
                                    utilizador: '',
                                    tipo_utilizador: 5,
                                    files: null,
                                }}
                            >
                                {({
                                    isSubmitting,
                                    submitForm,
                                    isValid,
                                    status,
                                }) => {
                                    return (
                                        <>
                                            <form
                                                key={status}
                                                onSubmit={(event) => {
                                                    event.preventDefault()
                                                    submitForm()
                                                }}
                                            >
                                                {
                                                    getStepContent(activeStep)
                                                }
                                                <Box component="div" align="right" mt={5}>
                                                    <Button
                                                        disabled={!isValid || activeStep === 0}
                                                        onClick={handleBack}
                                                    >
                                                        Voltar
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={activeStep === steps.length - 1 ? submitForm : handleNext}
                                                        className={classes.button}
                                                        disabled={!isValid || isSubmitting}
                                                    >
                                                        {isSubmitting && (<CircularProgress color="inherit" />)}
                                                        {!isSubmitting && (activeStep === steps.length - 1 ? 'Concluir' : 'Seguinte')}
                                                    </Button>
                                                </Box>
                                            </form>
                                        </>
                                    )
                                }}
                            </Formik>
                        </Box>
                    )}
                </div>
            </Box>
        </>
    )
}
