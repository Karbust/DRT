import React, { useEffect, useState } from 'react'
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
    Hidden, TableSortLabel, Button,
} from '@material-ui/core'

import { useStyles } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'
import { TabelasFooter } from '../components/tabelasFooter'
import { DialogDivida } from '../components/dialogDivida'

export default function ListaDividas() {
    const classes = useStyles()
    const theme = useTheme()

    const [dividas, setDividas] = useState([])
    const [currentDivida, setCurrentDivida] = useState({})
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState(['NR_CLIENTE_VIAGEM'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)
    const [openBackdrop, setOpenBackdrop] = useState(true)
    const [openDivida, setOpenDivida] = useState(false)
    const [isSubmittingDivida, setIsSubmittingDivida] = useState(0)

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

    const handleCloseDivida = () => {
        setOpenDivida(false)
    }
    const handleSubmitDivida = (messagem, severidade) => {
        setMessage(messagem)
        setSeverity(severidade)
        setOpenAlert(true)
        setIsSubmittingDivida(isSubmittingDivida + 1)
    }
    const handleClickOpenDivida = (key) => {
        setCurrentDivida(dividas.find(x => x.NR_CLIENTE_VIAGEM === key))
        setOpenDivida(true)
    }

    useEffect(() => {
        getUrl('viagens/listadividas')
            .then((res) => {
                if (res.data.success) {
                    setDividas(res.data.data)
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
    }, [update, isSubmittingDivida])

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
                titulo="Lista de Dívidas"
                url="/Dashboard/Viagens/ListaDividas"
            />
            <DialogDivida
                handleSubmitDivida={handleSubmitDivida}
                handleCloseDivida={handleCloseDivida}
                openDivida={openDivida}
                currentDivida={currentDivida}
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
                                    const isEqual = compararListas(orderBy, ['NR_VIAGEM'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NR_VIAGEM'])}
                                            >
                                                Viagem
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
                                    const isEqual = compararListas(orderBy, ['NR_CLIENTE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NR_CLIENTE'])}
                                            >
                                                Cliente
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
                                        const isEqual = compararListas(orderBy, ['ClienteViagem', 'NOME_UTILIZADOR'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ClienteViagem', 'NOME_UTILIZADOR'])}
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
                                        const isEqual = compararListas(orderBy, ['ClienteViagem', 'N_TELEMOVEL'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ClienteViagem', 'N_TELEMOVEL'])}
                                                >
                                                    Telemóvel
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
                                        const isEqual = compararListas(orderBy, ['ClienteViagem', 'MORADA_UTILIZADOR'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ClienteViagem', 'MORADA_UTILIZADOR'])}
                                                >
                                                    Morada
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
                                        const isEqual = compararListas(orderBy, ['ClienteViagem', 'COD_POSTAL'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ClienteViagem', 'COD_POSTAL'])}
                                                >
                                                    Cód. Postal
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
                                        const isEqual = compararListas(orderBy, ['ClienteViagem', 'FREGUESIA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ClienteViagem', 'FREGUESIA'])}
                                                >
                                                    Freguesia
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
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['MONTANTE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['MONTANTE'])}
                                            >
                                                Valor
                                                {isEqual ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })()}
                                <Hidden lgDown>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['ESTADO_CLIENTE'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ESTADO_CLIENTE'])}
                                                >
                                                    Estado Cliente
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
                                        const isEqual = compararListas(orderBy, ['ESTADO_PAGAMENTO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ESTADO_PAGAMENTO'])}
                                                >
                                                    Estado Pagamento
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
                            {
                                sortFilter(dividas, getComparator(order, orderBy), filter)
                                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {row.NR_VIAGEM}
                                            </TableCell>
                                            <TableCell>{row.NR_CLIENTE}</TableCell>
                                            <Hidden smDown>
                                                <TableCell>{row.ClienteViagem.NOME_UTILIZADOR}</TableCell>
                                                <TableCell>{row.ClienteViagem.N_TELEMOVEL}</TableCell>
                                                <TableCell>{row.ClienteViagem.MORADA_UTILIZADOR}</TableCell>
                                                <TableCell>{row.ClienteViagem.COD_POSTAL}</TableCell>
                                                <TableCell>{row.ClienteViagem.FREGUESIA}</TableCell>
                                            </Hidden>
                                            <TableCell>{`€${row.MONTANTE}`}</TableCell>
                                            <Hidden lgDown>
                                                <TableCell>{row.ESTADO_CLIENTE}</TableCell>
                                                <TableCell>{row.ESTADO_PAGAMENTO}</TableCell>
                                            </Hidden>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disableElevation
                                                    onClick={() => handleClickOpenDivida(row.NR_CLIENTE_VIAGEM)}
                                                    style={{ marginRight: theme.spacing(3) }}
                                                >
                                                    Editar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                        <TabelasFooter
                            dados={dividas}
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
