let Sequelize = require('sequelize'),
    sequelize = require('../config/database');

var Freguesias = sequelize.define('FREGUESIAS',{
    NR_FREGUESIA:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOME_FREGUESIA: Sequelize.STRING
},{
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
});

module.exports = Freguesias;
