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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    useMediaQuery, Slide, Snackbar,
} from '@material-ui/core'
import {
    NavigateNext,
} from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import { Formik } from 'formik'
import { Alert } from '@material-ui/lab'

import { StyledButton, useStyles, Transition, TablePaginationActions } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'
import { FormPedidosViagem } from '../components/formPedidosViagem'

export default function PedidosViagem() {
    const classes = useStyles()
    const theme = useTheme()

    const [localidades, setLocalidades] = useState([])
    const [motoristas, setMotoristas] = useState([])
    const [viaturas, setViaturas] = useState([])
    const [viagens, setViagens] = useState([])
    const [currentViagem, setCurrentViagem] = useState({ viagem: [], key: null })
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [update, setUpdate] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = useState('')
    const [severidade, setSeveridade] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpen = (key) => {
        setCurrentViagem({ viagem: viagens[key], key })
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        axios
            .post(`${backendUrl}viagens/editarviagem`, { values, nr_viagem: currentViagem.viagem.NR_VIAGEM_PEDIDO }, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    formikActions.setSubmitting(false)
                    viagens[currentViagem.key].ESTADO = 'PENDENTE'
                    setMessage('Viagem editada com sucesso')
                    setSeveridade('success')
                    setOpenAlert(true)
                    setOpen(false)
                } else {
                    formikActions.setSubmitting(false)
                    setMessage('Ocorreu um erro ao editar a viagem.')
                    setSeveridade('error')
                    setOpenAlert(true)
                }
            }).catch(() => {
                formikActions.setSubmitting(false)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeveridade('error')
                setOpenAlert(true)
            })
    }

    useEffect(() => {
        axios
            .get(`${backendUrl}api/localidades`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setLocalidades(res.data.data)
                } else {
                    setMessage('Ocorreu um erro ao obter a lista de localidades.')
                    setSeveridade('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao obter a lista de localidades ao servidor.')
                setSeveridade('error')
                setOpenAlert(true)
            })
        axios
            .get(`${backendUrl}user/motoristas`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setMotoristas(res.data.data)
                } else {
                    setMessage('Ocorreu um erro ao pedir a lista de motoristas.')
                    setSeveridade('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao pedir a lista de motoristas ao servidor.')
                setSeveridade('error')
                setOpenAlert(true)
            })
        axios
            .get(`${backendUrl}viaturas/viaturas`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setViaturas(res.data.data)
                } else {
                    setMessage('Ocorreu um erro ao pedir a lista de viaturas.')
                    setSeveridade('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao pedir a lista de viaturas ao servidor.')
                setSeveridade('error')
                setOpenAlert(true)
            })
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    useEffect(() => {
        axios
            .get(`${backendUrl}viagens/pedidosviagem`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setViagens(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Ocorreu um erro ao obter a lista de viagens.')
                    setSeveridade('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao pedir a lista de viagens ao servidor.')
                setSeveridade('error')
                setOpenAlert(true)
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
                    <Alert onClose={handleCloseAlert} severity={severidade}>
                        {message}
                    </Alert>
                </Snackbar>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant="h4">
                            Pedidos de Viagem
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
                                    to="/Dashboard/Utilizadores/PedidosViagem"
                                    aria-current="page"
                                >
                                    Pedidos Viagem
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Dialog
                    fullScreen={fullScreen}
                    fullWidth
                    maxWidth="md"
                    open={open}
                    scroll="paper"
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Validação de Conta de Utilizador</DialogTitle>

                    <Formik
                        onSubmit={onFormikSubmit}
                        validateOnBlur={false}
                        validateOnChange={false}
                        initialValues={{
                            origem: currentViagem.viagem.ORIGEM,
                            destino: currentViagem.viagem.DESTINO,
                            passageiros: currentViagem.viagem.PASSAGEIROS,
                            motivo: currentViagem.viagem.MOTIVO,
                            datahora_ida: currentViagem.viagem.DATAHORA_IDA,
                            datahora_volta: currentViagem.viagem.DATAHORA_VOLTA,
                            nrcliente: currentViagem.viagem.NR_CLIENTE_PEDIDO,
                            observacoes: currentViagem.viagem.OBSERVACOES || '',
                            distancia: currentViagem.viagem.DISTANCIA,
                            duracao: currentViagem.viagem.DURACAO,
                            custo: currentViagem.viagem.CUSTO || '',
                            comparticipacao: currentViagem.viagem.CUSTO || '',
                            motorista: currentViagem.viagem.MOTORISTA || 0,
                            viatura: currentViagem.viagem.VIATURA || 0,
                        }}
                    >
                        {({
                            submitForm,
                            isValid,
                            isSubmitting,
                        }) => {
                            return (
                                <>
                                    <DialogContent dividers>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            submitForm()
                                        }}
                                        >
                                            <FormPedidosViagem
                                                localidades={localidades}
                                                motoristas={motoristas}
                                                viaturas={viaturas}
                                                currentViagem={currentViagem}
                                            />
                                        </form>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={handleClose}
                                            variant="outlined"
                                            color="primary"
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                        <StyledButton
                                            onClick={submitForm}
                                            color="primary"
                                            style={{ width: '115px' }}
                                            disabled={!isValid || isSubmitting}
                                        >
                                            {isSubmitting && (
                                                <CircularProgress color="inherit" />)}
                                            {!isSubmitting && 'Guardar'}
                                        </StyledButton>
                                    </DialogActions>
                                </>
                            )
                        }}
                    </Formik>
                </Dialog>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.root}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell># Viagem</TableCell>
                                    <TableCell>Origem</TableCell>
                                    <TableCell>Destino</TableCell>
                                    <TableCell>Data/Hora Ida</TableCell>
                                    <TableCell>Data/Hora Volta</TableCell>
                                    <TableCell>Passageiros</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Distância</TableCell>
                                    <TableCell>Custo</TableCell>
                                    <TableCell>Motorista</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? viagens.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    : viagens
                                ).map((row, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {row.NR_VIAGEM_PEDIDO}
                                        </TableCell>
                                        <TableCell>{row.Origem.LOCALIDADE}</TableCell>
                                        <TableCell>{row.Destino.LOCALIDADE}</TableCell>
                                        <TableCell>{moment(row.DATAHORA_IDA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{!row.DATAHORA_VOLTA ? '-' : moment(row.DATAHORA_VOLTA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{row.PASSAGEIROS}</TableCell>
                                        <TableCell>
                                            { row.MOTIVO === 'L' && 'LAZER' }
                                            { row.MOTIVO === 'T' && 'TRABALHO' }
                                            { row.MOTIVO === 'SNU' && 'SAÚDE NÃO URGENTE' }
                                        </TableCell>
                                        <TableCell>
                                            {(row.DISTANCIA / 1000).toFixed(2)}
                                            {' '}
                                            Km
                                        </TableCell>
                                        <TableCell>{!row.CUSTO ? '-' : row.CUSTO }</TableCell>
                                        <TableCell>{!row.MOTORISTA ? '-' : row.MOTORISTA}</TableCell>
                                        <TableCell>
                                            {row.ESTADO === 'PEDIDO' && <Chip style={{ backgroundColor: theme.palette.info.main }} size="small" label={row.ESTADO} />}
                                            {row.ESTADO === 'PENDENTE' && <Chip style={{ backgroundColor: theme.palette.info2.main }} size="small" label={row.ESTADO} />}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disableElevation
                                                onClick={() => handleClickOpen(key)}
                                                style={{ marginRight: theme.spacing(3) }}
                                            >
                                                EDITAR
                                            </Button>
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
                                        colSpan={12}
                                        count={viagens.length}
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
