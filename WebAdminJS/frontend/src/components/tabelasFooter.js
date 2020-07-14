import { TableFooter, TablePagination, TableRow } from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

import { TablePaginationActions } from './MuiStyles'

export const TabelasFooter = (props) => {
    const {
        dados, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
    } = props
    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, {
                        label: 'Todos',
                        value: Number.MAX_SAFE_INTEGER,
                    }]}
                    colSpan={11}
                    count={dados.length}
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
    )
}
TabelasFooter.propTypes = {
    dados: PropTypes.instanceOf(Array).isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
}
