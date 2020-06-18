var Sequelize = require('sequelize'),
    sequelize = require('../config/database'),
    bcrypt = require('bcrypt'),
    TiposUtilizadores = require('./TiposUtilizadoresModel'),
    Paises = require('./Paises')

var UtilizadoresModel = sequelize.define('UTILIZADORES', {
    NR_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        initialAutoIncrement: '10000'
    },
    NOME_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DATA_NASCIMENTO: Sequelize.DATEONLY,
    N_CC: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    N_SEGSOCIAL: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    NIF: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    N_TELEMOVEL: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    N_TELEFONE: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    GENERO: {
        type: Sequelize.ENUM('M', 'F', 'O'),
        allowNull: false,
    },
    MORADA_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    COD_POSTAL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    FREGUESIA: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    NACIONALIDADE: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Paises,
            key: 'NR_PAIS',
        },
    },
    N_CC_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    MORADA_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    CARTA_CONDUCAO_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    TIPO_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: TiposUtilizadores,
            key: 'NR_TIPO_UTILIZADOR',
        },
    },
    EMAIL: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    LOGIN_USER: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    PASSWORD: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    VALIDADO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    VERIFICADO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    TOKEN: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DATA_ENVIO_MAIL: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    paranoid: true,
    timestamps: true,
    hooks: {
        beforeCreate: (user, options) => {
            return bcrypt.hash(user.PASSWORD, 10)
                .then(hash => {
                    user.PASSWORD = hash
                })
                .catch(err => {
                    throw new Error()
                })
        },
    },
})

module.exports = UtilizadoresModel
