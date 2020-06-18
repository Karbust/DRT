let express = require('express'),
    router = express.Router(),
    cors = require('cors'),
    sequelize = require('./config/database'),
    bodyParser = require('body-parser'),
    Utilizadores = require('./models/utilizadoresModel'),
    Validacoes = require('./models/Validacoes'),
    Verificacoes = require('./models/Verificacoes')

/*Utilizadores.hasMany(Validacoes)
Validacoes.belongsTo(Utilizadores)*/


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const users = require('./routes/userRoute')
const viagens = require('./routes/viagensRoutes')
const emails = require('./routes/emailRouters')
const api = require('./routes/apiRoutes')

app.use('/mail', emails);

app.use('/public', express.static('src/public'));

app.use('/user', users);

app.use('/viagens', viagens);

app.use('/api', api);

//router.get('/testdata', filmes.testdata);

app.listen(port, () => console.log(`Listening on port ${port}`));
