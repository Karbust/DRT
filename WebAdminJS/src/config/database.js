var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'drt_testes', //base de dados
    'drt', //utilizador
    'wqBUG3ACaS82dNxm', //password
    {
        host: '192.168.1.96',
        port: '5432',
        dialect: 'postgres'/*,
        sync: {force: true}*/
    }
);
module.exports = sequelize;
