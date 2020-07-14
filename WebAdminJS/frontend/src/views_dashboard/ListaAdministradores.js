import React, { useEffect, useState } from 'react'
import {
    Box,
    Table,
    TableContainer,
    Paper,
} from '@material-ui/core'

import { useStyles } from '../components/MuiStyles'
import { getUrl } from '../components/functions'
import { FormEditarUtilizador } from '../components/formEditarUtilizador'
import { TabelasUtilizadoresHeader } from '../components/tabelasUtilizadoresHeader'
import { TabelasUtilizadoresBody } from '../components/tabelasUtilizadoresBody'
import { TabelasFooter } from '../components/tabelasFooter'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'

export default function ListaAdministradores() {
    const classes = useStyles()

    const [administradores, setAdministradores] = useState([])
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
        getUrl('user/listaadministradores')
            .then((res) => {
                if (res.data.success) {
                    setAdministradores(res.data.data)
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
                titulo="Administradores"
                url="/Dashboard/Administracao/ListarAdministradores"
            />
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
                        <TabelasUtilizadoresHeader
                            handleRequestSort={handleRequestSort}
                            order={order}
                            orderBy={orderBy}
                        />
                        <TabelasUtilizadoresBody
                            dados={administradores}
                            order={order}
                            orderBy={orderBy}
                            filter={filter}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleClickOpen={handleClickOpen}
                        />
                        <TabelasFooter
                            dados={administradores}
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
