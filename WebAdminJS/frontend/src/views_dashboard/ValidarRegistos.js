import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    useTheme,
    Box,
    Breadcrumbs,
    Link,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    TableFooter,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    Grid,
    GridList,
    GridListTile,
    GridListTileBar,
    TextField,
    AppBar,
    Toolbar,
    IconButton,
    CircularProgress,
    Tooltip,
    Slide,
    Snackbar,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import {
    NavigateNext,
    Close,
} from '@material-ui/icons'
import {
    Magnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION,
} from 'react-image-magnifiers'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import { useConfirm } from 'material-ui-confirm'

import { StyledButton, useStyles, Transition, TablePaginationActions } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'

export default function ValidarRegistos() {
    const classes = useStyles()
    const theme = useTheme()
    const confirm = useConfirm()

    const [utilizadores, setUtilizadores] = useState([])
    const [currentUtilizador, setCurrentUtilizador] = useState({ user: [], key: null })
    const [isSubmittingApprove, setIsSubmittingApprove] = useState(false)
    const [isSubmittingDisapprove, setIsSubmittingDisapprove] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResendingEmail, setIsResendingEmail] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [open, setOpen] = useState(false)
    const [openImagem, setOpenImagem] = useState(false)
    const [imagemSelecionada, setImagemSelecionada] = useState('')
    const [update, setUpdate] = useState(false)

    const [srcSlotImg1, setSrcSlotImg1] = useState(null)
    const [srcSlotImg2, setSrcSlotImg2] = useState(null)

    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return }

        setOpenAlert(false)
    }

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpen = (key) => {
        setCurrentUtilizador({ user: utilizadores[key], key })
        setSrcSlotImg1(null)
        setSrcSlotImg2(null)
        axios.get(`${backendUrl}public/documentos/${utilizadores[key].MORADA_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data])
                const url = URL.createObjectURL(blob)
                setSrcSlotImg1(url)
            })
        axios.get(`${backendUrl}public/documentos/${utilizadores[key].N_CC_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data])
                const url = URL.createObjectURL(blob)
                setSrcSlotImg2(url)
            })
        setOpen(true)
    }

    const handleClose = () => {
        setCurrentUtilizador({ user: [], key: null })
        setOpen(false)
    }
    const handleDisapprove = () => {
        setIsSubmittingDisapprove(true)
        confirm({
            title: 'Validação',
            description: 'Não validar a conta vai fazer com que seja removida da base de dados. Deseja continuar?',
            confirmationText: 'Não validar',
            confirmationButtonProps: {
                variant: 'outlined',
                disabled: isSubmittingDisapprove,
            },
            cancellationText: 'Cancelar',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        }).then(() => {
            axios
                .post(`${backendUrl}user/validacaoconta`, { user: currentUtilizador.user.NR_UTILIZADOR, aprovar: false }, { headers: authHeader() })
                .then((res) => {
                    if (res.data.success) {
                        setIsSubmittingDisapprove(false)
                        setUpdate(true)
                        setOpen(false)
                        setMessage('Conta desaprovada com sucesso.')
                        setSeverity('success')
                        setOpenAlert(true)
                    } else {
                        setIsSubmittingApprove(false)
                        setMessage('Ocorreu um erro ao desaprovar a conta.')
                        setSeverity('error')
                        setOpenAlert(true)
                    }
                })
                .catch(() => {
                    setIsSubmittingApprove(false)
                    setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                    setSeverity('error')
                    setOpenAlert(true)
                })
        }).catch(() => {
            setIsSubmittingApprove(false)
        })
    }
    const handleApprove = () => {
        setIsSubmittingApprove(true)
        axios
            .post(`${backendUrl}user/validacaoconta`, { user: currentUtilizador.user.NR_UTILIZADOR, aprovar: true }, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setIsSubmittingApprove(false)
                    setUpdate(true)
                    setMessage('Conta validada com sucesso.')
                    setSeverity('success')
                    setOpenAlert(true)
                    setOpen(false)
                } else {
                    setIsSubmittingApprove(false)
                    setMessage('Ocorreu um erro ao validar a conta.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setIsSubmittingApprove(false)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
    }

    const handleClickVerificar = (key) => {
        setCurrentUtilizador({ user: utilizadores[key], key })
        setIsVerifying(true)
        confirm({
            title: 'Verificação',
            description: 'Verificar o email desta conta? Tente reenviar o email primeiro. Esta ação poderá fazer com que o email, ainda que não seja verdadeiro, tenha sido verificado.',
            confirmationText: 'Verificar',
            confirmationButtonProps: {
                variant: 'outlined',
            },
            cancellationText: 'Cancelar',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        })
            .then(() => {
                axios
                    .post(`${backendUrl}user/verificarconta`, { user: utilizadores[key].NR_UTILIZADOR }, { headers: authHeader() })
                    .then((res) => {
                        if (res.data.success) {
                            utilizadores[key].VERIFICADO = true
                            setIsVerifying(false)
                            setMessage('Conta verificada com sucesso.')
                            setSeverity('success')
                            setOpenAlert(true)
                        } else {
                            setIsVerifying(false)
                            setMessage('Ocorreu um erro ao verificar a conta.')
                            setSeverity('error')
                            setOpenAlert(true)
                        }
                    })
                    .catch(() => {
                        setIsVerifying(false)
                        setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                        setSeverity('error')
                        setOpenAlert(true)
                    })
            })
            .catch(() => {
                setIsVerifying(false)
            })
    }

    const handleResendEmail = (key) => {
        setCurrentUtilizador(utilizadores[key])
        setIsResendingEmail(true)
        confirm({
            title: 'Verificação',
            description: 'Reenviar novo email de confirmação?',
            confirmationText: 'Enviar',
            confirmationButtonProps: {
                variant: 'outlined',
            },
            cancellationText: 'Cancelar',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        })
            .then(() => {
                axios
                    .post(`${backendUrl}user/verificarcontaenvioemail`, { user: utilizadores[key].NR_UTILIZADOR, email: utilizadores[key].EMAIL }, { headers: authHeader() })
                    .then((res) => {
                        if (res.data.success) {
                            setIsResendingEmail(false)
                            setMessage('Email enviado com sucesso.')
                            setSeverity('success')
                            setOpenAlert(true)
                        } else {
                            setIsResendingEmail(false)
                            setMessage('Ocorreu um erro ao enviar o email.')
                            setSeverity('error')
                            setOpenAlert(true)
                        }
                    })
                    .catch(() => {
                        setIsResendingEmail(false)
                        setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                        setSeverity('error')
                        setOpenAlert(true)
                    })
            }).catch(() => {
                setIsResendingEmail(false)
            })
    }

    const handleOpenImagen = (imagem) => {
        setImagemSelecionada(imagem)
        setOpenImagem(true)
    }

    const handleCloseImagem = () => {
        setOpenImagem(false)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
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
        axios
            .get(`${backendUrl}user/utilizadoresnaovalidados`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setUtilizadores(res.data.data)
                    setUpdate(false)
                }
            })
    }, [update])

    return (
        <>
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    TransitionComponent={Slide}
                >
                    <Alert onClose={handleCloseAlert} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant="h4">
                            Validar Registos
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant="h5">
                            <Breadcrumbs
                                separator={<NavigateNext fontSize="small" />}
                                aria-label="breadcrumb"
                            >
                                <Link
                                    color="inherit"
                                    component={RouterLink}
                                    to="/"
                                >
                                    Início
                                </Link>
                                <Link
                                    color="textPrimary"
                                    component={RouterLink}
                                    to="/Dashboard/Utilizadores/ValidarRegistoCliente"
                                    aria-current="page"
                                >
                                    RegistarVeiculo
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
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
                                <Close />
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
                    <DialogTitle id="responsive-dialog-title">
                        Validação de Conta
                        de Utilizador
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box mb={2}>
                            <Grid container spacing={1}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.NOME_UTILIZADOR}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Data de Nascimento"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={moment(currentUtilizador.user.DATA_NASCIMENTO).format('YYYY-MM-DD')}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Género"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={handleGenero(currentUtilizador.user.GENERO)}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Número Cartão de Cidadão"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.N_CC}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Número Segurança Social"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.N_SEGSOCIAL}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Número Identificação Fiscal"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.NIF}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Número de Telemóvel"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.N_TELEMOVEL}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Número de Telefone"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.N_TELEFONE ? currentUtilizador.user.N_TELEFONE : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Morada"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.MORADA_UTILIZADOR}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Código Postal"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.COD_POSTAL}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Freguesia"
                                        variant="outlined"
                                        className={classes.textField}
                                        value={currentUtilizador.user.FREGUESIA}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
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
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            onClick={handleClose}
                            variant="outlined"
                            color="primary"
                            disabled={isSubmittingApprove || isSubmittingDisapprove}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDisapprove}
                            variant="outlined"
                            color="primary"
                            style={{
                                width: '123px',
                                height: '36px',
                            }}
                            disabled={isSubmittingApprove || isSubmittingDisapprove}
                        >
                            {isSubmittingDisapprove && (
                                <CircularProgress
                                    size={30}
                                    color="inherit"
                                />
                            )}
                            {!isSubmittingDisapprove && 'Desaprovar'}
                        </Button>
                        <StyledButton
                            onClick={handleApprove}
                            color="primary"
                            autoFocus
                            style={{ width: '115px' }}
                            disabled={isSubmittingDisapprove || isSubmittingApprove}
                        >
                            {isSubmittingApprove && (
                                <CircularProgress color="inherit" />)}
                            {!isSubmittingApprove && 'Aprovar'}
                        </StyledButton>
                    </DialogActions>
                </Dialog>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.root}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Utilizador</TableCell>
                                    <TableCell>Nome do Utilizador</TableCell>
                                    <TableCell>Freguesia</TableCell>
                                    <TableCell>
                                        Data de Criação da
                                        Conta
                                    </TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? utilizadores.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    : utilizadores
                                ).map((row, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {row.NR_UTILIZADOR}
                                        </TableCell>
                                        <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                                        <TableCell>{row.FREGUESIA}</TableCell>
                                        <TableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            {
                                                row.VERIFICADO ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        disableElevation
                                                        onClick={() => handleClickOpen(key)}
                                                        style={{ marginRight: theme.spacing(3) }}
                                                    >
                                                        Validar
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Tooltip title="O email foi enviado recentemente, aguarde um pouco antes de tentar ativar." arrow disableHoverListener={moment().diff(row.DATA_ENVIO_MAIL, 'minutes') >= 30}>
                                                            <span>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    disableElevation
                                                                    onClick={() => handleClickVerificar(key)}
                                                                    disabled={moment().diff(row.DATA_ENVIO_MAIL, 'minutes') < 30 || (isVerifying && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR)}
                                                                    style={{
                                                                        marginRight: theme.spacing(3),
                                                                        width: '104px',
                                                                        height: '36px',
                                                                    }}
                                                                >
                                                                    {isVerifying && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR
                                                                        ? (<CircularProgress size={30} color="inherit" />) : 'Verificar'}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title="O email foi enviado recentemente, aguarde um pouco antes de tentar enviar um novo." arrow disableHoverListener={moment().diff(row.DATA_ENVIO_MAIL, 'minutes') >= 30}>
                                                            <span>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    disableElevation
                                                                    onClick={() => handleResendEmail(key)}
                                                                    disabled={moment().diff(row.DATA_ENVIO_MAIL, 'minutes') < 30 || (isResendingEmail && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR)}
                                                                    style={{
                                                                        width: '148px',
                                                                        height: '36px',
                                                                    }}
                                                                >
                                                                    {isResendingEmail && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR
                                                                        ? (<CircularProgress size={30} color="inherit" />) : 'Reenviar Email'}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    </>
                                                )
                                            }
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, {
                                            label: 'Todos',
                                            value: -1,
                                        }]}
                                        colSpan={5}
                                        count={utilizadores.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'linhas por página' },
                                            native: true,
                                        }}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        </>
    )
}
