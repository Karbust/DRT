import React, { useState } from 'react'
import {
    Button,
    Typography,
    Box,
    Breadcrumbs,
    Link,
    Stepper,
    Step,
    StepLabel,
    CircularProgress
} from '@material-ui/core'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import 'moment/locale/pt'
import { Formik } from 'formik'
import axios from 'axios'
import { FormDadosConta } from '../components/formDadosConta'
import { FormDadosPessoais } from '../components/formDadosPessoais'
import { FormDocumentos } from '../components/formDocumentos'
import { useStyles } from '../components/MuiStyles'

function getSteps () {
    return ['Detalhes Pessoais', 'Detalhes da Conta', 'Documentos']
}

export default function RegistarCliente () {
    const classes = useStyles()

    // const [message, setMessage] = React.useState('')
    const [activeStep, setActiveStep] = useState(0)

    const steps = getSteps()
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
    const handleReset = () => setActiveStep(0)

    const onFormikSubmit = (values, formikActions) => {
    // setMessage('')
        formikActions.setSubmitting(true)
        console.log(values)
        return axios
            .post('http://localhost:5000/user/testes', values)
            .then(() => {
                formikActions.setSubmitting(false)
                setActiveStep(3)
            }, (reason) => {
                throw new Error('Utilizador Inválido')
            })
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <FormDadosPessoais classes={classes}/>
            case 1:
                return <FormDadosConta classes={classes}/>
            case 2:
                return (
                    <Box ml={10} mr={10}>
                        <Typography variant={'h6'} paragraph>
                            Documentos necessários: carta
                            de condução e cartão de
                            cidadão. Os ficheiros têm de ter os seguintes nomes:
                            comprovativo_morada e
                            cartao_cidadao
                        </Typography>
                        <FormDocumentos/>
                    </Box>
                )
            default:
                return 'Unknown step'
        }
    }

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant={'h4'}>
                            Registo de Cliente
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant={'h5'}>
                            <Breadcrumbs separator={<NavigateNext fontSize="small"/>}
                                aria-label="breadcrumb">
                                <Link color="inherit" component={RouterLink} to='/'>
                                    Início
                                </Link>
                                <Link color="textPrimary" component={RouterLink}
                                    to='/Dashboard/RegistarCliente'
                                    aria-current="page">Registar Cliente</Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <Stepper className={classes.stepper} alternativeLabel
                        activeStep={activeStep}>
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
                                    initialValues={{
                                        nome: '',
                                        datanascimento: null,
                                        genero: '',
                                        ncc: '',
                                        nss: '',
                                        nif: '',
                                        telemovel: '',
                                        telefone: '',
                                        nacionalidade: '',
                                        morada: '',
                                        codpostal: '',
                                        localidade: '',
                                        email: '',
                                        utilizador: '',
                                        files: null
                                    }}
                                >
                                    {({
                                        isSubmitting,
                                        submitForm,
                                        isValid,
                                        errors: formErrors
                                    }) => {
                                        /* console.log(formErrors)
                                        console.log(values)
                                        console.log(isValid) */
                                        return (
                                            <>
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    submitForm()
                                                }}>
                                                    {getStepContent(activeStep)}
                                                </form>
                                                <Box component="div" align={'right'} mt={5}>
                                                    <Button disabled={!isValid || activeStep === 0}
                                                        onClick={handleBack}>
                                                        Voltar
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={activeStep === steps.length - 1 ? submitForm : handleNext}
                                                        className={classes.button}
                                                        disabled={!isValid || isSubmitting}
                                                    >
                                                        {isSubmitting && (<CircularProgress color={'inherit'}/>)}
                                                        {!isSubmitting && (activeStep === steps.length - 1 ? 'Concluir' : 'Seguinte')}
                                                    </Button>
                                                </Box>
                                            </>
                                        )
                                    }}
                                </Formik>
                            </Box>
                        )}
                    </div>
                </Box>
            </div>
        </>
    )
}
