var Sequelize = require('sequelize'),
    sequelize = require('../config/database')

var Paises = sequelize.define('PAISES', {
    NR_PAIS: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    NOME: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    SIGLA2: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    SIGLA3: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    CODIGO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

module.exports = Paises
