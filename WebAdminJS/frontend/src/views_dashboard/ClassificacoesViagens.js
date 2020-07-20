import React, { useEffect, useState } from 'react'
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, TableSortLabel, Hidden,
} from '@material-ui/core'
import moment from 'moment'

import { useStyles } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { TabelasFooter } from '../components/tabelasFooter'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'

export default function ClassificacoesViagens() {
    const classes = useStyles()

    const [classificacoes, setClassificacoes] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [orderBy, setOrderBy] = useState(['NR_VIAGEM_CLASSIFICACAO'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }
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

    useEffect(() => {
        getUrl('viagens/classificacoes')
            .then((res) => {
                if (res.data.success) {
                    setClassificacoes(res.data.data)
                } else {
                    setMessage('Não foi possível obter as classificações.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch((err) => {
                console.log(err)
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
                setOpenAlert(true)
            })
            .finally(() => {
                setOpenBackdrop(false)
            })
    }, [])

    return (
        <>
            <div className={classes.root}>
                <TabelasPaginasHeader
                    openBackdrop={openBackdrop}
                    handleCloseBackdrop={handleCloseBackdrop}
                    openAlert={openAlert}
                    handleCloseAlert={handleCloseAlert}
                    severity={severity}
                    message={message}
                    handleFilter={handleFilter}
                    titulo="Lista Classificações"
                    url="/Dashboard/Viagens/ListaClassificacoes"
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
                                        const isEqual = compararListas(orderBy, ['NR_VIAGEM_CLASSIFICACAO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['NR_VIAGEM_CLASSIFICACAO'])}
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
                                    <Hidden smDown>
                                        {(() => {
                                        const isEqual = compararListas(orderBy, ['NrCliente', 'NOME_UTILIZADOR'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['NrCliente', 'NOME_UTILIZADOR'])}
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
                                    </Hidden>
                                    <Hidden lgDown>
                                        {(() => {
                                            const isEqual = compararListas(orderBy, ['Viagem', 'Motorista', 'NOME_UTILIZADOR'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['Viagem', 'Motorista', 'NOME_UTILIZADOR'])}
                                                    >
                                                        Motorista
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
                                            const isEqual = compararListas(orderBy, ['Viagem', 'Origem', 'LOCALIDADE'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['Viagem', 'Origem', 'LOCALIDADE'])}
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
                                            const isEqual = compararListas(orderBy, ['Viagem', 'Destino', 'LOCALIDADE'])
                                            return (
                                                <TableCell
                                                    sortDirection={isEqual ? order : false}
                                                >
                                                    <TableSortLabel
                                                        active={isEqual}
                                                        direction={isEqual ? order : 'asc'}
                                                        onClick={(e) => handleRequestSort(e, ['Viagem', 'Destino', 'LOCALIDADE'])}
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
                                    </Hidden>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['CLASSIFICACAO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['CLASSIFICACAO'])}
                                                >
                                                    Classificação
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
                                        const isEqual = compararListas(orderBy, ['COMENTARIO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['COMENTARIO'])}
                                                >
                                                    Comentário
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
                                        const isEqual = compararListas(orderBy, ['createdAt'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['createdAt'])}
                                                >
                                                    Data Classificação
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    sortFilter(classificacoes, getComparator(order, orderBy), filter, [])
                                        .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                        .map((row, key) => (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">
                                                    {row.NR_VIAGEM_CLASSIFICACAO}
                                                </TableCell>
                                                <TableCell>{row.NR_VIAGEM}</TableCell>
                                                <Hidden smDown>
                                                    <TableCell>{row.NrCliente.NOME_UTILIZADOR}</TableCell>
                                                </Hidden>
                                                <Hidden lgDown>
                                                    <TableCell>{row.Viagem.Motorista.NOME_UTILIZADOR}</TableCell>
                                                    <TableCell>{row.Viagem.Origem.LOCALIDADE}</TableCell>
                                                    <TableCell>{row.Viagem.Destino.LOCALIDADE}</TableCell>
                                                </Hidden>
                                                <TableCell>{`${row.CLASSIFICACAO}/5`}</TableCell>
                                                <Hidden smDown>
                                                    <TableCell>{!row.COMENTARIO ? '-' : row.COMENTARIO}</TableCell>
                                                </Hidden>
                                                <TableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                            <TabelasFooter
                                dados={classificacoes}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        </>
    )
}
