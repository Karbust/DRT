import React from 'react'
import { Box, Grid, TextField } from '@material-ui/core'
import { Field } from 'formik'
import validator from 'validator'

export const FormDadosConta = ({ classes }) => {
    return (
        <Box ml={10} mr={10}>
            <Grid container spacing={4}>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="email"
                        validate={(email) => validator.isEmail(email) ? undefined : 'Email inválido'}>
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="email"
                                type="email" label="Email"
                                placeholder={'Email'} variant="outlined"
                                className={classes.textField}
                                error={Boolean(errors.email)}/>
                        )}
                    </Field>
                </Grid>
                <Grid item lg={4} md={5} sm={6} xs={12}>
                    <Field name="utilizador"
                        validate={(utilizador) => validator.isAlphanumeric(utilizador) ? undefined : 'Nome de utilizador inválido'}>
                        {({ field, form: { errors } }) => (
                            <TextField {...field} required fullWidth id="utilizador"
                                type="text"
                                label="Utilizador" placeholder={'Utilizador'}
                                variant="outlined"
                                className={classes.textField}/>
                        )}
                    </Field>
                </Grid>
            </Grid>
        </Box>
    )
}
