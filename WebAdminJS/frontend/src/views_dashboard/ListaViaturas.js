import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../configs'
import authHeader from '../components/auth-header'
import {
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
import { NavigateNext } from '@material-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useStyles, TablePaginationActions } from '../components/MuiStyles'

export default function ValidarRegistos() {
    const classes = useStyles()

    const [viaturas, setViaturas] = useState([])
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
            .get(backendUrl + 'viaturas/viaturas', { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.data)
                    setViaturas(res.data.data)
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
                            Lista de Viaturas
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
                                    to='/Dashboard/Utilizadores/ListaViaturas'
                                    aria-current="page">Lista de Viaturas</Link>
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
                                    <TableCell># Viatura</TableCell>
                                    <TableCell>Matrícula</TableCell>
                                    <TableCell>Ano</TableCell>
                                    <TableCell>Capacidade</TableCell>
                                    <TableCell>Marca</TableCell>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell>Cor</TableCell>
                                    <TableCell># Apólice</TableCell>
                                    <TableCell>Seguradora</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? viaturas.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    : viaturas
                                ).map((row, key) => (
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
                                        count={viaturas.length}
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
