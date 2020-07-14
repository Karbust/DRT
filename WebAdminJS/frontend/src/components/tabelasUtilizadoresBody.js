import {
    Button,
    Hidden,
    TableBody,
    TableCell,
    TableRow,
    useTheme,
} from '@material-ui/core'
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

import { getComparator, sortFilter } from './functions'

export const TabelasUtilizadoresBody = (props) => {
    const theme = useTheme()
    const {
        dados, order, orderBy, filter, page, rowsPerPage, handleClickOpen,
    } = props
    return (
        <TableBody>
            {
                sortFilter(dados, getComparator(order, orderBy), filter, ['NR_UTILIZADOR', 'NOME_UTILIZADOR', 'DATA_NASCIMENTO', 'N_CC', 'N_SEGSOCIAL', 'NIF', 'GENERO', 'N_TELEMOVEL', 'FREGUESIA'])
                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                    .map((row, key) => (
                        <TableRow key={key}>
                            <TableCell component="th" scope="row">
                                {row.NR_UTILIZADOR}
                            </TableCell>
                            <TableCell>{row.NOME_UTILIZADOR}</TableCell>
                            <TableCell>{moment(row.DATA_NASCIMENTO).format('DD-MM-YYYY')}</TableCell>
                            <Hidden smDown>
                                <TableCell>{row.N_CC}</TableCell>
                                <TableCell>{row.N_SEGSOCIAL}</TableCell>
                                <TableCell>{row.NIF}</TableCell>
                            </Hidden>
                            <Hidden lgDown>
                                <TableCell>{row.GENERO}</TableCell>
                                <TableCell>{row.N_TELEMOVEL}</TableCell>
                                <TableCell>{row.FREGUESIA}</TableCell>
                            </Hidden>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={() => handleClickOpen(row)}
                                    style={{ marginRight: theme.spacing(3) }}
                                >
                                    ABRIR
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
            }
        </TableBody>
    )
}
TabelasUtilizadoresBody.defaultProps = {
    filter: '',
}
TabelasUtilizadoresBody.propTypes = {
    dados: PropTypes.instanceOf(Array).isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.instanceOf(Array).isRequired,
    filter: PropTypes.string,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    handleClickOpen: PropTypes.func.isRequired,
}
