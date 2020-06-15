let Localidades = require('../models/Localidades'),
    Paises = require('../models/Paises')
    sequelize = require('../config/database'),
    NodeCache = require('node-cache'),
    config = require('../config/config')

const controllers = {}
sequelize.sync()

const cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

controllers.localidades = async (req, res) => {
    if(cache.get('localidades') === undefined) {
        await Localidades.findAll({
            where: {
                ATIVO: true,
            },
            order: [
                ['LOCALIDADE', 'ASC'],
            ],
        }).then(function(data) {
            cache.set('localidades', JSON.stringify(data), 900)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(error => {
            return res.json({ success: false })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('localidades')),
        })
    }
}

controllers.nacionalidades = async (req, res) => {
    if(cache.get('nacionalidades') === undefined) {
        await Paises.findAll({
            order: [
                ['NR_PAIS', 'ASC'],
            ],
        }).then(function(data) {
            cache.set('nacionalidades', JSON.stringify(data), 900 )
            return res.json({
                success: true,
                data: data,
            })
        }).catch(error => {
            return res.json({ success: false })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('nacionalidades')),
        })
    }
}

module.exports = controllers
