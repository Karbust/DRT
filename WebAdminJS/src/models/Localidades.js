let Sequelize = require('sequelize'),
    sequelize = require('../config/database')

var Localidades = sequelize.define('LOCALIDADES', {
    NR_LOCALIDADE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    LOCALIDADE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    TARIFA: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    COD_POSTAL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    LATITUDE: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    LONGITUDE: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    ATIVO: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
})

module.exports = Localidades
