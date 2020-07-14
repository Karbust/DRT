import React, { useEffect, useState } from 'react'
import {
    /* useTheme, */
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, TableSortLabel,
} from '@material-ui/core'
import moment from 'moment'
// import { useConfirm } from 'material-ui-confirm'

import { useStyles } from '../components/MuiStyles'
import { compararListas, getComparator, getUrl, sortFilter } from '../components/functions'
import { TabelasFooter } from '../components/tabelasFooter'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'

export default function RegistosNaoValidados() {
    const classes = useStyles()
    // const theme = useTheme()

    const [utilizadores, setUtilizadores] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState(['NR_UTILIZADOR'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(true)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const handleFilter = (event) => {
        setFilter(event.target.value)
    }
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

    // TODO: APAGAR O REGISTO DA BASE DE DADOS
    /*
    const [currentUtilizador, setCurrentUtilizador] = useState({ user: [], key: null })
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false)
    const confirm = useConfirm()
    const handleClickApagar = (key) => {
        setCurrentUtilizador({ user: utilizadores[key], key })
        setIsSubmittingDelete(true)
        confirm({
            title: 'Apagar',
            description: 'Apagar a conta vai fazer com que seja permanentemente removida da base de dados. Deseja continuar?',
            confirmationText: 'Apagar',
            confirmationButtonProps: {
                variant: 'outlined',
                disabled: isSubmittingDelete,
            },
            cancellationText: 'Cancelar',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        }).then(() => {
            axios
                .post(`${backendUrl}user/apagarregistonaovalidado`, { user: currentUtilizador.user.NR_UTILIZADOR }, { headers: authHeader() })
                .then((res) => {
                    if (res.data.success) {
                        setIsSubmittingDelete(false)
                        setUpdate(true)
                    }
                })
        })
    } */

    useEffect(() => {
        getUrl('user/registosnaovalidados')
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
            <TabelasPaginasHeader
                openBackdrop={openBackdrop}
                handleCloseBackdrop={handleCloseBackdrop}
                openAlert={openAlert}
                handleCloseAlert={handleCloseAlert}
                severity={severity}
                message={message}
                handleFilter={handleFilter}
                titulo="Registos Não Validados"
                url="/Dashboard/Clientes/RegistosNaoValidados"
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
                                    const isEqual = compararListas(orderBy, ['FREGUESIA'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['FREGUESIA'])}
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
                                                Data de Criação
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
                                    const isEqual = compararListas(orderBy, ['NOME_VALIDADOR'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NOME_VALIDADOR'])}
                                            >
                                                Validador
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
                                    const isEqual = compararListas(orderBy, ['deletedAt'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['deletedAt'])}
                                            >
                                                Data da Validação
                                                {isEqual ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })()}
                                {/* <TableCell>Ações</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sortFilter(utilizadores, getComparator(order, orderBy), filter, [])
                                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {row.NR_UTILIZADOR}
                                            </TableCell>
                                            <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                                            <TableCell>{row.FREGUESIA}</TableCell>
                                            <TableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                            <TableCell>{row.NOME_VALIDADOR}</TableCell>
                                            <TableCell>{moment(row.deletedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                            {/* <TableCell>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disableElevation
                                                    onClick={() => handleClickApagar(key)}
                                                    style={{ marginRight: theme.spacing(3) }}
                                                >
                                                    Apagar
                                                </Button>
                                            </TableCell> */}

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
