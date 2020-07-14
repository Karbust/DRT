import { sequelize } from '../config/database.js'
import Sequelize from 'sequelize'
import { Utilizadores } from './Utilizadores.js'

var Notificacoes = sequelize.define('NOTIFICACOES', {
    NR_NOTIFICACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    CONTEUDO: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true
})

export { Notificacoes }
