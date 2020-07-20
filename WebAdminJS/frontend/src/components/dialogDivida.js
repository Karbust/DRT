import axios from 'axios'
import { backendUrl } from '../configs'
import authHeader from './auth-header'
import {
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, MenuItem,
    TextField
} from '@material-ui/core'
import { StyledButton, Transition } from './MuiStyles'
import { Field, Formik } from 'formik'
import React from 'react'

export const DialogDivida = ({
    openDivida, handleCloseDivida, handleSubmitDivida, currentDivida
}) => {
    const onFormikSubmit = (values, formikActions) => {
        return axios
            .post(`${backendUrl}viagens/atualizarestadopagamentoviagem`, values, { headers: authHeader() })
            .then((data) => {
                if (data.data.success) {
                    formikActions.resetForm()
                    handleSubmitDivida(data.data.message, 'success')
                    handleCloseDivida()
                } else {
                    handleSubmitDivida(data.data.message, 'error')
                    handleCloseDivida()
                }
            })
            .catch(() => {
                handleSubmitDivida('Ocorreu um erro ao enviar o pedido para o servidor.', 'error')
                handleCloseDivida()
            })
    }

    return (
        <Dialog
            fullWidth
            open={openDivida}
            TransitionComponent={Transition}
            maxWidth="xs"
            onClose={handleCloseDivida}
            aria-labelledby="form-dialog-title-marca"
        >
            <DialogTitle id="form-dialog-title-marca">Editar Dívida</DialogTitle>
            <Formik
                onSubmit={onFormikSubmit}
                validateOnBlur
                validateOnChange
                initialValues={{
                    nr_viagem: currentDivida.NR_VIAGEM,
                    nr_cliente: currentDivida.NR_CLIENTE,
                    estado: currentDivida.ESTADO_PAGAMENTO
                }}
            >
                {({
                    submitForm,
                    isValid,
                    isSubmitting,
                    initialValues
                }) => {
                    return (
                        <DialogContent>
                            <DialogContentText>
                                Selecione o novo estado.
                            </DialogContentText>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                submitForm()
                            }}
                            >
                                <Field
                                    name="estado"
                                    validate={(estado) => (estado !== '' ? undefined : 'Campo inválido')}
                                >
                                    {({ field, form: { errors } }) => (
                                        <TextField
                                            {...field}
                                            required
                                            autoFocus
                                            fullWidth
                                            select
                                            margin="dense"
                                            label="Estado"
                                            error={Boolean(errors.estado)}
                                            helperText={errors.estado}
                                        >
                                            <MenuItem key="PENDENTE" value="PENDENTE" disabled={(currentDivida.ESTADO_PAGAMENTO === 'RECEBIDO' || currentDivida.ESTADO_PAGAMENTO === 'CONFIRMADO')}>PENDENTE</MenuItem>
                                            <MenuItem key="RECEBIDO" value="RECEBIDO">RECEBIDO</MenuItem>
                                            <MenuItem key="CONFIRMADO" value="CONFIRMADO">CONFIRMADO</MenuItem>
                                        </TextField>
                                    )}
                                </Field>
                            </form>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseDivida}
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <StyledButton
                                    onClick={submitForm}
                                    autoFocus
                                    style={{ width: '115px' }}
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting && (
                                        <CircularProgress color="inherit" />)}
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
