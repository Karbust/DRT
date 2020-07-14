import Sequelize from 'sequelize'
import { sequelize } from '../config/database.js'
import { Utilizadores } from './Utilizadores.js'

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
    freezeTableName: true,
    timestamps: false
})

export { Validacoes }
