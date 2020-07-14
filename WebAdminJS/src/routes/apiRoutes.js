import express from 'express'

const apiRouter = express.Router()

import { apiController } from '../controllers/apiController.js'

apiRouter.get('/localidades', apiController.localidades)
apiRouter.get('/nacionalidades', apiController.nacionalidades)

export { apiRouter }
