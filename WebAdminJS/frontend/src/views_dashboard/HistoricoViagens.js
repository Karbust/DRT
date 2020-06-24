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
    TablePagination,
    TableFooter,
    Chip,
    Slide,
    Snackbar,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'

import { useStyles, TablePaginationActions } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'

export default function RegistosNaoValidados() {
    const classes = useStyles()
    const theme = useTheme()

    const [viagens, setViagens] = useState([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [update, setUpdate] = React.useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    useEffect(() => {
        axios
            .get(`${backendUrl}viagens/historicoviagens`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setViagens(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Não foi possível obter o histórico de viagens.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            }).catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
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
                    <Alert onClose={handleCloseAlert} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant="h4">
                            Histórico de Viagens
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
                                    <TableCell># Viagem</TableCell>
                                    <TableCell>Origem</TableCell>
                                    <TableCell>Destino</TableCell>
                                    <TableCell>Data/Hora Ida</TableCell>
                                    <TableCell>Data/Hora Volta</TableCell>
                                    <TableCell>Passageiros</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Distância</TableCell>
                                    <TableCell>Custo</TableCell>
                                    <TableCell>Comparticipação CMV</TableCell>
                                    <TableCell>Motorista</TableCell>
                                    <TableCell>Estado</TableCell>
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
                                        <TableCell>{row.MOTIVO}</TableCell>
                                        <TableCell>{row.DISTANCIA}</TableCell>
                                        <TableCell>
                                            €
                                            {row.CUSTO}
                                        </TableCell>
                                        <TableCell>
                                            €
                                            {row.COMPARTICIPACAO}
                                        </TableCell>
                                        <TableCell>{row.Motorista.NOME_UTILIZADOR}</TableCell>
                                        <TableCell>
                                            {row.ESTADO === 'CONCLUIDA' && <Chip style={{ backgroundColor: theme.palette.success.main }} size="small" label={row.ESTADO} />}
                                            {row.ESTADO === 'CANCELADA' && <Chip style={{ backgroundColor: theme.palette.warning.main }} size="small" label={row.ESTADO} />}
                                            {row.ESTADO === 'FALTA' && <Chip style={{ backgroundColor: theme.palette.error.main }} size="small" label={row.ESTADO} />}
                                            {row.ESTADO === 'DECORRER' && <Chip style={{ backgroundColor: theme.palette.info3.main }} size="small" label={row.ESTADO} />}
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
