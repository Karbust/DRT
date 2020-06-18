var Sequelize = require('sequelize'),
    sequelize = require('../config/database'),
    Utilizadores = require('./utilizadoresModel')

var Validacoes = sequelize.define('VALIDACOES', {
    NR_VALIDACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_VALIDADO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    NR_VALIDADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    DATA_HORA_VALIDACAO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ESTADO: {
        type: Sequelize.ENUM('APROVADO', 'DESAPROVADO'),
        allowNull: false
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

module.exports = Validacoes
