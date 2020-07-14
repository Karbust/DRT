import {
    Hidden, TableCell, TableHead, TableRow, TableSortLabel,
} from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

import { compararListas } from './functions'
import { useStyles } from './MuiStyles'

export const TabelasUtilizadoresHeader = (props) => {
    const classes = useStyles()
    const { order, orderBy, handleRequestSort } = props
    return (
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
                    const isEqual = compararListas(orderBy, ['DATA_NASCIMENTO'])
                    return (
                        <TableCell
                            sortDirection={isEqual ? order : false}
                        >
                            <TableSortLabel
                                active={isEqual}
                                direction={isEqual ? order : 'asc'}
                                onClick={(e) => handleRequestSort(e, ['DATA_NASCIMENTO'])}
                            >
                                Data Nascimento
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
                        const isEqual = compararListas(orderBy, ['N_CC'])
                        return (
                            <TableCell
                                sortDirection={isEqual ? order : false}
                            >
                                <TableSortLabel
                                    active={isEqual}
                                    direction={isEqual ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, ['N_CC'])}
                                >
                                    NCC
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
                        const isEqual = compararListas(orderBy, ['N_SEGSOCIAL'])
                        return (
                            <TableCell
                                sortDirection={isEqual ? order : false}
                            >
                                <TableSortLabel
                                    active={isEqual}
                                    direction={isEqual ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, ['N_SEGSOCIAL'])}
                                >
                                    NSS
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
                        const isEqual = compararListas(orderBy, ['NIF'])
                        return (
                            <TableCell
                                sortDirection={isEqual ? order : false}
                            >
                                <TableSortLabel
                                    active={isEqual}
                                    direction={isEqual ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, ['NIF'])}
                                >
                                    NIF
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
                    <TableCell>Género</TableCell>
                    <TableCell>Telemóvel</TableCell>
                    <TableCell>Freguesia</TableCell>
                </Hidden>
                <TableCell>Opções</TableCell>
            </TableRow>
        </TableHead>
    )
}
TabelasUtilizadoresHeader.propTypes = {
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.instanceOf(Array).isRequired,
    handleRequestSort: PropTypes.func.isRequired,
}
