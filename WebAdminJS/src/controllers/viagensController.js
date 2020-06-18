let { Sequelize, Op } = require('sequelize'),
    User = require('../models/utilizadoresModel'),
    sequelize = require('../config/database'),
    { PedidoViagem, ClassificacaoViagem, ClientesViagem } = require('../models/Viagens'),
    config = require('../config/config'),
    functions = require('../functions'),
    moment = require('moment')

PedidoViagem.belongsTo(User, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'Cliente' })
PedidoViagem.belongsTo(User, { foreignKey: 'MOTORISTA', as: 'Motorista' })
User.hasMany(PedidoViagem, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'CLIENTEVIAGEM' })
User.hasMany(PedidoViagem, { foreignKey: 'MOTORISTA', as: 'MOTORISTAVIAGEM' })

ClassificacaoViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'Viagem' })
ClassificacaoViagem.belongsTo(User, { foreignKey: 'NR_CLIENTE', as: 'NrCliente' })
PedidoViagem.hasMany(ClassificacaoViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMCLASSIFICACAO' })
User.hasMany(ClassificacaoViagem, { foreignKey: 'NR_CLIENTE', as: 'NRCLIENTECLASSIFICACAO' })

ClientesViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagem' })
ClientesViagem.belongsTo(User, { foreignKey: 'NR_CLIENTE', as: 'ClienteViagem' })
PedidoViagem.hasMany(ClientesViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMCLIENTESVIAGEM' })
User.hasMany(ClientesViagem, { foreignKey: 'NR_CLIENTE', as: 'NRCLIENTEVIAGEM' })

const controllers = {}
sequelize.sync()

controllers.historicoViagens = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            ESTADO: {
                [Op.or]: ['CANCELADA', 'CONCLUIDA']
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(data){
        res.json({success:true, data: data});
    }).catch(function() {
        return res.json({success: false})
    })
}
controllers.registoPedidoViagem = async (req, res) => {
    const { origem, destino, passageiros, motivo, datahora_ida, datahora_volta, nrcliente, motorista, observacoes, distancia } = req.body
    await PedidoViagem.create({
        ORIGEM: origem,
        DESTINO: destino,
        PASSAGEIROS: passageiros,
        MOTIVO: motivo,
        DATAHORA_IDA: datahora_ida,
        DATAHORA_VOLTA: datahora_volta,
        NR_CLIENTE_PEDIDO: nrcliente,
        OBSERVACOES: observacoes,
        DISTANCIA: distancia,
        ESTADO: 'PEDIDO',
    }).then(function(data) {
        //functions.sendEmail(email.toString(), 'Conta criada no DRT', 'Password: ' + password + '\nToken: ' + token)

        return res.json({
            success: true,
            data: data,
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
        })
    })
}
controllers.pedidoViagem = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            ESTADO: 'PEDIDO',
            MOTORISTA: {
                [Op.ne]: null
            }
        },
        order: [
            ['DATAHORA_IDA', 'ASC'],
            ['createdAt', 'ASC']
        ]
    }).then(function(data){
        res.json({success:true, data: data});
    }).catch(function() {
        return res.json({success: false})
    })
}
controllers.classificacaoViagem = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);*/
    res.json({success:true});
}

module.exports = controllers;
