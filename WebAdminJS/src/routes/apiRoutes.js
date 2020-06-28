import express from 'express'
import { checkToken, authorize, Role } from '../middleware/jwt.js'

const apiRouter = express.Router()

import { apiController } from '../controllers/apiController.js'

apiRouter.get('/localidades', /*checkToken,*/ apiController.localidades)
apiRouter.get('/nacionalidades', /*checkToken,*/ apiController.nacionalidades)

export { apiRouter }
