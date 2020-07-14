import {
    Box,
    FormControlLabel,
    Grid,
    MenuItem,
    Switch,
    TextField,
} from '@material-ui/core'
import { Field, useFormikContext } from 'formik'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Autocomplete } from '@material-ui/lab'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import {
    DistanceMatrixService,
    LoadScript,
} from '@react-google-maps/api'

import { GoogleMapsApiKey } from '../configs'

import { useStyles } from './MuiStyles'
import { getUrl } from './functions'

export const FormPedidosViagem = ({
    setMessage, setSeveridade, setOpenAlert, currentViagem,
}) => {
    const classes = useStyles()
    const {
        setFieldValue, values, validateField,
    } = useFormikContext()

    const [localidades, setLocalidades] = useState([])
    const [motoristas, setMotoristas] = useState([])
    const [viaturas, setViaturas] = useState([])
    const [idaVoltaSwitch, setIdaVoltaSwitch] = useState(!values.datahora_ida)
    const [idaVolta, setIdaVolta] = useState(!!values.datahora_volta)
    const [origem, setOrigem] = useState(currentViagem.viagem.Origem)
    const [destino, setDestino] = useState(currentViagem.viagem.Destino)
    const [response, setResponse] = useState(null)
    const [recalcular, setRecalcular] = useState(false)
    const [distDur, setDistDur] = useState({
        isSet: true,
        duracaoText: `${(values.duracao / 60).toFixed(0)} min`,
        distanciaText: `${(values.distancia / 1000).toFixed(2)} Km`,
        duracaoValue: values.duracao,
        distanciaValue: values.distancia,
    })

    useEffect(() => {
        if (destino !== null || origem !== null) {
            setResponse(null)
        }
    }, [destino, origem])

    const directionsCallback = (result, status) => {
        if (status === 'OK' && response === null) {
            const { duration, distance } = result.rows[0].elements[0]
            setDistDur({
                isSet: true,
                duracaoText: duration.text,
                distanciaText: distance.text,
                duracaoValue: duration.value,
                distanciaValue: distance.value,
            })
            setRecalcular(false)
            setResponse(result)
        }
    }

    const handleChangeOrigem = (event) => {
        if (origem !== null) {
            if (event.NR_LOCALIDADE !== origem.NR_LOCALIDADE) {
                setOrigem(event)
                setRecalcular(true)
            }
        } else {
            setOrigem(event)
        }
    }
    const handleChangeDestino = (event) => {
        if (destino !== null) {
            if (event.NR_LOCALIDADE !== destino.NR_LOCALIDADE) {
                setDestino(event)
                setRecalcular(true)
            }
        } else {
            setDestino(event)
        }
    }

    const handleChangeIdaVolta = (event) => {
        setIdaVolta(event.target.checked)
    }

    useEffect(() => {
        Promise.all([
            getUrl('api/localidades'),
            getUrl('user/motoristas'),
            getUrl('viaturas/viaturas'),
        ]).then((data) => {
            const objLocalidades = data[0]
            const objMotoristas = data[1]
            const objViaturas = data[2]

            if (objLocalidades.data.success) {
                setLocalidades(objLocalidades.data.data)
            } else {
                throw new Error(objLocalidades.data.message)
            }

            if (objMotoristas.data.success) {
                setMotoristas(objMotoristas.data.data)
            } else {
                throw new Error(objMotoristas.data.message)
            }

            if (objViaturas.data.success) {
                setViaturas(objViaturas.data.data)
            } else {
                throw new Error(objViaturas.data.message)
            }
        }).catch((error) => {
            setMessage(error.message)
            setSeveridade('error')
            setOpenAlert(true)
        })
    }, [setMessage, setSeveridade, setOpenAlert])

    return (
        <>
            <Box mb={2}>
                <Grid container spacing={4}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Field
                            name="origem"
                            validate={(origemField) => {
                                return origemField !== 0 ? undefined : 'Campo obrigatório'
                            }}
                        >
                            {({ field, form: { errors } }) => (
                                <Autocomplete
                                    id="origem"
                                    options={localidades}
                                    getOptionLabel={(option) => {
                                        if (!option.LOCALIDADE) {
                                            return ''
                                        }
                                        return option.LOCALIDADE
                                    }}
                                    defaultValue={currentViagem.viagem.Origem}
                                    getOptionDisabled={(option) => option.NR_LOCALIDADE === values.destino}
                                    renderInput={(params) => (
                                        <TextField
                                            {...field}
                                            {...params}
                                            required
                                            autoComplete="off"
                                            label="Origem"
                                            variant="outlined"
                                            className={classes.textField}
                                            error={Boolean(errors.origem)}
                                            helperText={errors.origem}
                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                            onChange={undefined}
                                        />
                                    )}
                                    onChange={(event, newValue, reason) => {
                                        if (reason === 'select-option') {
                                            setFieldValue('origem', newValue.NR_LOCALIDADE)
                                            handleChangeOrigem(newValue)
                                        } else if (reason === 'clear') {
                                            setFieldValue('origem', 0)
                                        }
                                    }}
                                />
                            )}
                        </Field>
                        <Field
                            name="destino"
                            validate={(destinoField) => {
                                return destinoField !== 0 ? undefined : 'Campo obrigatório'
                            }}
                        >
                            {({ field, form: { errors } }) => (
                                <Autocomplete
                                    id="destino"
                                    options={localidades}
                                    getOptionLabel={(option) => {
                                        if (!option.LOCALIDADE) {
                                            return ''
                                        }
                                        return option.LOCALIDADE
                                    }}
                                    defaultValue={currentViagem.viagem.Destino}
                                    getOptionDisabled={(option) => option.NR_LOCALIDADE === values.destino}
                                    renderInput={(params) => (
                                        <TextField
                                            {...field}
                                            {...params}
                                            required
                                            autoComplete="off"
                                            label="Destino"
                                            variant="outlined"
                                            className={classes.textField}
                                            helperText={errors.destino}
                                            error={Boolean(errors.destino)}
                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                            onChange={undefined}
                                        />
                                    )}
                                    onChange={(event, newValue, reason) => {
                                        if (reason === 'select-option') {
                                            setFieldValue('destino', newValue.NR_LOCALIDADE)
                                            handleChangeDestino(newValue)
                                        } else if (reason === 'clear') {
                                            setFieldValue('destino', 0)
                                        }
                                    }}
                                />
                            )}
                        </Field>
                        <Field
                            name="passageiros"
                            validate={(passageiros) => (passageiros !== '' ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    id="passageiros"
                                    select
                                    label="Passageiros"
                                    placeholder="Passageiros"
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
                        <Field
                            name="motivo"
                            validate={(motivo) => (motivo !== '' ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    id="motivo"
                                    select
                                    label="Motivo"
                                    placeholder="Motivo"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.motivo)}
                                    helperText={errors.motivo}
                                    onBlur={(event) => validateField(event.target.name)}
                                >
                                    <MenuItem key="1" value="L">Lazer</MenuItem>
                                    <MenuItem key="2" value="T">Trabalho</MenuItem>
                                    <MenuItem key="3" value="SNU">
                                        Saúde Não
                                        Urgente
                                    </MenuItem>
                                </TextField>
                            )}
                        </Field>
                        <MuiPickersUtilsProvider
                            libInstance={moment}
                            utils={MomentUtils}
                            locale="pt"
                        >
                            <Field
                                name="datahora_ida"
                                validate={(datahora_ida) => {
                                    if (!datahora_ida) {
                                        return 'Campo obrigatório'
                                    }
                                    if (moment(datahora_ida).isSameOrAfter(values.datahora_volta)) {
                                        return 'Hora inválida (igual/inferior hora ida)'
                                    }
                                    if (values.datahora_volta && moment(values.datahora_volta).diff(datahora_ida, 'minutes') < 30) {
                                        return 'Hora inválida (+30 minutos diferença)'
                                    }
                                    return undefined
                                }}
                            >
                                {({ field, form: { errors } }) => (
                                    <DateTimePicker
                                        {...field}
                                        required
                                        disablePast
                                        minDate={moment().isBefore(moment({ hour: 17, minute: 0, seconds: 0 })) ? moment().add(1, 'day') : moment().add(2, 'day')}
                                        maxDate={values.datahora_volta ? values.datahora_volta : moment('2100-01-01')}
                                        fullWidth
                                        ampm={false}
                                        openTo="day"
                                        id="datahora_ida"
                                        format="YYYY-MM-DD HH:mm"
                                        label="Data e Hora - Ida"
                                        views={['date', 'month', 'hours', 'minutes']}
                                        placeholder="Data e Hora - Ida"
                                        margin="normal"
                                        inputVariant="outlined"
                                        helperText={errors.datahora_ida}
                                        onChange={(value) => {
                                            setIdaVoltaSwitch(false)
                                            setFieldValue('datahora_ida', value.format('YYYY-MM-DD HH:mm'))
                                            if (!idaVoltaSwitch) {
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
                                control={(
                                    <Switch
                                        checked={idaVolta}
                                        disabled={idaVoltaSwitch}
                                        onChange={handleChangeIdaVolta}
                                        name="checkedB"
                                        color="primary"
                                    />
                                )}
                                className={classes.textField}
                                label="Ida e volta?"
                            />
                            <Field
                                name="datahora_volta"
                                validate={(datahora_volta) => {
                                    if (!datahora_volta && idaVolta) {
                                        return 'Campo obrigatório'
                                    }
                                    if (moment(datahora_volta).isSameOrBefore(values.datahora_ida)) {
                                        return 'Hora inválida (igual/inferior hora ida)'
                                    }
                                    if (moment(datahora_volta).diff(values.datahora_ida, 'minutes') < 30) {
                                        return 'Hora inválida (+30 minutos diferença)'
                                    }
                                    return undefined
                                }}
                            >
                                {({ field, form: { errors } }) => (
                                    <DateTimePicker
                                        {...field}
                                        required={idaVolta}
                                        disablePast
                                        fullWidth
                                        minDate={moment(values.datahora_ida).format('YYYY-MM-DD HH:mm')}
                                        ampm={false}
                                        openTo="day"
                                        id="datahora_volta"
                                        format="YYYY-MM-DD HH:mm"
                                        label="Data e Hora - Volta"
                                        views={['date', 'month', 'hours', 'minutes']}
                                        placeholder="Data e Hora - Volta"
                                        margin="normal"
                                        inputVariant="outlined"
                                        helperText={errors.datahora_volta}
                                        onChange={(value) => {
                                            setFieldValue('datahora_volta', value.format('YYYY-MM-DD HH:mm'))
                                            if (moment(values.datahora_ida).isSameOrAfter(value)) {
                                                errors.datahora_ida = 'Hora inválida (igual/inferior hora ida)'
                                            } else if (value && moment(value).diff(values.datahora_ida, 'minutes') < 30) {
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
                        <Field
                            name="nrcliente"
                            validate={(nrcliente) => (nrcliente ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Número Cliente"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.nrcliente)}
                                    helperText={errors.nrcliente}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        </Field>
                        <Field name="observacoes">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    id="observacoes"
                                    label="Observações"
                                    placeholder="Observações"
                                    multiline
                                    fullWidth
                                    rows={5}
                                    variant="outlined"
                                    className={classes.textField}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        </Field>

                        <Field
                            name="motorista"
                            validate={(motorista) => (motorista !== 0 ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <Autocomplete
                                    id="motorista"
                                    options={motoristas}
                                    getOptionLabel={(option) => {
                                        if (!option.NOME_UTILIZADOR) {
                                            return ''
                                        }
                                        return option.NOME_UTILIZADOR
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...field}
                                            {...params}
                                            required
                                            label="Motorista"
                                            variant="outlined"
                                            className={classes.textField}
                                            error={Boolean(errors.motorista)}
                                            helperText={errors.motorista}
                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                        />
                                    )}
                                    onChange={(event, newValue, reason) => {
                                        if (reason === 'select-option') {
                                            setFieldValue('motorista', newValue.NR_UTILIZADOR)
                                        }
                                    }}
                                />
                            )}
                        </Field>

                        <Field
                            name="viatura"
                            validate={(viatura) => (viatura !== 0 ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <Autocomplete
                                    id="viatura"
                                    options={viaturas}
                                    getOptionLabel={(option) => {
                                        if (!option.MATRICULA) {
                                            return ''
                                        }
                                        return option.MATRICULA
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...field}
                                            {...params}
                                            required
                                            label="Viatura"
                                            variant="outlined"
                                            className={classes.textField}
                                            error={Boolean(errors.viatura)}
                                            helperText={errors.viatura}
                                            onBlur={(event) => validateField(event.currentTarget.name)}
                                        />
                                    )}
                                    onChange={(event, newValue, reason) => {
                                        if (reason === 'select-option') {
                                            setFieldValue('viatura', newValue.NR_VIATURA)
                                        }
                                    }}
                                />
                            )}
                        </Field>

                        <Field
                            name="custo"
                            validate={(custo) => (custo ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Custo"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.custo)}
                                    helperText={errors.custo}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                />
                            )}
                        </Field>
                        <Field
                            name="comparticipacao"
                            validate={(comparticipacao) => (comparticipacao ? undefined : 'Campo obrigatório')}
                        >
                            {({ field, form: { errors } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Comparticipação CMV"
                                    variant="outlined"
                                    className={classes.textField}
                                    error={Boolean(errors.comparticipacao)}
                                    helperText={errors.comparticipacao}
                                    onBlur={(event) => validateField(event.currentTarget.name)}
                                />
                            )}
                        </Field>
                        <TextField
                            id="dados"
                            label="Dados"
                            placeholder="Dados"
                            multiline
                            fullWidth
                            rows={5}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            className={clsx(classes.textField, {
                                [classes.invisible]: !distDur.isSet,
                            })}
                            value={`Distância (aprox.): ${distDur.distanciaText}\nTempo de viagem (aprox.): ${distDur.duracaoText}`}
                        />
                    </Grid>
                </Grid>
            </Box>
            {
                recalcular !== false && (
                    <LoadScript
                        loadingElement={undefined}
                        googleMapsApiKey={GoogleMapsApiKey}
                    >
                        <DistanceMatrixService
                            // required
                            callback={directionsCallback}
                            // required
                            options={{
                                destinations: [{ lat: destino.LATITUDE, lng: destino.LONGITUDE }],
                                origins: [{ lat: origem.LATITUDE, lng: origem.LONGITUDE }],
                                travelMode: 'DRIVING',
                                region: 'PT',
                            }}
                        />
                    </LoadScript>
                )
            }
        </>
    )
}
