export const getNumberFromChar = (letter) => {
    switch (letter) {
        case '0' : return 0
        case '1' : return 1
        case '2' : return 2
        case '3' : return 3
        case '4' : return 4
        case '5' : return 5
        case '6' : return 6
        case '7' : return 7
        case '8' : return 8
        case '9' : return 9
        case 'A' : return 10
        case 'B' : return 11
        case 'C' : return 12
        case 'D' : return 13
        case 'E' : return 14
        case 'F' : return 15
        case 'G' : return 16
        case 'H' : return 17
        case 'I' : return 18
        case 'J' : return 19
        case 'K' : return 20
        case 'L' : return 21
        case 'M' : return 22
        case 'N' : return 23
        case 'O' : return 24
        case 'P' : return 25
        case 'Q' : return 26
        case 'R' : return 27
        case 'S' : return 28
        case 'T' : return 29
        case 'U' : return 30
        case 'V' : return 31
        case 'W' : return 32
        case 'X' : return 33
        case 'Y' : return 34
        case 'Z' : return 35
        default:
            throw new Error()
    }
}

export const validateNCC = (ncc) => {
    if (ncc.length !== 12) {
        return false
    }

    let sum = 0, secondDigit = false

    for (let i = ncc.length - 1; i >= 0; --i) {
        let valor = getNumberFromChar(ncc[i])

        if (secondDigit) {
            valor *= 2
            if (valor > 9) {
                valor -= 9
            }
        }

        sum += valor
        secondDigit = !secondDigit
    }
    console.log((sum % 10) === 0)
    return (sum % 10) === 0
}

export const validateNSS = (nss) => {
    if(nss.length !== 11) {
        return false
    }

    if(!['1', '2'].includes(nss.substr(0, 1))) {
        return false
    }

    let table = [29, 23, 19, 17, 13, 11, 7, 5, 3, 2]
    let soma = 0
    for(let i = 0; i < nss.length - 1; i++) {
        soma += nss[i]*table[i]
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
