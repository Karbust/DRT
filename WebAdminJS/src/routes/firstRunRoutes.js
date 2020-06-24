import express from 'express'

const firstRunRouter = express.Router()

import { firstRunController } from '../controllers/firstRunController.js'

firstRunRouter.get('/', firstRunController.firstRun)

export { firstRunRouter }
