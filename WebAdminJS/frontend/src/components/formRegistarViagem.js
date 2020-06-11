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
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'


export const FormRegistarViagem = ({
    classes, localidades, distDur, callbackOrigem, callbackDestino
}) => {
    const {
        setFieldValue, values, isValid, isSubmitting, submitForm
    } = useFormikContext()

    const [idaVolta, setIdaVolta] = useState(false)

    const handleChangeIdaVolta = (event) => {
        setIdaVolta(event.target.checked)
    }

    useEffect(() => {
        setFieldValue('distancia', distDur.distanciaValue)
    }, [setFieldValue, distDur.distanciaValue])

    return(
        <Box mb={2}>
            <Grid container spacing={4}>
                <Grid item md={6} sm={12} xs={12}>
                    <Field name="origem">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="origem" select
                                label="Origem"
                                placeholder={'Origem'} variant="outlined"
                                className={classes.textField}
                                onChange={(event) => {
                                    setFieldValue('origem', event.target.value)
                                    callbackOrigem(event)
                                }}
                            >
                                {
                                    localidades.map((size) => (
                                        <MenuItem key={size.NR_LOCALIDADE}
                                            value={size.NR_LOCALIDADE} disabled={!size.ATIVO || size.NR_LOCALIDADE === values.destino}>{size.LOCALIDADE}</MenuItem>
                                    ))
                                }
                            </TextField>
                        )}
                    </Field>
                    <Field name="destino">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="destino" select
                                label="Destino"
                                placeholder={'Destino'}
                                variant="outlined"
                                className={classes.textField}
                                onChange={(event) => {
                                    setFieldValue('destino', event.target.value)
                                    callbackDestino(event)
                                }}
                            >
                                {
                                    localidades.map((size) => (
                                        <MenuItem key={size.NR_LOCALIDADE}
                                            value={size.NR_LOCALIDADE} disabled={!size.ATIVO || size.NR_LOCALIDADE === values.origem}>{size.LOCALIDADE}</MenuItem>
                                    ))
                                }
                            </TextField>
                        )}
                    </Field>
                    <Field name="passageiros">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="passageiros" select
                                label="Passageiros"
                                placeholder={'Passageiros'}
                                variant="outlined"
                                className={classes.textField}
                            >
                                <MenuItem key="1" value="1">1</MenuItem>
                                <MenuItem key="2" value="2">2</MenuItem>
                                <MenuItem key="3" value="3">3</MenuItem>
                                <MenuItem key="4" value="4">4 ou mais</MenuItem>
                            </TextField>
                        )}
                    </Field>
                    <MuiPickersUtilsProvider libInstance={moment}
                        utils={MomentUtils}
                        locale={'pt'}>
                        <Field name="datahora_ida">
                            {({ field, form: { errors } }) => (
                                <DateTimePicker {...field} required disablePast
                                    fullWidth ampm={false}
                                    openTo="day"
                                    id="datahora_ida"
                                    format="DD-MM-YYYY HH:mm:ss"
                                    label="Data e Hora - Ida"
                                    views={['date', 'month', 'hours', 'minutes']}
                                    placeholder={'Data e Hora - Ida'}
                                    margin={'normal'}
                                    inputVariant="outlined"
                                    onChange={(value) => {
                                        setFieldValue('datahora_ida', value.format('DD-MM-YYYY HH:mm:ss'))
                                    }}
                                    className={classes.textField}/>
                            )}
                        </Field>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={idaVolta}
                                    onChange={handleChangeIdaVolta}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            className={classes.textField}
                            label="Ida e volta?"
                        />
                        <Field name="datahora_volta">
                            {({ field, form: { errors } }) => (
                                <DateTimePicker {...field} required={idaVolta}
                                    disablePast fullWidth
                                    ampm={false}
                                    openTo="day"
                                    id="datahora_volta"
                                    format="DD-MM-YYYY HH:mm:ss"
                                    label="Data e Hora - Volta"
                                    views={['date', 'month', 'hours', 'minutes']}
                                    placeholder={'Data e Hora - Volta'}
                                    margin={'normal'}
                                    inputVariant="outlined"
                                    onChange={(value) => {
                                        setFieldValue('datahora_volta', value.format('DD-MM-YYYY HH:mm:ss'))
                                    }}
                                    className={clsx(classes.textField, {
                                        [classes.invisible]: !idaVolta,
                                    })}
                                />
                            )}
                        </Field>
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <Field name="ncc">
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="ncc"
                                type="text"
                                label="Número Cartão de Cidadão"
                                placeholder={'Número Cartão de Cidadão'}
                                variant="outlined"
                                className={classes.textField}
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
