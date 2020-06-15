import {
    Box, Button, CircularProgress,
    FormControlLabel,
    Grid,
    MenuItem,
    Switch,
    TextField,
} from '@material-ui/core'
import { Field, useFormikContext } from 'formik'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../configs'
import authHeader from './auth-header'
import { validateNCC } from './functions'

export const FormRegistarViagem = ({
    classes, localidades, motoristas, distDur, callbackOrigem, callbackDestino,
}) => {
    const {
        setFieldValue, values, isValid, isSubmitting, submitForm, validateField,
    } = useFormikContext()

    const [idaVoltaSwitch, setIdaVoltaSwitch] = useState(true)
    const [idaVolta, setIdaVolta] = useState(false)
    const [numerosccs, setNumeroscc] = useState([])
    const [loading, setLoading] = useState(false)
    const [prefix, setPrefix] = useState('')

    const handleChangeIdaVolta = (event) => {
        setIdaVolta(event.target.checked)
    }

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => option.N_CC,
    })

    useEffect(() => {
        setFieldValue('distancia', distDur.distanciaValue)
    }, [setFieldValue, distDur.distanciaValue])

    useEffect(() => {
        if (values.ncc.length === 5 && values.ncc !== prefix) {
            setLoading(true)
            setPrefix(values.ncc)
            axios
                .post(backendUrl + 'user/listarncc', { cc: values.ncc }, { headers: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        setLoading(false)
                        setNumeroscc(res.data.data)
                    }
                })
        }
    }, [values.ncc, prefix])

    return (
        <Box mb={2}>
            <Grid container spacing={4}>
                <Grid item md={6} sm={12} xs={12}>
                    <Field name="origem"
                        validate={(origem) => origem !== 0 ? undefined : 'Campo obrigatório'}>
                        {({ field, form: { errors } }) => (
                            <Autocomplete
                                id="origem"
                                options={localidades}
                                getOptionLabel={option => {
                                    if (!option.LOCALIDADE) {
                                        return ''
                                    }
                                    return option.LOCALIDADE
                                }}
                                getOptionDisabled={(option) => option.NR_LOCALIDADE === values.destino}
                                renderInput={(params) =>
                                    <TextField {...field} {...params} required
                                        label="Origem" variant="outlined"
                                        className={classes.textField}
                                        error={Boolean(errors.origem)}
                                        helperText={errors.origem}
                                        onBlur={(event) => validateField(event.currentTarget.name)}
                                    />
                                }
                                onChange={(event, newValue, reason) => {
                                    if (reason === 'select-option') {
                                        setFieldValue('origem', newValue.NR_LOCALIDADE)
                                        callbackOrigem(newValue)
                                    }
                                }}
                            />
                        )}
                    </Field>
                    <Field name="destino"
                        validate={(destino) => destino !== 0 ? undefined : 'Campo obrigatório'}>
                        {({ field, form: { errors } }) => (
                            <Autocomplete
                                id="destino"
                                options={localidades}
                                getOptionLabel={option => {
                                    if (!option.LOCALIDADE) {
                                        return ''
                                    }
                                    return option.LOCALIDADE
                                }}
                                getOptionDisabled={(option) => option.NR_LOCALIDADE === values.origem}
                                renderInput={(params) =>
                                    <TextField {...field} {...params} required
                                        label="Destino"
                                        variant="outlined"
                                        className={classes.textField}
                                        helperText={errors.destino}
                                        error={Boolean(errors.destino)}
                                        onBlur={(event) => validateField(event.currentTarget.name)}
                                    />
                                }
                                onChange={(event, newValue, reason) => {
                                    if (reason === 'select-option') {
                                        setFieldValue('destino', newValue.NR_LOCALIDADE)
                                        callbackDestino(newValue)
                                    }
                                }}
                            />
                        )}
                    </Field>
                    <Field name="passageiros"
                        validate={(passageiros) => passageiros !== '' ? undefined : 'Campo obrigatório'}>
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth
                                id="passageiros" select
                                label="Passageiros"
                                placeholder={'Passageiros'}
                                variant="outlined"
                                className={classes.textField}
                                helperText={errors.passageiros}
                                error={Boolean(errors.passageiros)}
                                onBlur={(event) => validateField(event.target.name)}
                            >
                                <MenuItem key="1" value="1">1</MenuItem>
                                <MenuItem key="2" value="2">2</MenuItem>
                                <MenuItem key="3" value="3">3</MenuItem>
                                <MenuItem key="4" value="4">4 ou mais</MenuItem>
                            </TextField>
                        )}
                    </Field>
                    <Field name="motivo"
                        validate={(motivo) => motivo !== '' ? undefined : 'Campo obrigatório'}>
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="motivo"
                                select
                                label="Motivo"
                                placeholder={'Motivo'}
                                variant="outlined"
                                className={classes.textField}
                                error={Boolean(errors.motivo)}
                                helperText={errors.motivo}
                                onBlur={(event) => validateField(event.target.name)}
                            >
                                <MenuItem key="1" value="L">Lazer</MenuItem>
                                <MenuItem key="2" value="T">Trabalho</MenuItem>
                                <MenuItem key="3" value="SNU">Saúde Não
                                    Urgente</MenuItem>
                            </TextField>
                        )}
                    </Field>
                    <MuiPickersUtilsProvider libInstance={moment}
                        utils={MomentUtils}
                        locale={'pt'}>
                        <Field name="datahora_ida"
                            validate={(datahora_ida) => {
                                if(!datahora_ida) {
                                    return 'Campo obrigatório'
                                }
                                if(moment(datahora_ida).isSameOrAfter(values.datahora_volta)) {
                                    return 'Hora inválida (igual/inferior hora ida)'
                                }
                                if(values.datahora_volta && moment(values.datahora_volta).diff(datahora_ida, 'minutes') < 30) {
                                    return 'Hora inválida (+30 minutos diferença)'
                                }
                                return undefined
                            }}>
                            {({ field, form: { errors } }) => (
                                <DateTimePicker {...field} required disablePast
                                    minDate={moment().isBefore(moment({ hour: 17, minute: 0, seconds: 0 })) ? moment().add(1, 'day') : moment().add(2, 'day')}
                                    maxDate={values.datahora_volta ? values.datahora_volta : moment('2100-01-01')}
                                    fullWidth ampm={false}
                                    openTo="day"
                                    id="datahora_ida"
                                    format="YYYY-MM-DD HH:mm"
                                    label="Data e Hora - Ida"
                                    views={['date', 'month', 'hours', 'minutes']}
                                    placeholder={'Data e Hora - Ida'}
                                    margin={'normal'}
                                    inputVariant="outlined"
                                    helperText={errors.datahora_ida}
                                    onChange={(value) => {
                                        setIdaVoltaSwitch(false)
                                        setFieldValue('datahora_ida', value.format('YYYY-MM-DD HH:mm'))
                                        if(!idaVoltaSwitch) {
                                            if (!values.datahora_volta) {
                                                errors.datahora_volta = 'Campo obrigatório'
                                            } else if (moment(values.datahora_volta).isSameOrBefore(value.format('YYYY-MM-DD HH:mm'))) {
                                                errors.datahora_volta = 'Hora inválida (igual/inferior hora ida)'
                                            } else if (moment(values.datahora_volta).diff(value.format('YYYY-MM-DD HH:mm'), 'minutes') < 30) {
                                                errors.datahora_volta = 'Hora inválida (+30 minutos diferença)'
                                            } else {
                                                errors.datahora_volta = undefined
                                            }
                                        }
                                    }}
                                    className={classes.textField}
                                    error={Boolean(errors.datahora_ida)}
                                    onBlur={(event) => validateField(event.target.name)}
                                />
                            )}
                        </Field>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={idaVolta}
                                    disabled={idaVoltaSwitch}
                                    onChange={handleChangeIdaVolta}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            className={classes.textField}
                            label="Ida e volta?"
                        />
                        <Field name="datahora_volta"
                            validate={(datahora_volta) => {
                                if(!datahora_volta) {
                                    return 'Campo obrigatório'
                                }
                                if(moment(datahora_volta).isSameOrBefore(values.datahora_ida)) {
                                    return 'Hora inválida (igual/inferior hora ida)'
                                }
                                if(moment(datahora_volta).diff(values.datahora_ida, 'minutes') < 30) {
                                    return 'Hora inválida (+30 minutos diferença)'
                                }
                                return undefined
                            }}>
                            {({ field, form: { errors } }) => (
                                <DateTimePicker {...field} required={idaVolta}
                                    disablePast fullWidth
                                    minDate={moment(values.datahora_ida).format('YYYY-MM-DD HH:mm')}
                                    ampm={false}
                                    openTo="day"
                                    id="datahora_volta"
                                    format="YYYY-MM-DD HH:mm"
                                    label="Data e Hora - Volta"
                                    views={['date', 'month', 'hours', 'minutes']}
                                    placeholder={'Data e Hora - Volta'}
                                    margin={'normal'}
                                    inputVariant="outlined"
                                    helperText={errors.datahora_volta}
                                    onChange={(value) => {
                                        setFieldValue('datahora_volta', value.format('YYYY-MM-DD HH:mm'))
                                        if(moment(values.datahora_ida).isSameOrAfter(value)) {
                                            errors.datahora_ida = 'Hora inválida (igual/inferior hora ida)'
                                        } else if(value && moment(value).diff(values.datahora_ida, 'minutes') < 30) {
                                            errors.datahora_ida = 'Hora inválida (30 minutos diferença)'
                                        } else {
                                            errors.datahora_ida = undefined
                                        }
                                    }}
                                    className={clsx(classes.textField, {
                                        [classes.invisible]: !idaVolta,
                                    })}
                                    error={Boolean(errors.datahora_volta)}
                                    onBlur={(event) => validateField(event.target.name)}
                                />
                            )}
                        </Field>
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <Field name="ncc"
                        validate={(ncc) => validateNCC(ncc) ? undefined : 'NCC inválido'}>
                        {({ field, form: { errors } }) => (
                            <Autocomplete
                                id="ncc"
                                options={numerosccs}
                                getOptionLabel={option => {
                                    if (!option.N_CC) {
                                        return ''
                                    }
                                    return option.N_CC
                                }}
                                loading={loading}
                                loadingText={'A procurar...'}
                                noOptionsText={values.ncc.length < 5 ? 'Insira mais de 3 carateres...' : 'Não foram encontrados resultados.'}
                                renderInput={(params) =>
                                    <TextField {...field} {...params} required
                                        label="Número Cartão de Cidadão"
                                        variant="outlined"
                                        className={classes.textField}
                                        error={Boolean(errors.ncc)}
                                        onBlur={(event) => validateField(event.currentTarget.name)}
                                    />
                                }
                                onInputChange={(event, newValue, reason) => {
                                    if (reason === 'input') {
                                        if (newValue.length < 5) {
                                            setNumeroscc([])
                                            setPrefix('')
                                        }
                                        setFieldValue('ncc', newValue)
                                    } else if (reason === 'reset') {
                                        setNumeroscc([])
                                        setPrefix('')
                                        setFieldValue('ncc', '')
                                    }
                                }}
                                filterOptions={filterOptions}
                                onChange={(event, newValue, reason) => {
                                    if (reason === 'select-option') {
                                        setFieldValue('ncc', newValue.N_CC)
                                    } else if (reason === 'clear') {
                                        setNumeroscc([])
                                        setFieldValue('ncc', '')
                                    }
                                }}
                            />
                        )}
                    </Field>
                    <Field name="motorista"
                        validate={(passageiros) => passageiros !== 0 ? undefined : 'Campo obrigatório'}>
                        {({ field, form: { errors } }) => (
                            <Autocomplete
                                id="motorista"
                                options={motoristas}
                                getOptionLabel={option => {
                                    if (!option.NOME_UTILIZADOR) {
                                        return ''
                                    }
                                    return option.NOME_UTILIZADOR
                                }}
                                renderInput={(params) =>
                                    <TextField {...field} {...params} required
                                        label="Motorista"
                                        variant="outlined"
                                        className={classes.textField}
                                        error={Boolean(errors.motorista)}
                                        helperText={errors.motorista}
                                        onBlur={(event) => validateField(event.currentTarget.name)}
                                    />
                                }
                                onChange={(event, newValue, reason) => {
                                    if (reason === 'select-option') {
                                        console.log(newValue.NR_UTILIZADOR)
                                        setFieldValue('motorista', newValue.NR_UTILIZADOR)
                                    }
                                }}
                            />
                        )}
                    </Field>
                    <Field name="observacoes">
                        {({ field, form: { errors } }) => (
                            <TextField {...field}
                                id="observacoes"
                                label="Observações"
                                placeholder="Observações"
                                multiline fullWidth
                                rows={5}
                                variant="outlined"
                                className={classes.textField}
                            />
                        )}
                    </Field>
                    <TextField
                        id="dados"
                        label="Dados"
                        placeholder="Dados"
                        multiline fullWidth
                        rows={5}
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                        }}
                        className={clsx(classes.textField, {
                            [classes.invisible]: !distDur.isSet,
                        })}
                        value={'Distância (aprox.): ' + distDur.distanciaText + '\nTempo de viagem (aprox.): ' + distDur.duracaoText}
                    />
                    <div align={'right'}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                            className={classes.button2}
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting && (<CircularProgress
                                color={'inherit'}/>)}
                            {!isSubmitting && ('Concluir')}
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}
