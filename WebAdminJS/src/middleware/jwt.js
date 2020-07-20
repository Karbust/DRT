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
let RolesAllowed = {
    1: [Role.Administrador],
    2: [Role.Administrador],
    3: [Role.Administrador],
    4: [Role.Administrador, Role.AdministradorOperador],
    5: [Role.Administrador, Role.AdministradorOperador],
    6: [Role.Administrador, Role.AdministradorOperador],
    7: [Role.Administrador, Role.Administrador, Role.Administrativo]
}
let checkRole = (roles = [], tipoUser) => {
    return (roles && roles.includes(tipoUser))
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
            if (!checkRole(roles, req.decoded.tipo_utilizador)){
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            next()
        }
    ]
}

let authorizeTypeUser = (req, res, next) => {
    /*console.log(req.body)
    console.log(req.file)
    console.log(req.files)*/
    if (!checkRole(RolesAllowed[req.body.tipo_utilizador], req.decoded.tipo_utilizador)) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized1'
        })
    }

    next()
}

export { checkToken, authorize, Role, authorizeTypeUser }
