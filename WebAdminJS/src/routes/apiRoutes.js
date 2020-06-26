import express from 'express'
import { checkToken, authorize, Role } from '../middleware/jwt.js'

const apiRouter = express.Router()

import { apiController } from '../controllers/apiController.js'

apiRouter.get('/localidades', apiController.localidades)
apiRouter.get('/nacionalidades', apiController.nacionalidades)

export { apiRouter }
