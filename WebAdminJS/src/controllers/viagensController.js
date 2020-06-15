let { Sequelize, Op } = require('sequelize'),
    User = require('../models/utilizadoresModel'),
    Viagens = require('../models/Viagens'),
    sequelize = require('../config/database'),
    config = require('../config/config'),
    functions = require('../functions'),
    moment = require('moment')

const controllers = {}
sequelize.sync()

controllers.testes = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);*/
    res.json({success:true});
}

module.exports = controllers;
