let Sequelize = require('sequelize'),
    sequelize = require('../config/database'),
    fs = require('fs')

var TiposUtilizadoresModel = sequelize.define('TIPOS_UTILIZADORES',{
    NR_TIPO_UTILIZADOR:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    DESCRICAO: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
})

let ficheiro = JSON.parse(fs.readFileSync(__dirname + '/../tipos_utilizadores.json', {
    encoding: 'utf8',
    flag: 'r',
}))

TiposUtilizadoresModel.sync().then(() => TiposUtilizadoresModel.bulkCreate(ficheiro), { ignoreDuplicates: true })

module.exports = TiposUtilizadoresModel
