import {
    Grid,
    TextField,
} from '@material-ui/core'
import { Field, useFormikContext } from 'formik'
import { Autocomplete } from '@material-ui/lab'
import validator from 'validator'
import React from 'react'

import { useStyles } from './MuiStyles'

export const FormRegistarViatura = ({
    modelos, cores, seguradoras,
}) => {
    const classes = useStyles()
    const {
        setFieldValue, validateField,
    } = useFormikContext()

    return (
        <>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="matricula"
                    validate={(matricula) => (/^(([A-Z]{2}-\d{2}-(\d|[A-Z]){2})|(\d{2}-(\d{2}-[A-Z]{2}|[A-Z]{2}-\d{2})))$/.test(matricula) ? undefined : 'Campo inválido')}
                >
                    {({ field, form: { errors } }) => (
                        <TextField
                            {...field}
                            required
                            fullWidth
                            label="Matrícula"
                            variant="outlined"
                            className={classes.textField}
                            error={Boolean(errors.matricula)}
                            helperText={errors.matricula}
                            onBlur={(event) => validateField(event.currentTarget.name)}
                            onChange={(event) => setFieldValue(event.currentTarget.name, event.target.value.toUpperCase())}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="ano"
                    validate={(ano) => (/^\d{4}$/.test(ano) ? undefined : 'Campo inválido')}
                >
                    {({ field, form: { errors } }) => (
                        <TextField
                            {...field}
                            required
                            fullWidth
                            label="Ano"
                            variant="outlined"
                            className={classes.textField}
                            error={Boolean(errors.ano)}
                            helperText={errors.ano}
                            onBlur={(event) => validateField(event.currentTarget.name)}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="capacidade"
                    validate={(capacidade) => (validator.isInt(capacidade) ? undefined : 'Campo inválido')}
                >
                    {({ field, form: { errors } }) => (
                        <TextField
                            {...field}
                            required
                            fullWidth
                            label="Capacidade"
                            variant="outlined"
                            className={classes.textField}
                            error={Boolean(errors.capacidade)}
                            helperText={errors.capacidade}
                            onBlur={(event) => validateField(event.currentTarget.name)}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="modelo"
                    validate={(modelo) => (modelo !== 0 ? undefined : 'Campo obrigatório')}
                >
                    {({ field, form: { errors } }) => (
                        <Autocomplete
                            id="modelo"
                            options={modelos}
                            getOptionLabel={(option) => {
                                if (!option.NOME_MODELO) {
                                    return ''
                                }
                                return `${option.Marca.NOME_MARCA} ${option.NOME_MODELO}`
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...field}
                                    {...params}
                                    required
                                    autoComplete="off"
                                    label="Modelo"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.modelo)}
                                    helperText={errors.modelo}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                    onChange={undefined}
                                />
                            )}
                            onChange={(event, newValue, reason) => {
                                if (reason === 'select-option') {
                                    setFieldValue('modelo', newValue.NR_MODELO)
                                } else if (reason === 'clear') {
                                    setFieldValue('modelo', 0)
                                }
                            }}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="cor"
                    validate={(cor) => (cor !== 0 ? undefined : 'Campo obrigatório')}
                >
                    {({ field, form: { errors } }) => (
                        <Autocomplete
                            id="cor"
                            options={cores}
                            getOptionLabel={(option) => {
                                if (!option.NOME_COR) {
                                    return ''
                                }
                                return option.NOME_COR
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...field}
                                    {...params}
                                    required
                                    autoComplete="off"
                                    label="Cor"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.cor)}
                                    helperText={errors.cor}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                    onChange={undefined}
                                />
                            )}
                            onChange={(event, newValue, reason) => {
                                if (reason === 'select-option') {
                                    setFieldValue('cor', newValue.NR_COR)
                                } else if (reason === 'clear') {
                                    setFieldValue('cor', 0)
                                }
                            }}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="apolice"
                    validate={(apolice) => (validator.isInt(apolice) ? undefined : 'Campo inválido')}
                >
                    {({ field, form: { errors } }) => (
                        <TextField
                            {...field}
                            required
                            fullWidth
                            label="# Apólice"
                            variant="outlined"
                            className={classes.textField}
                            error={Boolean(errors.apolice)}
                            helperText={errors.apolice}
                            onBlur={(event) => validateField(event.currentTarget.name)}
                        />
                    )}
                </Field>
            </Grid>
            <Grid item lg={4} md={5} sm={6} xs={12}>
                <Field
                    name="seguradora"
                    validate={(seguradora) => (seguradora !== 0 ? undefined : 'Campo obrigatório')}
                >
                    {({ field, form: { errors } }) => (
                        <Autocomplete
                            id="seguradora"
                            options={seguradoras}
                            getOptionLabel={(option) => {
                                if (!option.NOME_SEGURADORA) {
                                    return ''
                                }
                                return option.NOME_SEGURADORA
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...field}
                                    {...params}
                                    required
                                    autoComplete="off"
                                    label="Seguradora"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.seguradora)}
                                    helperText={errors.seguradora}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                    onChange={undefined}
                                />
                            )}
                            onChange={(event, newValue, reason) => {
                                if (reason === 'select-option') {
                                    setFieldValue('seguradora', newValue.NR_SEGURADORA)
                                } else if (reason === 'clear') {
                                    setFieldValue('seguradora', 0)
                                }
                            }}
                        />
                    )}
                </Field>
            </Grid>
        </>
    )
}
