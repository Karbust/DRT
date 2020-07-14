import Sequelize from 'sequelize'
import { sequelize } from '../config/database.js'
import { Utilizadores } from './Utilizadores.js'

var Verificacoes = sequelize.define('VERIFICACOES', {
    NR_VERIFICACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_VERIFICADO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    TOKEN: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DATA_HORA_VERIFICACAO: {
        type: Sequelize.DATE,
        allowNull: true
    },
    VALIDADO: {
        type: Sequelize.ENUM('EMAIL', 'PAINEL'),
        allowNull: false
    },
    NR_VERIFICADOR: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
})

export { Verificacoes }
