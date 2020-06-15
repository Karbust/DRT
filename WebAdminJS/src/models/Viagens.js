var Sequelize = require('sequelize'),
    sequelize = require('../config/database'),
    Localidades = require('./Localidades'),
    Utilizadores = require('./utilizadoresModel')

var PedidoViagem = sequelize.define('PEDIDO_VIAGEM', {
    NR_PEDIDO_VIAGEM: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ORIGEM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Localidades,
            key: 'NR_LOCALIDADE',
        },
    },
    DESTINO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Localidades,
            key: 'NR_LOCALIDADE',
        },
    },
    PASSAGEIROS: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    MOTIVO: {
        type: Sequelize.ENUM('L', 'T', 'SNU'),
        allowNull: false,
    },
    DATAHORA_IDA: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    DATAHORA_VOLTA: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    NCC_CLIENTE: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'N_CC',
        },
    },
    OBSERVACOES: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DISTANCIA: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    MOTORISTA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR',
        },
    },
    CONCLUIDA: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
    },
)

module.exports = PedidoViagem;
