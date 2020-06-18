import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { backendUrl } from '../configs'
import authHeader from '../components/auth-header'
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
    IconButton,
} from '@material-ui/core'
import {
    NavigateNext, FirstPage, LastPage, KeyboardArrowRight, KeyboardArrowLeft,
} from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useStyles } from '../components/MuiStyles'
import moment from 'moment'

function TablePaginationActions(props) {
    const classes = useStyles()
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
        <div className={classes.TablePagination}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage/> : <FirstPage/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}
                aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> :
                    <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> :
                    <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage/> : <LastPage/>}
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

export default function RegistosNaoValidados() {
    const classes = useStyles()

    const [viagens, setViagens] = useState([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [update, setUpdate] = React.useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    useEffect(() => {
        axios
            .get(backendUrl + 'user/historicoviagens', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setViagens(res.data.data)
                    setUpdate(false)
                }
            })
    }, [update])

    return (
        <>
            <div className={classes.root}>
                <Box mb={2} className={classes.container}>
                    <Box mb={1} pt={1}>
                        <Typography variant={'h4'}>
                            Histórico de Viagens
                        </Typography>
                    </Box>
                    <Box mb={1} pt={1} className={classes.box}>
                        <Typography variant={'h5'}>
                            <Breadcrumbs
                                separator={<NavigateNext fontSize="small"/>}
                                aria-label="breadcrumb">
                                <Link color="inherit" component={RouterLink}
                                    to='/'>
                                    Início
                                </Link>
                                <Link color="textPrimary" component={RouterLink}
                                    to='/Dashboard/Utilizadores/ValidarRegistoCliente'
                                    aria-current="page">Histórico de Viagens</Link>
                            </Breadcrumbs>
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <TableContainer component={Paper}>
                        <Table className={classes.root}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Viagem</TableCell>
                                    <TableCell>Origem</TableCell>
                                    <TableCell>Destino</TableCell>
                                    <TableCell>Data/Hora Ida</TableCell>
                                    <TableCell>Data/Hora Volta</TableCell>
                                    <TableCell>Passageiros</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Distância</TableCell>
                                    <TableCell>Custo</TableCell>
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
                                        <TableCell>{row.ORIGEM}</TableCell>
                                        <TableCell>{row.DESTINO}</TableCell>
                                        <TableCell>{moment(row.DATAHORA_IDA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{moment(row.DATAHORA_VOLTA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{row.PASSAGEIROS}</TableCell>
                                        <TableCell>{row.MOTIVO}</TableCell>
                                        <TableCell>{row.DISTANCIA}</TableCell>
                                        <TableCell>{row.CUSTO}</TableCell>
                                        <TableCell>{row.MOTORISTA}</TableCell>
                                        <TableCell>{row.ESTADO}</TableCell>
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
