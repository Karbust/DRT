import React from 'react'
import {
    Button, CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, TextField,
} from '@material-ui/core'
import { StyledButton, Transition, useStyles } from './MuiStyles'
import { Field, Formik } from 'formik'
import axios from 'axios'
import { backendUrl } from '../configs'
import authHeader from './auth-header'
import { Autocomplete } from '@material-ui/lab'

export const MiniFormAdicionarMarca= ({
    openMarca, handleCloseMarca, handleSubmitMarca
}) => {
    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(backendUrl + 'viaturas/adicionarmarca', values, { headers: authHeader() })
            .then((data) => {
                if(data.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    handleSubmitMarca(data.data.message, 'success')
                    handleCloseMarca()
                } else {
                    handleSubmitMarca(data.data.message, 'error')
                    handleCloseMarca()
                }
            })
            .catch(() => {
                handleSubmitMarca('Ocorreu um erro ao enviar o pedido para o servidor.', 'error')
                handleCloseMarca()
            })
    }

    return (
        <Dialog
            fullWidth
            open={openMarca}
            TransitionComponent={Transition}
            maxWidth="xs"
            onClose={handleCloseMarca}
            aria-labelledby="form-dialog-title-marca"
        >
            <DialogTitle id="form-dialog-title-marca">Adicionar Marca</DialogTitle>
            <Formik
                onSubmit={onFormikSubmit}
                validateOnBlur={true}
                validateOnChange={true}
                initialValues={{
                    nome_marca: ''
                }}
            >
                {({
                    submitForm,
                    isValid,
                    isSubmitting,
                    errors: formErrors,
                })=> {
                    return (
                        <DialogContent>
                            <DialogContentText>
                                Insira o nome da marca.
                            </DialogContentText>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                submitForm()
                            }}>
                                <Field name="nome_marca"
                                    validate={(nome_marca) => nome_marca !== '' ? undefined : 'Campo inválido'}>
                                    {({ field, form: { errors } }) => (
                                        <TextField {...field}
                                            required
                                            autoFocus
                                            fullWidth
                                            margin="dense"
                                            label="Nome da Marca"
                                            error={Boolean(errors.nome_marca)}
                                            helperText={errors.nome_marca}
                                        />
                                    )}
                                </Field>
                            </form>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseMarca}
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <StyledButton
                                    onClick={submitForm}
                                    autoFocus style={{ width: '115px' }}
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting && (
                                        <CircularProgress color={'inherit'}/>)}
                                    {!isSubmitting && 'Guardar'}
                                </StyledButton>
                            </DialogActions>
                        </DialogContent>
                    )
                }}
            </Formik>
        </Dialog>
    )
}
export const MiniFormAdicionarModelo= ({
    openModelo, handleCloseModelo, handleSubmitModelo, marcas
}) => {
    const classes = useStyles()

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(backendUrl + 'viaturas/adicionarmodelo', values, { headers: authHeader() })
            .then((data) => {
                if(data.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    handleSubmitModelo(data.data.message, 'success')
                    handleCloseModelo()
                } else {
                    handleSubmitModelo(data.data.message, 'error')
                    handleCloseModelo()
                }
            })
            .catch(() => {
                handleSubmitModelo('Ocorreu um erro ao enviar o pedido para o servidor.', 'error')
                handleCloseModelo()
            })
    }

    return (
        <Dialog
            fullWidth
            open={openModelo}
            TransitionComponent={Transition}
            maxWidth="sm"
            onClose={handleCloseModelo}
            aria-labelledby="form-dialog-title-modelo"
        >
            <DialogTitle id="form-dialog-title-modelo">Adicionar Modelo</DialogTitle>
            <Formik
                onSubmit={onFormikSubmit}
                validateOnBlur={true}
                validateOnChange={true}
                initialValues={{
                    marca: 0,
                    nome_modelo: ''
                }}
            >
                {({
                    submitForm,
                    isValid,
                    isSubmitting,
                    validateField,
                    setFieldValue,
                    errors: formErrors,
                })=> {
                    return (
                        <DialogContent>
                            <DialogContentText>
                                Selecione a marca e insira o nome do modelo.
                            </DialogContentText>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                submitForm()
                            }}>
                                <Grid container spacing={1}>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <Field name="marca"
                                            validate={(marca) => marca !== 0 ? undefined : 'Campo obrigatório'}>
                                            {({ field, form: { errors } }) => (
                                                <Autocomplete
                                                    id="marca"
                                                    options={marcas}
                                                    getOptionLabel={option => {
                                                        if (!option.NOME_MARCA) {
                                                            return ''
                                                        }
                                                        return option.NOME_MARCA
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField {...field} {...params} required
                                                            autoComplete="off"
                                                            label="Marca" variant="outlined"
                                                            className={classes.textField}
                                                            error={Boolean(errors.marca)}
                                                            helperText={errors.marca}
                                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                                            onChange={undefined}
                                                        />
                                                    }
                                                    onChange={(event, newValue, reason) => {
                                                        if (reason === 'select-option') {
                                                            setFieldValue('marca', newValue.NR_MARCA)
                                                        } else if (reason === 'clear') {
                                                            setFieldValue('marca', 0)
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <Field name="nome_modelo"
                                            validate={(nome_modelo) => nome_modelo !== '' ? undefined : 'Campo inválido'}>
                                            {({ field, form: { errors } }) => (
                                                <TextField {...field}
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    label="Nome do Modelo"
                                                    error={Boolean(errors.nome_modelo)}
                                                    helperText={errors.nome_modelo}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                </Grid>
                            </form>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseModelo}
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <StyledButton
                                    onClick={submitForm}
                                    autoFocus style={{ width: '115px' }}
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting && (
                                        <CircularProgress color={'inherit'}/>)}
                                    {!isSubmitting && 'Guardar'}
                                </StyledButton>
                            </DialogActions>
                        </DialogContent>
                    )
                }}
            </Formik>
        </Dialog>
    )
}
export const MiniFormAdicionarCor= ({
    openCor, handleCloseCor, handleSubmitCor
}) => {
    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(backendUrl + 'viaturas/adicionarcor', values, { headers: authHeader() })
            .then((data) => {
                if(data.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    handleSubmitCor(data.data.message, 'success')
                    handleCloseCor()
                } else {
                    handleSubmitCor(data.data.message, 'error')
                    handleCloseCor()
                }
            })
            .catch(() => {
                handleSubmitCor('Ocorreu um erro ao enviar o pedido para o servidor.', 'error')
                handleCloseCor()
            })
    }

    return (
        <Dialog
            fullWidth
            open={openCor}
            TransitionComponent={Transition}
            maxWidth="xs"
            onClose={handleCloseCor}
            aria-labelledby="form-dialog-title-cor"
        >
            <DialogTitle id="form-dialog-title-cor">Adicionar Cor</DialogTitle>
            <Formik
                onSubmit={onFormikSubmit}
                validateOnBlur={true}
                validateOnChange={true}
                initialValues={{
                    nome_cor: ''
                }}
            >
                {({
                    submitForm,
                    isValid,
                    isSubmitting,
                    errors: formErrors,
                })=> {
                    return (
                        <DialogContent>
                            <DialogContentText>
                                Insira o nome da cor.
                            </DialogContentText>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                submitForm()
                            }}>
                                <Field name="nome_cor"
                                    validate={(nome_cor) => nome_cor !== '' ? undefined : 'Campo inválido'}>
                                    {({ field, form: { errors } }) => (
                                        <TextField {...field}
                                            required
                                            autoFocus
                                            fullWidth
                                            margin="dense"
                                            label="Nome da Cor"
                                            error={Boolean(errors.nome_cor)}
                                            helperText={errors.nome_cor}
                                        />
                                    )}
                                </Field>
                            </form>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseCor}
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <StyledButton
                                    onClick={submitForm}
                                    autoFocus style={{ width: '115px' }}
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting && (
                                        <CircularProgress color={'inherit'}/>)}
                                    {!isSubmitting && 'Guardar'}
                                </StyledButton>
                            </DialogActions>
                        </DialogContent>
                    )
                }}
            </Formik>
        </Dialog>
    )
}
export const MiniFormAdicionarSeguradora = ({
    openSeguradora, handleCloseSeguradora, handleSubmitSeguradora
}) => {
    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        return axios
            .post(backendUrl + 'viaturas/adicionarseguradora', values, { headers: authHeader() })
            .then((data) => {
                if(data.data.success) {
                    formikActions.setSubmitting(false)
                    formikActions.resetForm()
                    handleSubmitSeguradora(data.data.message, 'success')
                    handleCloseSeguradora()
                } else {
                    handleSubmitSeguradora(data.data.message, 'error')
                    handleCloseSeguradora()
                }
            })
            .catch(() => {
                handleSubmitSeguradora('Ocorreu um erro ao enviar o pedido para o servidor.', 'error')
                handleCloseSeguradora()
            })
    }

    return (
        <Dialog
            fullWidth
            open={openSeguradora}
            TransitionComponent={Transition}
            maxWidth="xs"
            onClose={handleCloseSeguradora}
            aria-labelledby="form-dialog-title-seguradora"
        >
            <DialogTitle id="form-dialog-title-seguradora">Adicionar Seguradora</DialogTitle>
            <Formik
                onSubmit={onFormikSubmit}
                validateOnBlur={true}
                validateOnChange={true}
                initialValues={{
                    nome_seguradora: ''
                }}
            >
                {({
                    submitForm,
                    isValid,
                    isSubmitting,
                    errors: formErrors,
                })=> {
                    return (
                        <DialogContent>
                            <DialogContentText>
                                Insira o nome da seguradora.
                            </DialogContentText>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                submitForm()
                            }}>
                                <Field name="nome_seguradora"
                                    validate={(nome_seguradora) => nome_seguradora !== '' ? undefined : 'Campo inválido'}>
                                    {({ field, form: { errors } }) => (
                                        <TextField {...field}
                                            required
                                            autoFocus
                                            fullWidth
                                            margin="dense"
                                            label="Nome da Seguradora"
                                            error={Boolean(errors.nome_seguradora)}
                                            helperText={errors.nome_seguradora}
                                        />
                                    )}
                                </Field>
                            </form>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseSeguradora}
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <StyledButton
                                    onClick={submitForm}
                                    autoFocus style={{ width: '115px' }}
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting && (
                                        <CircularProgress color={'inherit'}/>)}
                                    {!isSubmitting && 'Guardar'}
                                </StyledButton>
                            </DialogActions>
                        </DialogContent>
                    )
                }}
            </Formik>
        </Dialog>
    )
}
