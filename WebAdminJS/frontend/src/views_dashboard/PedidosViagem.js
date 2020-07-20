import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    useMediaQuery,
    Hidden,
    TableSortLabel,
} from '@material-ui/core'
import moment from 'moment'
import { Formik } from 'formik'
import { useConfirm } from 'material-ui-confirm'

import { StyledButton, useStyles, Transition } from '../components/MuiStyles'
import authHeader from '../components/auth-header'
import { backendUrl } from '../configs'
import { FormPedidosViagem } from '../components/formPedidosViagem'
import { getUrl, getComparator, compararListas, sortFilter } from '../components/functions'
import { TabelasPaginasHeader } from '../components/tabelasPaginasHeader'
import { TabelasFooter } from '../components/tabelasFooter'

export default function PedidosViagem() {
    const classes = useStyles()
    const theme = useTheme()
    const confirm = useConfirm()

    const [viagens, setViagens] = useState([])
    //const [currentViagem, setCurrentViagem] = useState({ viagem: [], key: null })
    const [currentViagem, setCurrentViagem] = useState({})
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(true)
    const [isCanceling, setIsCanceling] = useState(false)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [orderBy, setOrderBy] = useState(['DATAHORA_IDA'])
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState(null)

    const handleRequestSort = (event, properties) => {
        const isAsc = JSON.stringify(orderBy) === JSON.stringify(properties) && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(properties)
    }

    const handleClickOpen = (key) => {
        setCurrentViagem(viagens.find(x => x.NR_VIAGEM_PEDIDO === key))
        setOpen(true)
    }
    const handleClickCancelar = (key) => {
        setIsCanceling(true)
        confirm({
            title: 'Cancelar Viagem',
            description: 'Deseja cancelar a viagem?',
            confirmationText: 'Sim',
            confirmationButtonProps: {
                variant: 'outlined',
            },
            cancellationText: 'Não',
            cancellationButtonProps: {
                variant: 'outlined',
            },
        })
            .then(() => {
                axios
                    .post(`${backendUrl}viagens/atualizarestadoviagemcancelada`, { nr_viagem: viagens.find(x => x.NR_VIAGEM_PEDIDO === key).NR_VIAGEM_PEDIDO }, { headers: authHeader() })
                    .then((res) => {
                        if (res.data.success) {
                            setIsCanceling(false)
                            setMessage('Viagem cancelada com sucesso.')
                            setSeverity('success')
                        } else {
                            setIsCanceling(false)
                            setMessage('Ocorreu um erro ao cancelar a viagem.')
                            setSeverity('error')
                        }
                    })
                    .catch(() => {
                        setIsCanceling(false)
                        setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                        setSeverity('error')
                    })
                    .finally(() => {
                        setOpenAlert(true)
                    })
            }).catch(() => {
                setIsCanceling(false)
            })
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
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

    const onFormikSubmit = (values, formikActions) => {
        formikActions.setSubmitting(true)
        axios
            .post(`${backendUrl}viagens/editarviagem`, { values, nr_viagem: currentViagem.NR_VIAGEM_PEDIDO }, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setMessage('Viagem editada com sucesso')
                    setSeverity('success')
                    setOpen(false)
                } else {
                    setMessage('Ocorreu um erro ao editar a viagem.')
                    setSeverity('error')
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao enviar o pedido para o servidor.')
                setSeverity('error')
            })
            .finally(() => {
                formikActions.setSubmitting(false)
                setOpenAlert(true)
            })
    }

    useEffect(() => {
        getUrl('viagens/pedidosviagem')
            .then((res) => {
                if (res.data.success) {
                    setViagens(res.data.data)
                    setUpdate(false)
                } else {
                    setMessage('Ocorreu um erro ao obter a lista de viagens.')
                    setSeverity('error')
                    setOpenAlert(true)
                }
            })
            .catch(() => {
                setMessage('Ocorreu um erro ao pedir a lista de viagens ao servidor.')
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
                titulo="Pedidos de Viagem"
                url="/Dashboard/Viagens/PedidosViagem"
            />
            <Dialog
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
                open={open}
                scroll="paper"
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Validação de Conta de Utilizador</DialogTitle>

                <Formik
                    onSubmit={onFormikSubmit}
                    validateOnBlur={false}
                    validateOnChange={false}
                    initialValues={{
                        origem: currentViagem.ORIGEM,
                        destino: currentViagem.DESTINO,
                        passageiros: currentViagem.PASSAGEIROS,
                        motivo: currentViagem.MOTIVO,
                        datahora_ida: currentViagem.DATAHORA_IDA,
                        datahora_volta: currentViagem.DATAHORA_VOLTA,
                        nrcliente: currentViagem.NR_CLIENTE_PEDIDO,
                        observacoes: currentViagem.OBSERVACOES || '',
                        distancia: currentViagem.DISTANCIA,
                        duracao: currentViagem.DURACAO,
                        custo: currentViagem.CUSTO || '',
                        comparticipacao: currentViagem.CUSTO || '',
                        motorista: currentViagem.MOTORISTA || 0,
                        viatura: currentViagem.VIATURA || 0,
                    }}
                >
                    {({
                        submitForm,
                        isValid,
                        isSubmitting,
                    }) => {
                        return (
                            <>
                                <DialogContent dividers>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        submitForm()
                                    }}
                                    >
                                        <FormPedidosViagem
                                            setSeveridade={setSeverity}
                                            setOpenAlert={setOpenAlert}
                                            setMessage={setMessage}
                                            currentViagem={currentViagem}
                                        />
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleClose}
                                        variant="outlined"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <StyledButton
                                        onClick={submitForm}
                                        color="primary"
                                        style={{ width: '115px' }}
                                        disabled={!isValid || isSubmitting}
                                    >
                                        {isSubmitting && (
                                            <CircularProgress color="inherit" />)}
                                        {!isSubmitting && 'Guardar'}
                                    </StyledButton>
                                </DialogActions>
                            </>
                        )
                    }}
                </Formik>
            </Dialog>
            <Box mb={2}>
                <TableContainer component={Paper}>
                    <Table
                        className={classes.root}
                    >
                        <TableHead>
                            <TableRow>
                                {(() => {
                                    const isEqual = compararListas(orderBy, ['NR_VIAGEM_PEDIDO'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['NR_VIAGEM_PEDIDO'])}
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
                                    const isEqual = compararListas(orderBy, ['Origem', 'LOCALIDADE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['Origem', 'LOCALIDADE'])}
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
                                    const isEqual = compararListas(orderBy, ['Destino', 'LOCALIDADE'])
                                    return (
                                        <TableCell
                                            sortDirection={isEqual ? order : false}
                                        >
                                            <TableSortLabel
                                                active={isEqual}
                                                direction={isEqual ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, ['Destino', 'LOCALIDADE'])}
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
                                <Hidden smDown>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['DATAHORA_IDA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['DATAHORA_IDA'])}
                                                >
                                                    Data/Hora Ida
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
                                        const isEqual = compararListas(orderBy, ['DATAHORA_VOLTA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['DATAHORA_VOLTA'])}
                                                >
                                                    Data/Hora Volta
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
                                    <TableCell>Passageiros</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Distância</TableCell>
                                    <TableCell>Custo</TableCell>
                                    <TableCell>Motorista</TableCell>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['ViagemViatura', 'MATRICULA'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ViagemViatura', 'MATRICULA'])}
                                                >
                                                    Viatura
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
                                <Hidden smDown>
                                    {(() => {
                                        const isEqual = compararListas(orderBy, ['ESTADO'])
                                        return (
                                            <TableCell
                                                sortDirection={isEqual ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={isEqual}
                                                    direction={isEqual ? order : 'asc'}
                                                    onClick={(e) => handleRequestSort(e, ['ESTADO'])}
                                                >
                                                    Estado
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
                                sortFilter(viagens, getComparator(order, orderBy), filter, [])
                                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {row.NR_VIAGEM_PEDIDO}
                                            </TableCell>
                                            <TableCell>{row.Origem.LOCALIDADE}</TableCell>
                                            <TableCell>{row.Destino.LOCALIDADE}</TableCell>
                                            <Hidden smDown>
                                                <TableCell>{moment(row.DATAHORA_IDA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>{!row.DATAHORA_VOLTA ? '-' : moment(row.DATAHORA_VOLTA).format('YYYY-MM-DD HH:mm')}</TableCell>
                                            </Hidden>
                                            <Hidden lgDown>
                                                <TableCell>{row.PASSAGEIROS}</TableCell>
                                                <TableCell>{row.MOTIVO}</TableCell>
                                                <TableCell>
                                                    {(row.DISTANCIA / 1000).toFixed(2)}
                                                    {' '}
                                                    Km
                                                </TableCell>
                                                <TableCell>{!row.CUSTO ? '-' : `€${row.CUSTO}` }</TableCell>
                                                <TableCell>{!row.MOTORISTA ? '-' : row.MOTORISTA}</TableCell>
                                                <TableCell>{!row.ViagemViatura ? '-' : row.ViagemViatura.MATRICULA}</TableCell>
                                            </Hidden>
                                            <Hidden smDown>
                                                <TableCell>
                                                    {row.ESTADO === 'PEDIDO' && <Chip style={{ backgroundColor: theme.palette.info.main }} size="small" label={row.ESTADO} />}
                                                    {row.ESTADO === 'PENDENTE' && <Chip style={{ backgroundColor: theme.palette.info2.main }} size="small" label={row.ESTADO} />}
                                                </TableCell>
                                            </Hidden>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disableElevation
                                                    onClick={() => handleClickOpen(row.NR_VIAGEM_PEDIDO)}
                                                    style={{ marginRight: theme.spacing(3) }}
                                                >
                                                    EDITAR
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disableElevation
                                                    onClick={() => handleClickCancelar(row.NR_VIAGEM_PEDIDO)}
                                                    style={{ marginRight: theme.spacing(3) }}
                                                >
                                                    CANCELAR
                                                </Button>
                                            </TableCell>

                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                        <TabelasFooter
                            dados={viagens}
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
