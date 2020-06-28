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
userRouter.get('/listar', checkToken, userController.listar)
userRouter.get('/motoristas', /*checkToken,*/ userController.listarMotoristas)
userRouter.get('/utilizadoresnaovalidados', checkToken, userController.listaUtilizadoresNaoValidados)
userRouter.get('/registosnaovalidados', /*checkToken,*/ userController.listaRegistosNaoValidados)
userRouter.get('/apagarregistonaovalidado', checkToken, userController.apagarRegistoNaoValidado)
userRouter.post('/validacaoconta', checkToken, userController.validacaoConta)
userRouter.post('/verificarconta', checkToken, userController.verificarConta)
userRouter.post('/verificarcontalink', userController.verificarContaLink)
userRouter.post('/verificarcontaenvioemail', checkToken, userController.verificarContaEnvioEmail)
userRouter.post('/listarncc', /*checkToken,*/ userController.listarNcc)
userRouter.post('/register', upload.array('files', 2), userController.registar)
userRouter.post('/login', userController.login)
userRouter.post('/verificar_login', userController.verificar_login)
userRouter.post('/testes', userController.testes)

export { userRouter }
