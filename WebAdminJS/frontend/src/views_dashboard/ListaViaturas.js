import React, { useEffect, useState } from 'react'
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, TableSortLabel,
} from '@material-ui/core'

import { useStyles } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { TabelasFooter } from '../components/tabelasFooter'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'

export default function ListaViaturas() {
    const classes = useStyles()

    const [viaturas, setViaturas] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [orderBy, setOrderBy] = useState(['NR_UTILIZADOR'])
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
        getUrl('viaturas/viaturas')
            .then((res) => {
                if (res.data.success) {
                    setViaturas(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Não foi possível obter a lista de viaturas.')
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
                <TabelasPaginasHeader
                    openBackdrop={openBackdrop}
                    handleCloseBackdrop={handleCloseBackdrop}
                    openAlert={openAlert}
                    handleCloseAlert={handleCloseAlert}
                    severity={severity}
                    message={message}
                    handleFilter={handleFilter}
                    titulo="Viaturas"
                    url="/Dashboard/Viaturas/ListaViaturas"
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
                                        const isEqual = compararListas(orderBy, ['NR_VIATURA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['NR_VIATURA'])}
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
                                        const isEqual = compararListas(orderBy, ['MATRICULA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['MATRICULA'])}
                                                >
                                                    Matricula
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
                                        const isEqual = compararListas(orderBy, ['ANO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ANO'])}
                                                >
                                                    Ano
                                                    {isEqual ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    })()}
                                    <TableCell>Capacidade</TableCell>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['Modelo', 'Marca', 'NOME_MARCA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['Modelo', 'Marca', 'NOME_MARCA'])}
                                                >
                                                    Marca
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
                                        const isEqual = compararListas(orderBy, ['Modelo', 'NOME_MODELO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['Modelo', 'NOME_MODELO'])}
                                                >
                                                    Modelo
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
                                        const isEqual = compararListas(orderBy, ['Cor', 'NOME_COR'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['Cor', 'NOME_COR'])}
                                                >
                                                    Cor
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
                                        const isEqual = compararListas(orderBy, ['NR_APOLICE_SEGURO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['NR_APOLICE_SEGURO'])}
                                                >
                                                    Apólice
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
                                        const isEqual = compararListas(orderBy, ['Seguradora', 'NOME_SEGURADORA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['Seguradora', 'NOME_SEGURADORA'])}
                                                >
                                                    Seguradora
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
                                    sortFilter(viaturas, getComparator(order, orderBy), filter, [])
                                        .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                        .map((row, key) => (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">
                                                    {row.NR_VIATURA}
                                                </TableCell>
                                                <TableCell>{row.MATRICULA}</TableCell>
                                                <TableCell>{row.ANO}</TableCell>
                                                <TableCell>{row.CAPACIDADE}</TableCell>
                                                <TableCell>{row.Modelo.Marca.NOME_MARCA}</TableCell>
                                                <TableCell>{row.Modelo.NOME_MODELO}</TableCell>
                                                <TableCell>{row.Cor.NOME_COR}</TableCell>
                                                <TableCell>{row.NR_APOLICE_SEGURO}</TableCell>
                                                <TableCell>{row.Seguradora.NOME_SEGURADORA}</TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                            <TabelasFooter
                                dados={viaturas}
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
