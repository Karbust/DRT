import express from 'express'
import { checkToken, authorize, Role } from '../middleware/jwt.js'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const userRouter = express.Router()

const DIR = './src/public/documentos/'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, uuidv4() + '-' + fileName)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
    }
})

import { userController } from '../controllers/utilizadoresController.js'

userRouter.get('/listaadministradores',
    checkToken,
    authorize([Role.Administrador]),
    userController.listaAdministradores,
)
userRouter.get('/listaadministrativos',
    checkToken,
    authorize([Role.Administrador]),
    userController.listaAdministrativos,
)
userRouter.get('/listaadministradoresoperador',
    checkToken,
    authorize([Role.Administrador]),
    userController.ListaAdministradoresOperador,
)
userRouter.get('/listatelefonistas',
    checkToken,
    authorize([Role.Administrador, Role.AdministradorOperador]),
    userController.listaTelefonistas,
)
userRouter.get('/listamotoristas',
    checkToken,
    authorize([Role.Administrador, Role.AdministradorOperador]),
    userController.listaMotoristas,
)
userRouter.get('/listaadministrativosoperador',
    checkToken,
    authorize([Role.Administrador, Role.AdministradorOperador]),
    userController.listaAdministrativosOperador,
)
userRouter.get('/listaclientes',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.listaClientes,
)
userRouter.post('/editarutilizador',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.editarUtilizador,
)
userRouter.get('/motoristas',
    checkToken,
    authorize([Role.Administrador, Role.AdministradorOperador, Role.AdministrativoOperador]),
    userController.listarMotoristas
)
userRouter.get('/utilizadoresnaovalidados',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.listaUtilizadoresNaoValidados
)
userRouter.get('/registosnaovalidados',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.listaRegistosNaoValidados
)
userRouter.get('/apagarregistonaovalidado',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.apagarRegistoNaoValidado
)
userRouter.post('/validacaoconta',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.validacaoConta
)
userRouter.post('/verificarconta',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.verificarConta
)
userRouter.post('/verificarcontalink',
    userController.verificarContaLink
)
userRouter.post('/verificarcontaenvioemail',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.verificarContaEnvioEmail
)
userRouter.post('/listarncc',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    userController.listarNcc
)
userRouter.post('/registar',
    checkToken,
    authorize([Role.Administrador, Role.Administrativo]),
    upload.array('files', 2),
    userController.registar
)
userRouter.post('/registarapp',
    upload.array('files', 2),
    userController.registarApp
)
userRouter.post('/login',
    userController.login
)
userRouter.post('/loginapp',
    userController.loginApp
)
userRouter.post('/verificar_login',
    userController.verificar_login
)

export { userRouter }
