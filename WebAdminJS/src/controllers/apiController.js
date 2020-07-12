import { Localidades } from '../models/Localidades.js'
import { Paises } from '../models/Paises.js'
import { sequelize } from '../config/database.js'
import NodeCache from 'node-cache'

const apiController = {}
sequelize.sync()

const cache = new NodeCache( {
    stdTTL: 100,
    checkperiod: 120
})

apiController.localidades = async (req, res) => {
    if(cache.get('localidades') === undefined) {
        await Localidades.findAll({
            where: {
                ATIVO: true,
            },
            order: [
                ['LOCALIDADE', 'ASC'],
            ],
        }).then((data) => {
            cache.set('localidades', JSON.stringify(data), 3600)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Ocorreu um erro ao obter a lista de localidades.'
            })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('localidades')),
        })
    }
}

apiController.nacionalidades = async (req, res) => {
    if(cache.get('nacionalidades') === undefined) {
        await Paises.findAll({
            order: [
                ['NR_PAIS', 'ASC'],
            ],
        }).then((data) => {
            cache.set('nacionalidades', JSON.stringify(data), 86400)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(() => {
            return res.json({ success: false })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('nacionalidades')),
        })
    }
}

export { apiController }
