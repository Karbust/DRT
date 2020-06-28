import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { checkToken, authorize, Role } from './middleware/jwt.js'

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
})

import { userRouter } from './routes/userRoutes.js'
import { viagensRouter } from './routes/viagensRoutes.js'
import { viaturasRouter } from './routes/viaturasRoutes.js'
import { emailRouter } from './routes/emailRoutes.js'
import { apiRouter } from './routes/apiRoutes.js'
import { firstRunRouter } from './routes/firstRunRoutes.js'

app.use('/mail', emailRouter)
app.use('/public', checkToken, express.static('src/public'))
app.use('/user', userRouter)
app.use('/viagens', viagensRouter)
app.use('/viaturas', viaturasRouter)
app.use('/api', apiRouter)

app.use('/firstrun',
    checkToken,
    authorize([Role.Administrador]),
    firstRunRouter
)

app.listen(port, () => console.log(`Listening on port ${port}`))
