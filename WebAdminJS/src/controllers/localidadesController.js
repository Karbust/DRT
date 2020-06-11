let Localidades = require('../models/Localidades'),
  sequelize = require('../config/database'),
  config = require('../config/config');

const controllers = {}
sequelize.sync()

controllers.list = async (req, res) => {
  const data = await Localidades.findAll({
    where: {
      ATIVO: true
    },
    order: [
      ['LOCALIDADE', 'ASC']
    ]
  }).then(function(data){
    return data;
  }).catch(error => {
    return error;
  });

  res.json({success : true, data : data});
}

module.exports = controllers;
