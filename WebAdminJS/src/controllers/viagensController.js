let { Op } = require('sequelize'),
    { Utilizadores } = require('../models/Utilizadores'),
    Localidades = require('../models/Localidades'),
    sequelize = require('../config/database'),
    { PedidoViagem, ClassificacaoViagem, ClientesViagem } = require('../models/Viagens'),
    { Viaturas } = require('../models/Viaturas')

PedidoViagem.belongsTo(Localidades, { foreignKey: 'ORIGEM', as: 'Origem' })
PedidoViagem.belongsTo(Localidades, { foreignKey: 'DESTINO', as: 'Destino' })
Localidades.hasMany(PedidoViagem, { foreignKey: 'ORIGEM', as: 'ORIGEMVIAGEM' })
Localidades.hasMany(PedidoViagem, { foreignKey: 'DESTINO', as: 'DESTINOVIAGEM' })

PedidoViagem.belongsTo(Utilizadores, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'Cliente' })
PedidoViagem.belongsTo(Utilizadores, { foreignKey: 'MOTORISTA', as: 'Motorista' })
Utilizadores.hasMany(PedidoViagem, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'CLIENTEVIAGEM' })
Utilizadores.hasMany(PedidoViagem, { foreignKey: 'MOTORISTA', as: 'MOTORISTAVIAGEM' })

ClassificacaoViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'Viagem' })
ClassificacaoViagem.belongsTo(Utilizadores, { foreignKey: 'NR_CLIENTE', as: 'NrCliente' })
PedidoViagem.hasMany(ClassificacaoViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMCLASSIFICACAO' })
Utilizadores.hasMany(ClassificacaoViagem, { foreignKey: 'NR_CLIENTE', as: 'NRCLIENTECLASSIFICACAO' })

ClientesViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagem' })
ClientesViagem.belongsTo(Utilizadores, { foreignKey: 'NR_CLIENTE', as: 'ClienteViagem' })
PedidoViagem.hasMany(ClientesViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMCLIENTESVIAGEM' })
Utilizadores.hasMany(ClientesViagem, { foreignKey: 'NR_CLIENTE', as: 'NRCLIENTEVIAGEM' })

PedidoViagem.belongsTo(Viaturas, { foreignKey: 'VIATURA', as: 'ViagemViatura' })
Viaturas.hasMany(PedidoViagem, { foreignKey: 'VIATURA', as: 'VIATURAVIAGEM' })

const controllers = {}
sequelize.sync()

controllers.historicoViagens = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            ESTADO: {
                [Op.or]: ['DECORRER', 'FALTA', 'CANCELADA', 'CONCLUIDA']
            }
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
        }, {
            model: Localidades,
            as: 'Destino',
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
controllers.registoPedidoViagem = async (req, res) => {
    const {
        origem, destino, passageiros, motivo, datahora_ida, datahora_volta, nrcliente, observacoes, distancia, duracao
    } = req.body
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
        DURACAO: duracao,
        ESTADO: 'PEDIDO',
    }).then( (data) => {
        //functions.sendEmail(email.toString(), 'Conta criada no DRT', 'Password: ' + password + '\nToken: ' + token)

        return res.json({
            success: true,
            data: data,
        })
    }).catch((error) => {
        console.log(error)
        return res.json({
            success: false,
        })
    })
}
controllers.pedidoViagem = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            ESTADO: {
                [Op.or]: ['PEDIDO', 'PENDENTE']
            }
        },
        order: [
            ['DATAHORA_IDA', 'ASC'],
            ['createdAt', 'ASC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem'
        }, {
            model: Localidades,
            as: 'Destino'
        }, {
            model: Viaturas,
            as: 'ViagemViatura'
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
controllers.classificacaoViagem = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);*/
    res.json({ success:true })
}
controllers.editarViagem = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);*/
    res.json({ success:true })
}

module.exports = controllers
