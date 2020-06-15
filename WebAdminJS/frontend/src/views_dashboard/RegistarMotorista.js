import React, { useEffect, useState } from 'react'
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
import { backendUrl } from '../configs'

function getSteps () {
    return ['Detalhes Pessoais', 'Detalhes da Conta', 'Documentos']
}

export default function RegistarMotorista () {
    const classes = useStyles()

    // const [message, setMessage] = React.useState('')
    const [activeStep, setActiveStep] = useState(0)
    const [nacionalidades, setNacionalidades] = useState([])
    const [localidades, setLocalidades] = useState([])

    const steps = getSteps()
    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
    const handleReset = () => setActiveStep(0)

    useEffect(() => {
        axios
            .get(backendUrl + 'api/nacionalidades'/*, { headers: authHeader() }*/)
            .then(res => {
                if (res.data.success) {
                    setNacionalidades(res.data.data)
                }
            })
        axios
            .get(backendUrl + 'api/localidades'/*, { headers: authHeader() }*/)
            .then(res => {
                if (res.data.success) {
                    setLocalidades(res.data.data)
                }
            })
    }, [])

    const onFormikSubmit = (values, formikActions) => {
    // setMessage('')
        formikActions.setSubmitting(true)
        let formData = new FormData()
        const { files, ...remaining_values } = values
        Object.keys(remaining_values).forEach(key => formData.append(key, remaining_values[key]))
        for(let i = 0; i < files.length; i++){
            formData.append('files', files[i])
        }
        return axios
            .post(backendUrl + 'user/register', formData)
            .then(() => {
                formikActions.setSubmitting(false)
                //setActiveStep(3)
            }, (reason) => {
                throw new Error('Utilizador Inválido')
            })
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <FormDadosPessoais classes={classes} nacionalidades={nacionalidades} localidades={localidades}/>
            case 1:
                return <FormDadosConta classes={classes}/>
            case 2:
                return (
                    <Box ml={10} mr={10}>
                        <Typography variant={'h6'} paragraph>
                            Documentos necessários: carta
                            de condução e cartão de
                            cidadão. Os ficheiros têm de ter os seguintes nomes:
                            carta_conducao e
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
                            Registo de Motorista
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
                                    to='/Dashboard/RegistarMotorista'
                                    aria-current="page">Registar Motorista</Link>
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
                                        nome: 'teste',
                                        datanascimento: '2019-06-04',
                                        genero: 'M',
                                        ncc: '',
                                        nss: '123',
                                        nif: '',
                                        telemovel: '123',
                                        telefone: '123',
                                        nacionalidade: 189,
                                        morada: 'teste',
                                        codpostal: 'teste',
                                        localidade: '123',
                                        email: '',
                                        utilizador: 'teste',
                                        tipo_utilizador: 5,
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
                                        console.log(isValid) */
                                        return (
                                            <>
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    submitForm()
                                                }}>
                                                    {
                                                        getStepContent(activeStep)
                                                    }
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
