let Localidades = require('../models/Localidades'),
    sequelize = require('../config/database'),
    config = require('../config/config')

const controllers = {}
sequelize.sync()

controllers.list = async (req, res) => {
    await Localidades.findAll({
        where: {
            ATIVO: true,
        },
        order: [
            ['LOCALIDADE', 'ASC'],
        ],
    }).then(function(data) {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(error => {
        return res.json({ success: false })
    })
}

module.exports = controllers
