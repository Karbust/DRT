let Localidades = require('../models/Localidades'),
    sequelize = require('../config/database')

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
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({ success: false })
    })
}

module.exports = controllers
