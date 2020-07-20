import express from 'express'
import cors from 'cors'
import { checkToken, authorize, Role } from './middleware/jwt.js'
import { enderecoIP } from './middleware/enderecoIP.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = process.env.PORT || 5100

app.use(express.json())
app.use(express.urlencoded({
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
import { estatisticasRouter } from './routes/estatisticasRoutes.js'
import { apiRouter } from './routes/apiRoutes.js'
import { firstRunRouter } from './routes/firstRunRoutes.js'


app.use('/mail',
    checkToken,
    emailRouter
) // rota de testes de envio de email
app.use('/public',
    enderecoIP,
    checkToken,
    express.static('src/public')
)
app.use('/getapk', (req, res) => {
    res.download(path.join(__dirname, 'public/aplicacao.apk'))
})
app.use('/user',
    enderecoIP,
    userRouter
)
app.use('/viagens',
    enderecoIP,
    checkToken,
    viagensRouter
)
app.use('/viaturas',
    enderecoIP,
    checkToken,
    viaturasRouter
)
app.use('/estatisticas',
    enderecoIP,
    checkToken,
    estatisticasRouter
)
app.use('/api',
    enderecoIP,
    checkToken,
    apiRouter
)

app.use('/firstrun',
    enderecoIP,
    checkToken,
    authorize([Role.Administrador]),
    firstRunRouter
)

app.listen(port, () => console.log(`Listening on port ${port}`))
