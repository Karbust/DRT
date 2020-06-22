let sequelize = require('../config/database'),
    fs = require('fs'),
    { TiposUtilizadores } = require('../models/Utilizadores'),
    Localidades = require('../models/Localidades'),
    Paises = require('../models/Paises'),
    {
        Cores, Marcas, Modelos, Seguradoras
    } = require('../models/Viaturas')

const controllers = {}

controllers.firstRun = async (req, res) => {
    // VIATURAS - START
    let cores = JSON.parse(fs.readFileSync(__dirname + '/../cores.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Cores.sync().then(() => Cores.bulkCreate(cores), {
        fields: ['NOME_COR'],
        ignoreDuplicates: false
    })

    let marcas = JSON.parse(fs.readFileSync(__dirname + '/../marcas.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Marcas.sync().then(() => Marcas.bulkCreate(marcas), {
        fields: ['NOME_MARCA'],
        ignoreDuplicates: false
    })

    let modelos = JSON.parse(fs.readFileSync(__dirname + '/../modelos.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Modelos.sync().then(() => Modelos.bulkCreate(modelos), {
        fields: ['NR_MARCA', 'NOME_MODELO'],
        ignoreDuplicates: false
    })

    let seguradoras = JSON.parse(fs.readFileSync(__dirname + '/../seguradoras.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Seguradoras.sync().then(() => Seguradoras.bulkCreate(seguradoras), {
        fields: ['NOME_SEGURADORA'],
        ignoreDuplicates: false
    })
    // VIATURAS - END

    // LOCALIDADES - START
    let localidades = JSON.parse(fs.readFileSync(__dirname + '/../localidades.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Localidades.sync().then(() => Localidades.bulkCreate(localidades), { ignoreDuplicates: true })
    // LOCALIDADES - END

    // TIPOS UTILIZADORES - START
    let tiposUtilizadores = JSON.parse(fs.readFileSync(__dirname + '/../tipos_utilizadores.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    TiposUtilizadores.sync().then(() => TiposUtilizadores.bulkCreate(tiposUtilizadores), { ignoreDuplicates: true })
    // TIPOS UTILIZADORES - END

    // PAISES - START
    let paises = JSON.parse(fs.readFileSync(__dirname + '/../paises.json', {
        encoding: 'utf8',
        flag: 'r',
    }))
    Paises.sync().then(() => Paises.bulkCreate(paises), { ignoreDuplicates: true })
    // PAISES - END

    sequelize.sync()

    res.json({
        success: true,
    })
}

module.exports = controllers
