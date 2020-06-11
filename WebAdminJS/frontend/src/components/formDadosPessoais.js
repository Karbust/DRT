/* eslint-disable react/prop-types */
import React from 'react'
import { Field, useFormikContext } from 'formik'
import {
    Box,
    Grid,
    MenuItem,
    TextField
} from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import MomentUtils from '@date-io/moment'

// eslint-disable-next-line react/prop-types
export const FormDadosPessoais = ({ classes }) => {
    const { setFieldValue } = useFormikContext()

    return (
        <Box ml={10} mr={10}>
            <Grid container spacing={4}>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="nome"
                        validate={(nome) => nome.length !== 0 ? undefined : 'Nome inválido'}>
                        {({ field, form: { errors, validateField } }) => (
                            <TextField {...field} required fullWidth id="nome"
                                type="text"
                                label="Nome Completo"
                                placeholder={'Nome Completo'}
                                variant="outlined" className={classes.textField}
                                error={Boolean(errors.nome)}
                                helperText={errors.nome}
                                onBlur={(event) => {
                                    validateField(event.currentTarget.name)
                                }}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <MuiPickersUtilsProvider libInstance={moment}
                        utils={MomentUtils} locale={'pt'}>
                        <Field name="datanascimento">
                            {({ field, form: { errors } }) => (
                                <DatePicker {...field} required disableFuture fullWidth
                                    openTo="year"
                                    id="datanascimento" format="YYYY-MM-DD"
                                    label="Data de Nascimento"
                                    views={['year', 'month', 'date']}
                                    placeholder={'Data de Nascimento'}
                                    margin={'normal'}
                                    inputVariant="outlined"
                                    onChange={(value) => {
                                        setFieldValue('datanascimento', value.format('YYYY-MM-DD'))
                                    }} className={classes.textField}/>
                            )}
                        </Field>
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="genero">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="genero" select
                                label="Género"
                                placeholder={'Género'} variant="outlined"
                                className={classes.textField}>
                                <MenuItem key="M" value="M">Masculino</MenuItem>
                                <MenuItem key="F" value="F">Feminino</MenuItem>
                                <MenuItem key="O" value="O">Outro</MenuItem>
                            </TextField>
                        )}
                    </Field>
                </Grid>

                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="ncc">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="ncc"
                                type="text"
                                label="Número do Cartão de Cidadão"
                                placeholder={'Número do Cartão de Cidadão'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="nss">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="nss"
                                type="text"
                                label="Número da Segurança Social"
                                placeholder={'Número da Segurança Social'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="nif">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="nif"
                                type="text"
                                label="Número de Identificação Fiscal"
                                placeholder={'Número de Identificação Fiscal'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>

                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="telemovel"
                        validate={(telemovel) => telemovel.length !== 0 ? undefined : 'Telemóvel inválido'}>
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="telemovel"
                                type="text"
                                label="Telemóvel" placeholder={'Telemóvel'}
                                variant="outlined"
                                className={classes.textField}
                                error={Boolean(errors.telemovel)}
                                helperText={errors.telemovel}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="telefone">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} fullWidth id="telefone" type="text"
                                label="Telefone"
                                placeholder={'Telefone'} variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="nacionalidade">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="nacionalidade"
                                type="text"
                                label="Nacionalidade"
                                placeholder={'Nacionalidade'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>

                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="morada">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="morada"
                                type="text" label="Morada"
                                placeholder={'Morada'} variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="codpostal">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="codpostal"
                                type="text"
                                label="Código Postal"
                                placeholder={'Código Postal'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="localidade">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="localidade"
                                type="text"
                                label="Localidade" placeholder={'Localidade'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
            </Grid>
        </Box>
    )
}
