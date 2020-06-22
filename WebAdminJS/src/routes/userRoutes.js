let express = require('express'),
    router = express.Router(),
    middleware = require('../middleware/jwt'),
    multer = require('multer'),
    { v4: uuidv4 } = require('uuid')

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

const userController = require('../controllers/utilizadoresController')
router.get('/listar', middleware.checkToken, userController.listar)
router.get('/motoristas', /*middleware.checkToken,*/ userController.listarMotoristas)
router.get('/utilizadoresnaovalidados', middleware.checkToken, userController.listaUtilizadoresNaoValidados)
router.get('/registosnaovalidados', /*middleware.checkToken,*/ userController.listaRegistosNaoValidados)
router.get('/apagarregistonaovalidado', middleware.checkToken, userController.apagarRegistoNaoValidado)
router.post('/validacaoconta', middleware.checkToken, userController.validacaoConta)
router.post('/verificarconta', middleware.checkToken, userController.verificarConta)
router.get('/verificarconta/:token', userController.verificarContaLink)
router.post('/verificarcontaenvioemail', middleware.checkToken, userController.verificarContaEnvioEmail)
router.post('/listarncc', /*middleware.checkToken,*/ userController.listarNcc)
router.post('/registar', upload.array('files', 2), userController.registar)
router.post('/login', userController.login)
router.post('/verificar_login', userController.verificar_login)
router.post('/testes', userController.testes)

module.exports = router
