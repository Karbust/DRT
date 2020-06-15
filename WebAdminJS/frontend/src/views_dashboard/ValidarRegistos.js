import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types';
import { backendUrl } from '../configs'
import authHeader from '../components/auth-header'
import {
    makeStyles, useTheme, Box, Breadcrumbs, Link, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, TableFooter
} from '@material-ui/core'
import { NavigateNext, FirstPage, LastPage, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useStyles } from '../components/MuiStyles'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}))

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}

export default function ValidarRegistos() {
    const classes = useStyles()

    const [utilizadores, setUtilizadores] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    useEffect(() => {
        axios
            .get(backendUrl + 'user/utilizadoresnaovalidados', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setLoading(false)
                    setUtilizadores(res.data.data)
                }
            })
    }, [])

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant={'h4'}>
                            Validar Registos
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant={'h5'}>
                            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                                <Link color="inherit" component={RouterLink} to='/'>
                                    Início
                                </Link>
                                <Link color="textPrimary" component={RouterLink} to='/Dashboard/Utilizadores/ValidarRegistoCliente' aria-current="page">RegistarVeiculo</Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table className={classes.root} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Utilizador</TableCell>
                                    <TableCell>Nome do Utilizador</TableCell>
                                    <TableCell>Freguesia</TableCell>
                                    <TableCell>Data de Criação da Conta</TableCell>
                                    <TableCell>Ações</TableCell>
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
                                        <TableCell>{moment(row.DATA_CRIACAO_CONTA).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                        <TableCell><Button variant="contained" color="primary">Teste</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
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
