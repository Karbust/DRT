import React, { useEffect, useState } from 'react'
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
    TablePagination,
    TableFooter,
    Chip,
    Slide,
    Snackbar, Hidden, Tooltip, TextField, TableSortLabel,
    Backdrop, CircularProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import clsx from 'clsx'

import { useStyles, TablePaginationActions } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'

export default function RegistosNaoValidados() {
    const classes = useStyles()
    const theme = useTheme()

    const [viagens, setViagens] = useState([])
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState(['DATAHORA_IDA'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
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
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }

    useEffect(() => {
        getUrl('viagens/historicoviagens')
            .then((res) => {
                if (res.data.success) {
                    setViagens(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Não foi possível obter o histórico de viagens.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
            .finally(() => {
                setOpenBackdrop(false)
            })
    }, [update])

    return (
        <>
            <div className={classes.root}>
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
                    <Alert onClose={handleCloseAlert} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <Box mb={2} className={classes.container_header}>
                    <Box mb={1} pt={1} className={classes.heading}>
                        <Typography variant="h5">
                            Histórico de Viagens
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
                                    to="/Dashboard/Utilizadores/ValidarRegistoCliente"
                                    aria-current="page"
                                >
                                    Histórico de Viagens
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.root}
                            aria-label="simple table"
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
                                        <TableCell>Comparticipação CMV</TableCell>
                                        <TableCell>Motorista</TableCell>
                                        <TableCell>Viatura</TableCell>
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
                                                <TableCell>{!row.DISTANCIA ? '-' : `${(row.DISTANCIA / 1000).toFixed(2)} Km`}</TableCell>
                                                <TableCell>{!row.CUSTO ? '-' : `€${row.CUSTO}`}</TableCell>
                                                <TableCell>{!row.CUSTO ? '-' : `€${row.COMPARTICIPACAO}`}</TableCell>
                                                <TableCell>{!row.Motorista ? '-' : row.Motorista.NOME_UTILIZADOR}</TableCell>
                                                <TableCell>{!row.ViagemViatura ? '-' : row.ViagemViatura.MATRICULA}</TableCell>
                                            </Hidden>
                                            <Hidden smDown>
                                                <TableCell>
                                                    {row.ESTADO === 'CONCLUIDA' && <Chip style={{ backgroundColor: theme.palette.success.main }} size="small" label={row.ESTADO} />}
                                                    {row.ESTADO === 'CANCELADA' && <Chip style={{ backgroundColor: theme.palette.warning.main }} size="small" label={row.ESTADO} />}
                                                    {row.ESTADO === 'FALTA' && <Chip style={{ backgroundColor: theme.palette.error.main }} size="small" label={row.ESTADO} />}
                                                    {row.ESTADO === 'DECORRER' && <Chip style={{ backgroundColor: theme.palette.info3.main }} size="small" label={row.ESTADO} />}
                                                </TableCell>
                                            </Hidden>
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
                                        colSpan={11}
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
