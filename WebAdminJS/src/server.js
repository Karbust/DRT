let express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    middleware = require('./middleware/jwt'),
    Role = require('./middleware/jwt').Role


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

const users = require('./routes/userRoutes')
const viagens = require('./routes/viagensRoutes')
const viaturas = require('./routes/viaturasRoutes')
const emails = require('./routes/emailRoutes')
const api = require('./routes/apiRoutes')
const firstrun = require('./routes/firstRunRoutes')

app.use('/mail', emails)
app.use('/public', middleware.checkToken, express.static('src/public'))
app.use('/user', users)
app.use('/viagens', viagens)
app.use('/viaturas', viaturas)
app.use('/api', middleware.checkToken, api)

app.use('/firstrun',
    middleware.checkToken,
    middleware.authorize([Role.Administrador]),
    firstrun
)

app.listen(port, () => console.log(`Listening on port ${port}`))
