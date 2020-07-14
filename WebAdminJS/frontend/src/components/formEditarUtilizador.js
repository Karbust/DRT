import {
    AppBar,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid, GridList, GridListTile, GridListTileBar,
    IconButton, TextField,
    Toolbar, useMediaQuery, useTheme,
} from '@material-ui/core'
import { Magnifier, MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-image-magnifiers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Field, Formik } from 'formik'
import validator from 'validator'

import { backendUrl } from '../configs'

import authHeader from './auth-header'
import { StyledButton, Transition, useStyles } from './MuiStyles'

export const FormEditarUtilizador = ({
    open, setOpen, currentUtilizador, setCurrentUtilizador,
}) => {
    const classes = useStyles()
    const theme = useTheme()

    const [openImagem, setOpenImagem] = useState(false)
    const [imagemSelecionada, setImagemSelecionada] = useState('')
    const [srcSlotImg1, setSrcSlotImg1] = useState(null)
    const [srcSlotImg2, setSrcSlotImg2] = useState(null)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleOpenImagen = (imagem) => {
        setImagemSelecionada(imagem)
        setOpenImagem(true)
    }

    const handleCloseImagem = () => {
        setOpenImagem(false)
    }

    const handleClose = () => {
        setSrcSlotImg1(null)
        setSrcSlotImg2(null)
        setCurrentUtilizador({ user: [], key: null })
        setOpen(false)
    }

    const onFormikSubmit = (values) => {
        return axios
            .post(`${backendUrl}user/editarutilizador`, { values, nr_user: currentUtilizador.NR_UTILIZADOR }, { headers: authHeader() })
            .then((data) => {
                if (data.data.success) {
                    handleClose()
                } else {
                    handleClose()
                }
            })
            .catch(() => {
                handleClose()
            })
    }

    const handleGenero = (genero) => {
        if (genero === 'M') {
            return 'Masculino'
        } if (genero === 'F') {
            return 'Feminino'
        }
        return 'Outro'
    }

    useEffect(() => {
        if (open === true) {
            axios.get(`${backendUrl}public/documentos/${currentUtilizador.MORADA_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
                .then((res) => {
                    const blob = new Blob([res.data])
                    const url = URL.createObjectURL(blob)
                    setSrcSlotImg1(url)
                })
            axios.get(`${backendUrl}public/documentos/${currentUtilizador.N_CC_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
                .then((res) => {
                    const blob = new Blob([res.data])
                    const url = URL.createObjectURL(blob)
                    setSrcSlotImg2(url)
                })
        }
    }, [open, currentUtilizador])

    return (
        <>
            <Dialog
                fullScreen
                open={openImagem}
                onClose={handleCloseImagem}
                TransitionComponent={Transition}
            >
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseImagem}
                            aria-label="close"
                        >
                            <i className="fal fa-times fa-sm" />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box className={classes.toolbarImagem}>
                    <Magnifier
                        className={classes.inputPosition}
                        imageSrc={imagemSelecionada}
                        largeImageSrc={imagemSelecionada}
                        mouseActivation={MOUSE_ACTIVATION.CLICK}
                        touchActivation={TOUCH_ACTIVATION.TAP}
                        dragToMove
                    />
                </Box>
            </Dialog>
            <Dialog
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Editar Utilizador</DialogTitle>
                <Formik
                    onSubmit={onFormikSubmit}
                    validateOnBlur={false}
                    validateOnChange={false}
                    initialValues={{
                        nome: currentUtilizador.NOME_UTILIZADOR,
                        datanascimento: moment(currentUtilizador.DATA_NASCIMENTO).format('YYYY-MM-DD'),
                        genero: currentUtilizador.GENERO,
                        ncc: currentUtilizador.N_CC,
                        nss: String(currentUtilizador.N_SEGSOCIAL),
                        nif: String(currentUtilizador.NIF),
                        telemovel: String(currentUtilizador.N_TELEMOVEL),
                        telefone: currentUtilizador.N_TELEFONE ? String(currentUtilizador.N_TELEFONE) : '',
                        morada: currentUtilizador.MORADA_UTILIZADOR,
                        codpostal: currentUtilizador.COD_POSTAL,
                        localidade: currentUtilizador.FREGUESIA,
                        email: currentUtilizador.EMAIL,
                        utilizador: currentUtilizador.LOGIN_USER,
                        password: '',
                    }}
                >
                    {({
                        submitForm,
                        validateField,
                    }) => {
                        return (
                            <>
                                <DialogContent dividers>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        submitForm()
                                    }}
                                    >
                                        <Box mb={2}>
                                            <Grid container spacing={1}>
                                                <Grid item md={6} sm={6} xs={12}>
                                                    <Field
                                                        name="nome"
                                                        validate={(nome) => (nome.length >= 5 ? undefined : 'Nome inválido')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Nome"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.nome)}
                                                                helperText={errors.nome}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <TextField
                                                        fullWidth
                                                        label="Data de Nascimento"
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        value={moment(currentUtilizador.DATA_NASCIMENTO).format('DD-MM-YYYY')}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Género"
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        value={handleGenero(currentUtilizador.GENERO)}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Número Cartão de Cidadão"
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        value={currentUtilizador.N_CC}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Número Segurança Social"
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        value={currentUtilizador.N_SEGSOCIAL}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Número Identificação Fiscal"
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        value={currentUtilizador.NIF}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                    <Field
                                                        name="utilizador"
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Utilizador"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                            />
                                                        )}
                                                    </Field>
                                                </Grid>
                                                <Grid item md={6} sm={6} xs={12}>
                                                    <Field
                                                        name="telemovel"
                                                        validate={(telemovel) => (validator.isMobilePhone(telemovel, 'pt-PT') ? undefined : 'Telemóvel inválido')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Número de Telemóvel"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.telemovel)}
                                                                helperText={errors.telemovel}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="telefone"
                                                        validate={(telefone) => (telefone.length === 9 ? undefined : 'Telefone inválido')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Número de Telefone"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.telefone)}
                                                                helperText={errors.telefone}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="morada"
                                                        validate={(morada) => (morada !== '' ? undefined : 'Morada inválida')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Morada"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.morada)}
                                                                helperText={errors.morada}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="codpostal"
                                                        validate={(codpostal) => (validator.isPostalCode(codpostal, 'PT') ? undefined : 'Código postal inválido')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Código Postal"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.codpostal)}
                                                                helperText={errors.codpostal}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="localidade"
                                                        validate={(localidade) => (localidade !== '' ? undefined : 'Localidade inválida')}
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Freguesia"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                error={Boolean(errors.localidade)}
                                                                helperText={errors.localidade}
                                                                onBlur={(event) => validateField(event.currentTarget.name)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="email"
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                label="Email"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field
                                                        name="password"
                                                    >
                                                        {({ field, form: { errors } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Password"
                                                                variant="outlined"
                                                                className={classes.textField}
                                                                placeholder="Deixar vazio para manter a mesma"
                                                            />
                                                        )}
                                                    </Field>
                                                </Grid>
                                                <Box className={classes.GridListRoot}>
                                                    <GridList
                                                        className={classes.GridList}
                                                        cols={1}
                                                    >
                                                        <GridListTile cols={1} rows={1}>
                                                            <img
                                                                src={srcSlotImg1}
                                                                onClick={() => handleOpenImagen(srcSlotImg1)}
                                                                alt="Comprovativo de Morada"
                                                            />
                                                            <GridListTileBar
                                                                title="Comprovativo de Morada"
                                                                classes={{
                                                                    root: classes.GridListTitleBar,
                                                                    title: classes.GridListTitle,
                                                                }}
                                                            />
                                                        </GridListTile>
                                                        <GridListTile cols={1} rows={1}>
                                                            <img
                                                                src={srcSlotImg2}
                                                                onClick={() => handleOpenImagen(srcSlotImg2)}
                                                                alt="Comprovativo Ncc"
                                                            />
                                                            <GridListTileBar
                                                                title="Comprovativo Cartão de Cidadão"
                                                                classes={{
                                                                    root: classes.GridListTitleBar,
                                                                    title: classes.GridListTitle,
                                                                }}
                                                            />
                                                        </GridListTile>
                                                    </GridList>
                                                </Box>
                                            </Grid>
                                        </Box>

                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        autoFocus
                                        onClick={handleClose}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={{
                                            width: '140px',
                                            height: '36px',
                                        }}
                                    >
                                        Apagar Conta
                                    </Button>
                                    <StyledButton
                                        color="primary"
                                        autoFocus
                                        style={{ width: '115px' }}
                                        onClick={submitForm}
                                    >
                                        Guardar
                                    </StyledButton>
                                </DialogActions>
                            </>
                        )
                    }}
                </Formik>
            </Dialog>
        </>
    )
}
