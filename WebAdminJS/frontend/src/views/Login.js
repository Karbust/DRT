import React, { useState } from 'react'
import {
    Link,
    AppBar,
    Snackbar,
    Slide,
    Toolbar,
    Typography,
    Grid,
    TextField,
    FormControlLabel,
    Box,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Link as RouterLink } from 'react-router-dom'
import 'typeface-roboto'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Field, Formik } from 'formik'
import validator from 'validator'

import Logo from '../imagens/logo_muv.svg'
import AuthService from '../components/auth.service'
import { useStyles, GoldCheckbox, StyledButton } from '../components/MuiStyles'

export default function Login() {
    const classes = useStyles()

    const [message, setMessage] = useState('')
    const [severidade, setSeveridade] = useState('')
    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { return }

        setOpen(false)
    }

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        AuthService.login(values)
            .then((res) => {
                if (res.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    setMessage('Login efetuado com sucesso.')
                    setSeveridade('success')
                    setOpen(true)
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                } else {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    setMessage(res.message)
                    setSeveridade('error')
                    setOpen(true)
                }
            })
            .catch(() => {
                formikActions.setSubmitting(false)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeveridade('error')
                setOpen(true)
            })
    }

    return (
        <>
            <div className={classes.login}>
                <AppBar position="fixed">
                    <Toolbar>
                        <img src={Logo} width="150" alt="Logo MUV" />
                    </Toolbar>
                </AppBar>
            </div>
            <Box className={classes.jumbotron}>
                <Grid md={5} lg={4} xl={3} className={classes.grid} item>
                    <Box p={5}>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            TransitionComponent={Slide}
                        >
                            <Alert onClose={handleClose} severity={severidade}>
                                {message}
                            </Alert>
                        </Snackbar>
                        <Box mb={4}>
                            <Typography variant="h5">
                                Mobilidade Urbana de Viseu
                            </Typography>
                        </Box>
                        <Formik
                            onSubmit={onFormikSubmit}
                            validateOnBlur={false}
                            validateOnChange={false}
                            initialValues={{
                                email: '',
                                password: '',
                                remember: false,
                            }}
                        >
                            {({
                                isSubmitting,
                                submitForm,
                                isValid,
                                validateField,
                                values,
                            }) => {
                                return (
                                    <>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            submitForm()
                                        }}
                                        >
                                            <Box mb={4}>
                                                <Field
                                                    name="email"
                                                    validate={(email) => (validator.isEmail(email) ? undefined : 'Email inválido')}
                                                >
                                                    {({ field, form: { errors } }) => (
                                                        <TextField
                                                            {...field}
                                                            required
                                                            fullWidth
                                                            label="E-Mail"
                                                            type="email"
                                                            error={Boolean(errors.email)}
                                                            helperText={errors.email}
                                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                                        />
                                                    )}
                                                </Field>
                                            </Box>
                                            <Box mb={4}>
                                                <Field
                                                    name="password"
                                                    validate={(password) => (password !== '' ? undefined : 'Password inválida')}
                                                >
                                                    {({ field, form: { errors } }) => (
                                                        <TextField
                                                            {...field}
                                                            required
                                                            fullWidth
                                                            label="Palavra-Passe"
                                                            type="password"
                                                            error={Boolean(errors.password)}
                                                            helperText={errors.password}
                                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                                        />
                                                    )}
                                                </Field>
                                            </Box>

                                            <Box
                                                component="span"
                                                display="block"
                                            >
                                                <Field name="remember">
                                                    {({ field }) => (

                                                        <FormControlLabel
                                                            label={(
                                                                <Typography color="textSecondary">
                                                                    Lembrar
                                                                </Typography>
                                                            )}
                                                            control={(
                                                                <GoldCheckbox
                                                                    {...field}
                                                                    checked={values.remember}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                            </Box>
                                            <Box
                                                component="span"
                                                display="block"
                                            >
                                                <Link color="textSecondary" component={RouterLink} to="/">
                                                    Esqueceu a palavra-passe?
                                                </Link>
                                            </Box>

                                            <Box my={4}>
                                                <StyledButton
                                                    type="submit"
                                                    disabled={!isValid || isSubmitting}
                                                    onClick={submitForm}
                                                >
                                                    {isSubmitting && (<CircularProgress color="inherit" />)}
                                                    {!isSubmitting && 'Login'}
                                                </StyledButton>
                                            </Box>
                                        </form>
                                    </>
                                )
                            }}
                        </Formik>
                    </Box>
                </Grid>
            </Box>
        </>
    )
}
