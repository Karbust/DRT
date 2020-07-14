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
    Slide,
    Snackbar, Hidden, Tooltip, TextField, TableSortLabel,
    Backdrop, CircularProgress, Button,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import clsx from 'clsx'

import { useStyles, TablePaginationActions } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { FormEditarUtilizador } from '../components/formEditarUtilizador'

export default function ListaAdministrativosOperador() {
    const classes = useStyles()
    const theme = useTheme()

    const [utilizadores, setUtilizadores] = useState([])
    const [currentUtilizador, setCurrentUtilizador] = useState({})
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState(['NR_UTILIZADOR'])
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

    const handleClickOpen = (row) => {
        setCurrentUtilizador(row)
        setOpen(true)
    }

    useEffect(() => {
        getUrl('user/listaadministrativosoperador')
            .then((res) => {
                if (res.data.success) {
                    setUtilizadores(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage(res.data.message)
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
                            Administrativos do Operador
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
                                    to="/Dashboard/Clientes/ListarClientes"
                                    aria-current="page"
                                >
                                    Administrativos do Operador
                                </Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <FormEditarUtilizador
                    open={open}
                    setOpen={setOpen}
                    currentUtilizador={currentUtilizador}
                    setCurrentUtilizador={setCurrentUtilizador}
                />
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
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['NOME_UTILIZADOR'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['NOME_UTILIZADOR'])}
                                                >
                                                    Nome
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
                                        const isEqual = compararListas(orderBy, ['DATA_NASCIMENTO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['DATA_NASCIMENTO'])}
                                                >
                                                    Data Nascimento
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
                                            const isEqual = compararListas(orderBy, ['N_CC'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['N_CC'])}
                                                    >
                                                        NCC
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
                                            const isEqual = compararListas(orderBy, ['N_SEGSOCIAL'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['N_SEGSOCIAL'])}
                                                    >
                                                        NSS
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
                                            const isEqual = compararListas(orderBy, ['NIF'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['NIF'])}
                                                    >
                                                        NIF
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
                                        <TableCell>Género</TableCell>
                                        <TableCell>Telemóvel</TableCell>
                                        <TableCell>Freguesia</TableCell>
                                    </Hidden>
                                    <TableCell>Opções</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortFilter(utilizadores, getComparator(order, orderBy), filter, ['NR_UTILIZADOR', 'NOME_UTILIZADOR', 'DATA_NASCIMENTO', 'N_CC', 'N_SEGSOCIAL', 'NIF', 'GENERO', 'N_TELEMOVEL', 'FREGUESIA'])
                                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {row.NR_UTILIZADOR}
                                            </TableCell>
                                            <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                                            <TableCell>{moment(row.DATA_NASCIMENTO).format('DD-MM-YYYY')}</TableCell>
                                            <Hidden smDown>
                                                <TableCell>{row.N_CC}</TableCell>
                                                <TableCell>{row.N_SEGSOCIAL}</TableCell>
                                                <TableCell>{row.NIF}</TableCell>
                                            </Hidden>
                                            <Hidden lgDown>
                                                <TableCell>{row.GENERO}</TableCell>
                                                <TableCell>{row.N_TELEMOVEL}</TableCell>
                                                <TableCell>{row.FREGUESIA}</TableCell>
                                            </Hidden>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disableElevation
                                                    onClick={() => handleClickOpen(row)}
                                                    style={{ marginRight: theme.spacing(3) }}
                                                >
                                                    ABRIR
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
                                        colSpan={11}
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
