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
    useMediaQuery,
    Slide,
    Snackbar,
    Hidden,
    TableSortLabel,
    Tooltip,
    TextField,
    Backdrop,
} from '@material-ui/core'
import {
    NavigateNext,
} from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import { Formik } from 'formik'
import { Alert } from '@material-ui/lab'
import clsx from 'clsx'

import { StyledButton, useStyles, Transition, TablePaginationActions } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'
import { FormPedidosViagem } from '../components/formPedidosViagem'
import { getUrl, getComparator, compararListas, sortFilter } from '../components/functions'

const motivoIdToName = {
    'L': 'LAZER',
    'T': 'TRABALHO',
    'SNU': 'SAÚDE NÃO URGENTE',
}

export default function PedidosViagem() {
    const classes = useStyles()
    const theme = useTheme()

    const [viagens, setViagens] = useState([])
    const [currentViagem, setCurrentViagem] = useState({ viagem: [], key: null })
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severidade, setSeveridade] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [orderBy, setOrderBy] = useState(['DATAHORA_IDA'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)

    const handleRequestSort = (event, properties) => {
        const isAsc = JSON.stringify(orderBy) === JSON.stringify(properties) && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(properties)
    }

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
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        axios
            .post(`${backendUrl}viagens/editarviagem`, { values, nr_viagem: currentViagem.viagem.NR_VIAGEM_PEDIDO }, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    viagens[currentViagem.key].ESTADO = 'PENDENTE'
                    setMessage('Viagem editada com sucesso')
                    setSeveridade('success')
                    setOpen(false)
                } else {
                    setMessage('Ocorreu um erro ao editar a viagem.')
                    setSeveridade('error')
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeveridade('error')
            })
            .finally(() => {
                formikActions.setSubmitting(false)
                setOpenAlert(true)
            })
    }

    useEffect(() => {
        getUrl('viagens/pedidosviagem')
            .then((res) => {
                if (res.data.success) {
                    const array = res.data.data

                    array.forEach((row) => {
                        row.MOTIVO = motivoIdToName[row.MOTIVO] ? motivoIdToName[row.MOTIVO] : row.MOTIVO
                    })

                    setViagens(array)
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
            .finally(() => {
                setOpenBackdrop(false)
            })
    }, [update])

    return (
        <>
            <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
            <Box mb={2} className={classes.container_header}>
                <Box mb={1} pt={1} className={classes.heading}>
                    <Typography variant="h5">
                        Pedidos de Viagem
                    </Typography>
                </Box>

                <Box mb={1} pt={1} className={classes.filter}>
                    <Tooltip title="Filter list">
                        <TextField
                            fullWidth
                            label="Filtrar"
                            onChange={handleFilter}
                        />
                    </Tooltip>
                </Box>

                <Box className={clsx(classes.box, classes.breadcrumbs)}>
                    <Typography variant="h5">
                        <Breadcrumbs
                            separator="›"
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
                                            setSeveridade={setSeveridade}
                                            setOpenAlert={setOpenAlert}
                                            setMessage={setMessage}
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
                    >
                        <TableHead>
                            <TableRow>
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['NR_VIAGEM_PEDIDO'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NR_VIAGEM_PEDIDO'])}
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
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['Origem', 'LOCALIDADE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['Origem', 'LOCALIDADE'])}
                                            >
                                                Origem
                                                {isEqual ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })()}
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['Destino', 'LOCALIDADE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['Destino', 'LOCALIDADE'])}
                                            >
                                                Destino
                                                {isEqual ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })()}
                                <Hidden smDown>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['DATAHORA_IDA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['DATAHORA_IDA'])}
                                                >
                                                    Data/Hora Ida
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['DATAHORA_VOLTA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['DATAHORA_VOLTA'])}
                                                >
                                                    Data/Hora Volta
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                </Hidden>
                                <Hidden lgDown>
                                    <TableCell>Passageiros</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Distância</TableCell>
                                    <TableCell>Custo</TableCell>
                                    <TableCell>Motorista</TableCell>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['ViagemViatura', 'MATRICULA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ViagemViatura', 'MATRICULA'])}
                                                >
                                                    Viatura
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                </Hidden>
                                <Hidden smDown>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['ESTADO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ESTADO'])}
                                                >
                                                    Estado
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                </Hidden>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortFilter(viagens, getComparator(order, orderBy), filter)
                                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                .map((row, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {row.NR_VIAGEM_PEDIDO}
                                        </TableCell>
                                        <TableCell>{row.Origem.LOCALIDADE}</TableCell>
                                        <TableCell>{row.Destino.LOCALIDADE}</TableCell>
                                        <Hidden smDown>
                                            <TableCell>{moment(row.DATAHORA_IDA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                            <TableCell>{!row.DATAHORA_VOLTA ? '-' : moment(row.DATAHORA_VOLTA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        </Hidden>
                                        <Hidden lgDown>
                                            <TableCell>{row.PASSAGEIROS}</TableCell>
                                            <TableCell>{row.MOTIVO}</TableCell>
                                            <TableCell>
                                                {(row.DISTANCIA / 1000).toFixed(2)}
                                                {' '}
                                                Km
                                            </TableCell>
                                            <TableCell>{!row.CUSTO ? '-' : `€${row.CUSTO}` }</TableCell>
                                            <TableCell>{!row.MOTORISTA ? '-' : row.MOTORISTA}</TableCell>
                                            <TableCell>{!row.ViagemViatura ? '-' : row.ViagemViatura.MATRICULA}</TableCell>
                                        </Hidden>
                                        <Hidden smDown>
                                            <TableCell>
                                                {row.ESTADO === 'PEDIDO' && <Chip style={{ backgroundColor: theme.palette.info.main }} size="small" label={row.ESTADO} />}
                                                {row.ESTADO === 'PENDENTE' && <Chip style={{ backgroundColor: theme.palette.info2.main }} size="small" label={row.ESTADO} />}
                                            </TableCell>
                                        </Hidden>
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
                                        value: Number.MAX_SAFE_INTEGER,
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
        </>
    )
}
