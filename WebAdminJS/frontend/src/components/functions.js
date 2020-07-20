import axios from 'axios'

import { backendUrl } from '../configs'

import authHeader from './auth-header'

export const Role = {
    Administrador: 1,
    Administrativo: 2,
    AdministradorOperador: 3,
    Telefonista: 4,
    AdministrativoOperador: 6,
}

export const getUrl = (url) => {
    return axios.get(backendUrl + url, { headers: authHeader() })
}

export function descendingComparator(a, b, orderBy, order) {
    for (let i = 0; i < orderBy.length; i++) {
        if (a !== null) {
            a = a[orderBy[i]]
        }
        if (b !== null) {
            b = b[orderBy[i]]
        }
    }
    if ((a === null && b !== null) && order === 'asc') {
        return -1
    }
    if ((a === null && b !== null) && order === 'desc') {
        return 1
    }
    if ((a !== null && b === null) && order === 'asc') {
        return 1
    }
    if ((a !== null && b === null) && order === 'desc') {
        return -1
    }
    if (String(b).toUpperCase() < String(a).toUpperCase()) {
        return -1
    }
    if (String(b).toUpperCase() > String(a).toUpperCase()) {
        return 1
    }
    return 0
}

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, order)
        : (a, b) => -descendingComparator(a, b, orderBy, order)
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

export function compararListas(lista1, lista2) {
    return JSON.stringify(lista1) === JSON.stringify(lista2)
}

export function dfs(row, filter, columns) {
    return Object.keys(row).some((key) => {
        if (typeof columns !== 'undefined' && columns.length > 0 && !columns.includes(key)) {
            return false
        }
        if (row[key] instanceof Object) {
            if (dfs(row[key], filter, columns)) {
                return true
            }
        } else if (String(row[key]).toUpperCase().includes(filter.toUpperCase()) && row[key] !== null) {
            return true
        }
        return false
    })
}

export function filtrar(array, filter, columns) {
    return array.filter((element) => dfs(element, filter, columns))
}

export function sortFilter(array, comparator, filtro, columns) {
    const sortedArray = stableSort(array, comparator)
    return filtro === null ? sortedArray : filtrar(sortedArray, filtro, columns)
}

const charToNumberMap = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,
    'G': 16,
    'H': 17,
    'I': 18,
    'J': 19,
    'K': 20,
    'L': 21,
    'M': 22,
    'N': 23,
    'O': 24,
    'P': 25,
    'Q': 26,
    'R': 27,
    'S': 28,
    'T': 29,
    'U': 30,
    'V': 31,
    'W': 32,
    'X': 33,
    'Y': 34,
    'Z': 35,
}

export const validateNCC = (ncc) => {
    if (ncc.length !== 12) {
        return false
    }

    let sum = 0
    let secondDigit = false

    for (let i = ncc.length - 1; i >= 0; --i) {
        let valor = charToNumberMap[ncc[i]]

        if (secondDigit) {
            valor *= 2
            if (valor > 9) {
                valor -= 9
            }
        }

        sum += valor
        secondDigit = !secondDigit
    }
    return (sum % 10) === 0
}

export const validateNSS = (nss) => {
    if (nss.length !== 11) {
        return false
    }

    if (!['1', '2'].includes(nss.substr(0, 1))) {
        return false
    }

    const table = [29, 23, 19, 17, 13, 11, 7, 5, 3, 2]
    let soma = 0
    for (let i = 0; i < nss.length - 1; i++) {
        soma += nss[i] * table[i]
    }

    return Number(nss[nss.length - 1]) === 9 - (soma % 10)
}

export const validateNIF = (value) => {
    const nif = typeof value === 'string' ? value : value.toString()
    const validationSets = {
        one: ['1', '2', '3', '5', '6', '8'],
        two: ['45', '70', '71', '72', '74', '75', '77', '79', '90', '91', '98', '99'],
    }

    if (nif.length !== 9) {
        return false
    }

    if (!validationSets.one.includes(nif.substr(0, 1)) && !validationSets.two.includes(nif.substr(0, 2))) {
        return false
    }

    const total = (nif[0] * 9) + (nif[1] * 8) + (nif[2] * 7) + (nif[3] * 6) + (nif[4] * 5) + (nif[5] * 4) + (nif[6] * 3) + (nif[7] * 2)
    const modulo11 = (Number(total) % 11)

    const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11

    return checkDigit === Number(nif[8])
}
