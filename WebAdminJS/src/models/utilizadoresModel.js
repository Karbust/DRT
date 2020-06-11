var Sequelize = require('sequelize'),
    sequelize = require('../config/database'),
    bcrypt = require('bcrypt');

var Freguesias = require('./Freguesias');
var TiposUtilizadores = require('./TiposUtilizadoresModel');

var UtilizadoresModel = sequelize.define('UTILIZADORES',{
    NR_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOME_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DATA_NASCIMENTO: Sequelize.DATEONLY,
    N_CC: {
        type: Sequelize.STRING,
        allowNull: false
    },
    N_CC_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: false
    },
    N_SEGSOCIAL: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NIF:  {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    N_TELEMOVEL:  {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    N_TELEFONE:  {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    GENERO:  {
        type: Sequelize.ENUM('Masculino', 'Feminino'),
        allowNull: false
    },
    MORADA_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false
    },
    FREGUESIA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: Freguesias,
            key: 'NR_FREGUESIA'
        }
    },
    TIPO_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: TiposUtilizadores,
            key: 'NR_TIPO_UTILIZADOR'
        }
    },
    DATA_CRIACAO_CONTA: {
        type: Sequelize.DATE,
        allowNull: false
    },
    EMAIL: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    LOGIN_USER:  {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    PASSWORD:  {
        type: Sequelize.STRING,
        allowNull: false
    },
},{
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
});

UtilizadoresModel.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});



module.exports = UtilizadoresModel;
