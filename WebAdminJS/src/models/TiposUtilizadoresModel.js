var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var TiposUtilizadoresModel = sequelize.define('TIPOS_UTILIZADORES',{
    NR_TIPO_UTILIZADOR:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    DESCRICAO: Sequelize.STRING
},{
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
});

module.exports = TiposUtilizadoresModel;
