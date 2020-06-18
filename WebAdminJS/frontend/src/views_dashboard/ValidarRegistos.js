import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { backendUrl } from '../configs'
import authHeader from '../components/auth-header'
import {
    useTheme,
    Slide,
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
} from '@material-ui/core'
import {
    NavigateNext, FirstPage, LastPage, KeyboardArrowRight, KeyboardArrowLeft,
    Close,
} from '@material-ui/icons'
import {
    Magnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION,
} from 'react-image-magnifiers'
import { Link as RouterLink } from 'react-router-dom'
import { useStyles, StyledButton } from '../components/MuiStyles'
import moment from 'moment'
import { useConfirm } from 'material-ui-confirm'

function TablePaginationActions(props) {
    const classes = useStyles()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.TablePagination}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage/> : <FirstPage/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}
                aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> :
                    <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> :
                    <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage/> : <LastPage/>}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

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
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [open, setOpen] = React.useState(false)
    const [openImagem, setOpenImagem] = React.useState(false)
    const [imagemSelecionada, setImagemSelecionada] = React.useState('')
    const [update, setUpdate] = React.useState(false)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpen = (key) => {
        setCurrentUtilizador({ user: utilizadores[key], key: key })
        setOpen(true)
    }

    const handleClose = () => {
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
                disabled: isSubmittingDisapprove
            },
            cancellationText: 'Cancelar',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        }).then(() => {
            axios
                .post(backendUrl + 'user/validacaoconta', { user: currentUtilizador.user.NR_UTILIZADOR, aprovar: false }, { headers: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        setIsSubmittingDisapprove(false)
                        setUpdate(true)
                        setOpen(false)
                    } else {
                        setIsSubmittingApprove(false)
                    }
                })
        })
    }
    const handleApprove = () => {
        setIsSubmittingApprove(true)
        axios
            .post(backendUrl + 'user/validacaoconta', { user: currentUtilizador.user.NR_UTILIZADOR, aprovar: true }, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setIsSubmittingApprove(false)
                    setUpdate(true)
                    setOpen(false)
                } else {
                    setIsSubmittingApprove(false)
                }
            })
    }

    const handleClickVerificar = (key) => {
        setCurrentUtilizador({ user: utilizadores[key], key: key })
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
                    .post(backendUrl + 'user/verificarconta', { user: utilizadores[key].NR_UTILIZADOR }, { headers: authHeader() })
                    .then(res => {
                        if (res.data.success) {
                            utilizadores[key].VERIFICADO = true
                            setIsVerifying(false)
                        }
                    })
            })
            .catch(() => {
                setIsVerifying(false)
                console.log('teste2')
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
                    .post(backendUrl + 'user/verificarcontaenvioemail', { user: utilizadores[key].NR_UTILIZADOR, email: utilizadores[key].EMAIL }, { headers: authHeader() })
                    .then(res => {
                        if (res.data.success) {
                            setIsResendingEmail(false)
                        }
                    })
            }).catch(() => {
                setIsResendingEmail(false)
                console.log('teste2')
            })
        //setOpen(false)
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
        } else if (genero === 'F') {
            return 'Feminino'
        } else {
            return 'Outro'
        }
    }


    useEffect(() => {
        axios
            .get(backendUrl + 'user/utilizadoresnaovalidados', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setUtilizadores(res.data.data)
                    setUpdate(false)
                }
            })
    }, [update])

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant={'h4'}>
                            Validar Registos
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant={'h5'}>
                            <Breadcrumbs
                                separator={<NavigateNext fontSize="small"/>}
                                aria-label="breadcrumb">
                                <Link color="inherit" component={RouterLink}
                                    to='/'>
                                    Início
                                </Link>
                                <Link color="textPrimary" component={RouterLink}
                                    to='/Dashboard/Utilizadores/ValidarRegistoCliente'
                                    aria-current="page">RegistarVeiculo</Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Dialog fullScreen open={openImagem} onClose={handleCloseImagem}
                    TransitionComponent={Transition}>
                    <AppBar position="sticky">
                        <Toolbar>
                            <IconButton edge="start" color="inherit"
                                onClick={handleCloseImagem}
                                aria-label="close">
                                <Close/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Box className={classes.toolbarImagem}>
                        <Magnifier
                            className={classes.inputPosition}
                            imageSrc={backendUrl + 'public/documentos/' + imagemSelecionada}
                            largeImageSrc={backendUrl + 'public/documentos/' + imagemSelecionada}
                            mouseActivation={MOUSE_ACTIVATION.CLICK}
                            touchActivation={TOUCH_ACTIVATION.TAP}
                            dragToMove={true}
                        />
                    </Box>
                </Dialog>
                <Dialog
                    fullScreen={fullScreen}
                    fullWidth={true}
                    maxWidth="md"
                    open={open}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Validação de Conta
                        de Utilizador</DialogTitle>
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
                                    <GridList className={classes.GridList}
                                        cols={1}>
                                        <GridListTile cols={1} rows={1}>
                                            <img
                                                src={backendUrl + 'public/documentos/' + currentUtilizador.user.MORADA_COMPROVATIVO}
                                                onClick={() => handleOpenImagen(currentUtilizador.user.MORADA_COMPROVATIVO)}
                                                alt={'Comprovativo de Morada'}/>
                                            <GridListTileBar
                                                title={'Comprovativo de Morada'}
                                                classes={{
                                                    root: classes.GridListTitleBar,
                                                    title: classes.GridListTitle,
                                                }}
                                            />
                                        </GridListTile>
                                        <GridListTile cols={1} rows={1}>
                                            <img
                                                src={backendUrl + 'public/documentos/' + currentUtilizador.user.N_CC_COMPROVATIVO}
                                                onClick={() => handleOpenImagen(currentUtilizador.user.N_CC_COMPROVATIVO)}
                                                alt={'Comprovativo Ncc'}/>
                                            <GridListTileBar
                                                title={'Comprovativo Cartão de Cidadão'}
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
                        <Button autoFocus onClick={handleClose}
                            variant="outlined" color="primary"
                            disabled={isSubmittingApprove || isSubmittingDisapprove}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleDisapprove} variant="outlined"
                            color="primary" style={{
                                width: '123px',
                                height: '36px',
                            }}
                            disabled={isSubmittingApprove || isSubmittingDisapprove}
                        >
                            {isSubmittingDisapprove && (
                                <CircularProgress size={30}
                                    color={'inherit'}/>)}
                            {!isSubmittingDisapprove && 'Desaprovar'}
                        </Button>
                        <StyledButton onClick={handleApprove} color="primary"
                            autoFocus style={{ width: '115px' }}
                            disabled={isSubmittingDisapprove || isSubmittingApprove}
                        >
                            {isSubmittingApprove && (
                                <CircularProgress color={'inherit'}/>)}
                            {!isSubmittingApprove && 'Aprovar'}
                        </StyledButton>
                    </DialogActions>
                </Dialog>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table className={classes.root}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Utilizador</TableCell>
                                    <TableCell>Nome do Utilizador</TableCell>
                                    <TableCell>Freguesia</TableCell>
                                    <TableCell>Data de Criação da
                                        Conta</TableCell>
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
                                                    <Button variant="contained"
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
                                                                    {isVerifying && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR ?
                                                                        (<CircularProgress size={30} color={'inherit'}/>) : 'Verificar'}
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
                                                                    {isResendingEmail && currentUtilizador.user.NR_UTILIZADOR === row.NR_UTILIZADOR ?
                                                                        (<CircularProgress size={30} color={'inherit'}/>) : 'Reenviar Email'}
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
