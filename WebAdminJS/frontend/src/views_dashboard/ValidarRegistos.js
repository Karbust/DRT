import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    useTheme,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
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
    Hidden, TableSortLabel,
} from '@material-ui/core'
import {
    Magnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION,
} from 'react-image-magnifiers'
import moment from 'moment'
import { useConfirm } from 'material-ui-confirm'

import { StyledButton, useStyles, Transition } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { TabelasFooter } from '../components/tabelasFooter'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'

export default function ValidarRegistos() {
    const classes = useStyles()
    const theme = useTheme()
    const confirm = useConfirm()

    const [utilizadores, setUtilizadores] = useState([])
    const [currentUtilizador, setCurrentUtilizador] = useState({})
    const [isSubmittingApprove, setIsSubmittingApprove] = useState(false)
    const [isSubmittingDisapprove, setIsSubmittingDisapprove] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResendingEmail, setIsResendingEmail] = useState(false)
    const [open, setOpen] = useState(false)
    const [openImagem, setOpenImagem] = useState(false)
    const [imagemSelecionada, setImagemSelecionada] = useState('')
    const [update, setUpdate] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState(['createdAt'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)

    const [srcSlotImg1, setSrcSlotImg1] = useState(null)
    const [srcSlotImg2, setSrcSlotImg2] = useState(null)

    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return }

        setOpenAlert(false)
    }

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }

    const handleRequestSort = (event, properties) => {
        const isAsc = JSON.stringify(orderBy) === JSON.stringify(properties) && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(properties)
    }

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpen = (key) => {
        setCurrentUtilizador(utilizadores.find(x => x.NR_UTILIZADOR === key))
        setSrcSlotImg1(null)
        setSrcSlotImg2(null)
        axios.get(`${backendUrl}public/documentos/${utilizadores.find(x => x.NR_UTILIZADOR === key).MORADA_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data])
                const url = URL.createObjectURL(blob)
                setSrcSlotImg1(url)
            })
        axios.get(`${backendUrl}public/documentos/${utilizadores.find(x => x.NR_UTILIZADOR === key).N_CC_COMPROVATIVO}`, { headers: authHeader(), responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data])
                const url = URL.createObjectURL(blob)
                setSrcSlotImg2(url)
            })
        setOpen(true)
    }

    const handleClose = () => {
        setCurrentUtilizador({})
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
                .post(`${backendUrl}user/validacaoconta`, { user: currentUtilizador.NR_UTILIZADOR, aprovar: false }, { headers: authHeader() })
                .then((res) => {
                    if (res.data.success) {
                        setIsSubmittingDisapprove(false)
                        setUpdate(true)
                        setOpen(false)
                        setMessage('Conta desaprovada com sucesso.')
                        setSeverity('success')
                    } else {
                        setIsSubmittingApprove(false)
                        setMessage('Ocorreu um erro ao desaprovar a conta.')
                        setSeverity('error')
                    }
                })
                .catch(() => {
                    setIsSubmittingApprove(false)
                    setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                    setSeverity('error')
                })
                .finally(() => {
                    setOpenAlert(true)
                })
        }).catch(() => {
            setIsSubmittingApprove(false)
        })
    }
    const handleApprove = () => {
        setIsSubmittingApprove(true)
        axios
            .post(`${backendUrl}user/validacaoconta`, { user: currentUtilizador.NR_UTILIZADOR, aprovar: true }, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setIsSubmittingApprove(false)
                    setUpdate(true)
                    setMessage('Conta validada com sucesso.')
                    setSeverity('success')
                    setOpen(false)
                } else {
                    setIsSubmittingApprove(false)
                    setMessage('Ocorreu um erro ao validar a conta.')
                    setSeverity('error')
                }
            })
            .catch(() => {
                setIsSubmittingApprove(false)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
            })
            .finally(() => {
                setOpenAlert(true)
            })
    }

    const handleClickVerificar = (key) => {
        setCurrentUtilizador(utilizadores.find(x => x.NR_UTILIZADOR === key))
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
                    .post(`${backendUrl}user/verificarconta`, { user: utilizadores.find(x => x.NR_UTILIZADOR === key).NR_UTILIZADOR }, { headers: authHeader() })
                    .then((res) => {
                        if (res.data.success) {
                            utilizadores[key].VERIFICADO = true
                            setIsVerifying(false)
                            setMessage('Conta verificada com sucesso.')
                            setSeverity('success')
                        } else {
                            setIsVerifying(false)
                            setMessage('Ocorreu um erro ao verificar a conta.')
                            setSeverity('error')
                        }
                    })
                    .catch(() => {
                        setIsVerifying(false)
                        setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                        setSeverity('error')
                    })
                    .finally(() => {
                        setOpenAlert(true)
                    })
            })
            .catch(() => {
                setIsVerifying(false)
            })
    }

    const handleResendEmail = (key) => {
        setCurrentUtilizador(utilizadores.find(x => x.NR_UTILIZADOR === key))
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
                    .post(`${backendUrl}user/verificarcontaenvioemail`, { user: utilizadores.find(x => x.NR_UTILIZADOR === key).NR_UTILIZADOR, email: utilizadores[key].EMAIL }, { headers: authHeader() })
                    .then((res) => {
                        if (res.data.success) {
                            setIsResendingEmail(false)
                            setMessage('Email enviado com sucesso.')
                            setSeverity('success')
                        } else {
                            setIsResendingEmail(false)
                            setMessage('Ocorreu um erro ao enviar o email.')
                            setSeverity('error')
                        }
                    })
                    .catch(() => {
                        setIsResendingEmail(false)
                        setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                        setSeverity('error')
                    })
                    .finally(() => {
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

    const handleGenero = (genero) => {
        if (genero === 'M') {
            return 'Masculino'
        } if (genero === 'F') {
            return 'Feminino'
        }
        return 'Outro'
    }

    useEffect(() => {
        getUrl('user/utilizadoresnaovalidados')
            .then((res) => {
                if (res.data.success) {
                    setUtilizadores(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Ocorreu um erro ao obter a lista de utilizadores não validados.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao pedir a lista de utilizadores não validados ao servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
            .finally(() => {
                setOpenBackdrop(false)
            })
    }, [update])

    return (
        <>
            <TabelasPaginasHeader
                openBackdrop={openBackdrop}
                handleCloseBackdrop={handleCloseBackdrop}
                openAlert={openAlert}
                handleCloseAlert={handleCloseAlert}
                severity={severity}
                message={message}
                handleFilter={handleFilter}
                titulo="Validar Registos"
                url="/Dashboard/Viaturas/ListaViaturas"
            />
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
                            <i className="fal fa-times fa-lg" />
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
                                    value={currentUtilizador.NOME_UTILIZADOR}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Data de Nascimento"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={moment(currentUtilizador.DATA_NASCIMENTO).format('YYYY-MM-DD')}
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
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Número de Telemóvel"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={currentUtilizador.N_TELEMOVEL}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Número de Telefone"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={currentUtilizador.N_TELEFONE ? currentUtilizador.N_TELEFONE : ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Morada"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={currentUtilizador.MORADA_UTILIZADOR}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Código Postal"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={currentUtilizador.COD_POSTAL}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Freguesia"
                                    variant="outlined"
                                    className={classes.textField}
                                    value={currentUtilizador.FREGUESIA}
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
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['NR_UTILIZADOR'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NR_UTILIZADOR'])}
                                            >
                                                #
                                                {isEqual ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })()}
                                <TableCell>Nome</TableCell>
                                <Hidden smDown>
                                    <TableCell>Freguesia</TableCell>
                                </Hidden>
                                <TableCell>
                                    Data de Criação da
                                    Conta
                                </TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sortFilter(utilizadores, getComparator(order, orderBy), filter)
                                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {row.NR_UTILIZADOR}
                                            </TableCell>
                                            <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                                            <Hidden smDown>
                                                <TableCell>{row.FREGUESIA}</TableCell>
                                            </Hidden>
                                            <TableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                            <TableCell>
                                                {
                                                    row.VERIFICADO ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            disableElevation
                                                            onClick={() => handleClickOpen(row.NR_UTILIZADOR)}
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
                                                                        onClick={() => handleClickVerificar(row.NR_UTILIZADOR)}
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
                                                                        onClick={() => handleResendEmail(row.NR_UTILIZADOR)}
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
                                    ))
                            }
                        </TableBody>
                        <TabelasFooter
                            dados={utilizadores}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
