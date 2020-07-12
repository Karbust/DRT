import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    /* useTheme, */
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
} from '@material-ui/core'
import {
    NavigateNext,
} from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
// import { useConfirm } from 'material-ui-confirm'

import { useStyles, TablePaginationActions } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'

export default function RegistosNaoValidados() {
    const classes = useStyles()
    // const theme = useTheme()

    const [utilizadores, setUtilizadores] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [update, setUpdate] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
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
        axios
            .get(`${backendUrl}user/registosnaovalidados`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setUtilizadores(res.data.data)
                    setUpdate(false)
                }
            })
    }, [update])

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant="h5">
                            Registos Não Validados
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
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
                                    to="/Dashboard/Clientes/RegistosNaoValidados"
                                    aria-current="page"
                                >
                                    Registos Não Validados
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
                                    <TableCell>Número de Utilizador</TableCell>
                                    <TableCell>Nome do Utilizador</TableCell>
                                    <TableCell>Freguesia</TableCell>
                                    <TableCell>Data de Criação da Conta</TableCell>
                                    <TableCell>Número do Validador</TableCell>
                                    <TableCell>Nome do Validador</TableCell>
                                    <TableCell>Data da Validação</TableCell>
                                    {/* <TableCell>Ações</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? utilizadores.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    : utilizadores
                                ).map((row, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {row.NR_UTILIZADOR}
                                        </TableCell>
                                        <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                                        <TableCell>{row.FREGUESIA}</TableCell>
                                        <TableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                        <TableCell>{row.VALIDADOVALIDACOES[0].NR_VALIDADOR}</TableCell>
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
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, {
                                            label: 'Todos',
                                            value: -1,
                                        }]}
                                        colSpan={5}
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
