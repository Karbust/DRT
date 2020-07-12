import Sequelize from 'sequelize'
import { Utilizadores }  from '../models/Utilizadores.js'
import { Localidades } from '../models/Localidades.js'
import { sequelize } from '../config/database.js'
import { PedidoViagem, ClassificacaoViagem, ClientesViagem, AlteracoesViagem } from '../models/Viagens.js'
import { Viaturas } from '../models/Viaturas.js'
import { sendEmail } from "../functions.js";
import moment from 'moment'

PedidoViagem.belongsTo(Localidades, { foreignKey: 'ORIGEM', as: 'Origem' })
PedidoViagem.belongsTo(Localidades, { foreignKey: 'DESTINO', as: 'Destino' })
Localidades.hasMany(PedidoViagem, { foreignKey: 'ORIGEM', as: 'ORIGEMVIAGEM' })
Localidades.hasMany(PedidoViagem, { foreignKey: 'DESTINO', as: 'DESTINOVIAGEM' })

PedidoViagem.belongsTo(Utilizadores, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'Cliente' })
PedidoViagem.belongsTo(Utilizadores, { foreignKey: 'MOTORISTA', as: 'Motorista' })
PedidoViagem.belongsTo(Utilizadores, { foreignKey: 'PEDIDA_POR', as: 'Pedidor' })
Utilizadores.hasMany(PedidoViagem, { foreignKey: 'NR_CLIENTE_PEDIDO', as: 'CLIENTEVIAGEM' })
Utilizadores.hasMany(PedidoViagem, { foreignKey: 'MOTORISTA', as: 'MOTORISTAVIAGEM' })
Utilizadores.hasMany(PedidoViagem, { foreignKey: 'PEDIDA_POR', as: 'PEDIDORVIAGEM' })

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

AlteracoesViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagemAlteracao'})
AlteracoesViagem.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADOR', as: 'NrUtilizadorAlteracao'})
PedidoViagem.hasMany(AlteracoesViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMALTERACAOVIAGEM' })
Utilizadores.hasMany(AlteracoesViagem, { foreignKey: 'NR_ALTERADOR', as: 'UTILIZADORALTERACAOVIAGEM' })

const op = Sequelize.Op;

const viagensController = {}
sequelize.sync()

viagensController.historicoViagens = async (req, res) => {
    await PedidoViagem.findAll({
        attributes: [
            'NR_VIAGEM_PEDIDO',
            'DATAHORA_IDA',
            'DATAHORA_VOLTA',
            'PASSAGEIROS',
            'MOTIVO',
            'DISTANCIA',
            'CUSTO',
            'COMPARTICIPACAO',
            'ESTADO',
        ],
        where: {
            ESTADO: {
                [op.or]: ['DECORRER', 'FALTA', 'CANCELADA', 'CONCLUIDA']
            }
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Utilizadores,
            as: 'Motorista',
            attributes: [
                'NOME_UTILIZADOR'
            ],
        }, {
            model: Viaturas,
            as: 'ViagemViatura',
            attributes: [
                'MATRICULA'
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
viagensController.registoPedidoViagem = async (req, res) => {
    const {
        origem, destino, passageiros, motivo, datahora_ida, datahora_volta, nrcliente, observacoes, distancia, duracao
    } = req.body
    const { nr_user } = req.decoded
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
        PEDIDA_POR: nr_user
    }).then( (data) => {
        //sendEmail(email.toString(), 'Conta criada no DRT', 'Password: ' + password + '\nToken: ' + token)

        return res.json({
            success: true,
            data: data,
        })
    }).catch((error) => {
        return res.json({
            success: false,
        })
    })
}
viagensController.pedidoViagem = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            ESTADO: {
                [op.or]: ['PEDIDO', 'PENDENTE']
            }
        },
        order: [
            ['DATAHORA_IDA', 'ASC'],
            ['createdAt', 'ASC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'NR_LOCALIDADE',
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'NR_LOCALIDADE',
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Viaturas,
            as: 'ViagemViatura',
            attributes: [
                'NR_VIATURA',
                'MATRICULA'
            ],
        }],
    }).then((data) => {
        setTimeout(() => {
            res.json({
                success: true,
                data: data
            })
        }, 3000)
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
viagensController.editarViagem = async (req, res) => {
    const { origem, destino, passageiros, motivo, datahora_ida, datahora_volta, distancia, duracao, custo, comparticipacao, motorista, viatura } = req.body.values
    const { nr_viagem } = req.body
    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            PedidoViagem.update({
                ORIGEM: origem,
                DESTINO: destino,
                PASSAGEIROS: passageiros,
                MOTIVO: motivo,
                DATAHORA_IDA: datahora_ida,
                DATAHORA_VOLTA: datahora_volta,
                DISTANCIA: distancia,
                DURACAO: duracao,
                CUSTO: custo,
                COMPARTICIPACAO: comparticipacao,
                MOTORISTA: motorista,
                VIATURA: viatura,
                ESTADO: 'PENDENTE'
            }, {
                where: {
                    NR_VIAGEM_PEDIDO: nr_viagem,
                },
                transaction: t,
            }),
        )

        promises.push(
            PedidoViagem.findOne({
                attributes: ['ESTADO'],
                where: {
                    NR_VIAGEM_PEDIDO: nr_viagem,
                },
            }, {
                transaction: t,
            }).then((data) => {
                AlteracoesViagem.create({
                    NR_VIAGEM: nr_viagem,
                    NR_ALTERADOR: req.decoded.nr_user,
                    ESTADO_ANTERIOR: data.ESTADO,
                    ESTADO_NOVO: 'PENDENTE',
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({ success: true })
    }).catch((err) => {
        console.log(err)
        return res.json({ success: false })
    })
}

// TODO: ROTAS ANDROID - CLASSIFICAÇÃO VIAGEM - VIAGENS CONTROLLER
viagensController.pedidosViagemMotorista = async (req, res) => {
    await PedidoViagem.findAll({
        attributes: [
            'NR_VIAGEM_PEDIDO',
            'PASSAGEIROS',
            'DATAHORA_IDA',
            'DATAHORA_VOLTA',
            'OBSERVACOES',
            'DISTANCIA',
            'DURACAO',
            'CUSTO',
            'ESTADO',
        ],
        where: {
            MOTORISTA: req.body.motorista,
            ESTADO: {
                [op.or]: ['PENDENTE', 'PENDENTE_VOLTA', 'DECORRER_IDA', 'DECORRER_VOLTA']
            }
        },
        order: [
            ['DATAHORA_IDA', 'ASC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
/*viagensController.pedidosViagemDetalhes = async (req, res) => {
    await PedidoViagem.findAll({
        where: {
            NR_VIAGEM_PEDIDO: req.body.viagem,
        },
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Viaturas,
            as: 'ViagemViatura',
            attributes: [
                'MATRICULA'
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}*/
viagensController.historicoViagensUtilizador = async (req, res) => {
    const { nr_utilizador } = req.body
    await PedidoViagem.findAll({
        attributes: [
            'NR_VIAGEM_PEDIDO',
            'DATAHORA_IDA',
            'DATAHORA_VOLTA',
            'PASSAGEIROS',
            'MOTIVO',
            'DISTANCIA',
            'CUSTO',
            'ESTADO',
        ],
        where: {
            NR_CLIENTE_PEDIDO: nr_utilizador,
            ESTADO: {
                [op.or]: ['FALTA', 'CONCLUIDA']
            }
        },
        order: [
            ['DATAHORA_IDA', 'DESC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Utilizadores,
            as: 'Motorista',
            attributes: [
                'NOME_UTILIZADOR'
            ],
        }, {
            model: Viaturas,
            as: 'ViagemViatura',
            attributes: [
                'MATRICULA'
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
viagensController.historicoViagensMotorista = async (req, res) => {
    const { nr_utilizador } = req.body
    await PedidoViagem.findAll({
        attributes: [
            'NR_VIAGEM_PEDIDO',
            'DATAHORA_IDA',
            'DATAHORA_VOLTA',
            'PASSAGEIROS',
            'MOTIVO',
            'DISTANCIA',
            'ESTADO',
        ],
        where: {
            MOTORISTA: nr_utilizador,
            ESTADO: {
                [op.or]: ['FALTA', 'CONCLUIDA']
            }
        },
        order: [
            ['DATAHORA_IDA', 'DESC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE'
            ],
        }, {
            model: Utilizadores,
            as: 'Motorista',
            attributes: [
                'NOME_UTILIZADOR'
            ],
        }, {
            model: Viaturas,
            as: 'ViagemViatura',
            attributes: [
                'MATRICULA'
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
viagensController.pedidosViagemCliente = async (req, res) => {
    await PedidoViagem.findAll({
        attributes: [
            'NR_VIAGEM_PEDIDO',
            'PASSAGEIROS',
            'DATAHORA_IDA',
            'DATAHORA_VOLTA',
            'OBSERVACOES',
            'DISTANCIA',
            'CUSTO',
            'ESTADO',
        ],
        where: {
            NR_CLIENTE_PEDIDO: req.body.cliente,
        },
        order: [
            ['DATAHORA_IDA', 'ASC']
        ],
        include: [{
            model: Localidades,
            as: 'Origem',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }, {
            model: Localidades,
            as: 'Destino',
            attributes: [
                'LOCALIDADE',
                'LATITUDE',
                'LONGITUDE',
            ],
        }],
    }).then((data) => {
        res.json({ success:true, data: data })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false })
    })
}
viagensController.atualizarEstadoViagem = async (req, res) => {
    const { nr_viagem, estado } = req.body

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            PedidoViagem.update({
                ESTADO: estado
            }, {
                where: {
                    NR_VIAGEM_PEDIDO: nr_viagem,
                },
                returning: true,
                plain: true,
                transaction: t,
            }),
        )

        promises.push(
            PedidoViagem.findOne({
                attributes: ['ESTADO'],
                where: {
                    NR_VIAGEM_PEDIDO: nr_viagem,
                },
            }, {
                transaction: t,
            }).then((data) => {
                AlteracoesViagem.create({
                    NR_VIAGEM: nr_viagem,
                    NR_ALTERADOR: req.decoded.nr_user,
                    ESTADO_ANTERIOR: data.ESTADO,
                    ESTADO_NOVO: estado,
                    IP: req.ip_address
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({ success: true })
    }).catch(() => {
        return res.json({ success: false })
    })
}
viagensController.classificacaoViagem = async (req, res) => {
    const { nr_viagem, nr_cliente, classificacao, comentario } = req.body

    ClassificacaoViagem.create({
        NR_VIAGEM: nr_viagem,
        NR_CLIENTE: nr_cliente,
        CLASSIFICACAO: classificacao,
        COMENTARIO: comentario,
        IP: req.ip_address
    }).then(() => {
        return res.json({ success: true })
    }).catch(() => {
        return res.json({ success: false })
    })
}
viagensController.classificacoesViagens = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);*/
    res.json({ success:true })
}

export { viagensController }
