import jwt from 'jsonwebtoken'
import { jwt as jwtSecret } from '../config/config.js'

let Role = {
    Administrador: 1,
    Administrativo: 2,
    AdministradorOperador: 3,
    Telefonista: 4,
    Motorista: 5,
    AdministrativoOperador: 6,
    Utilizador: 7
}
let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] ||
        req.headers['authorization']
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'O token não é válido.'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.status(400).json({
            success: false,
            message: 'Token indisponível.'
        })
    }
}
function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles]
    }

    return [
        (req, res, next) => {
            if (roles.length && !roles.includes(req.decoded.tipo_utilizador)) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            next()
        }
    ]
}

export { checkToken, authorize, Role }
