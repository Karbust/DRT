import Sequelize from 'sequelize'
import { Utilizadores } from '../models/Utilizadores.js'
import { Localidades } from '../models/Localidades.js'
import { sequelize } from '../config/database.js'
import {
    AlteracoesEstadosClientes,
    AlteracoesEstadosPagamento,
    AlteracoesViagem,
    ClassificacaoViagem,
    ClientesViagem,
    PedidoViagem
} from '../models/Viagens.js'
import { Notificacoes } from '../models/Notificacoes.js'
import { Viaturas } from '../models/Viaturas.js'
import moment from 'moment'
import { validateBodyFields } from '../functions.js'

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

AlteracoesViagem.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagemAlteracao' })
AlteracoesViagem.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADOR', as: 'NrUtilizadorAlteracao' })
PedidoViagem.hasMany(AlteracoesViagem, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMALTERACAOVIAGEM' })
Utilizadores.hasMany(AlteracoesViagem, { foreignKey: 'NR_ALTERADOR', as: 'UTILIZADORALTERACAOVIAGEM' })

AlteracoesEstadosPagamento.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagemAlteracaoPagamento' })
AlteracoesEstadosPagamento.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADOR', as: 'NrUtilizadorAlteradorAlteracaoPagamento' })
AlteracoesEstadosPagamento.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADO', as: 'NrUtilizadorAlteradoAlteracaoPagamento' })
PedidoViagem.hasMany(AlteracoesEstadosPagamento, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMALTERACAOPAGAMENTO' })
Utilizadores.hasMany(AlteracoesEstadosPagamento, { foreignKey: 'NR_ALTERADOR', as: 'UTILIZADORALTERADORALTERACAOPAGAMENTO' })
Utilizadores.hasMany(AlteracoesEstadosPagamento, { foreignKey: 'NR_ALTERADO', as: 'UTILIZADORALTERADOALTERACAOPAGAMENTO' })

AlteracoesEstadosClientes.belongsTo(PedidoViagem, { foreignKey: 'NR_VIAGEM', as: 'NrViagemAlteracaoCliente' })
AlteracoesEstadosClientes.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADOR', as: 'NrUtilizadorAlteradorAlteracaoCliente' })
AlteracoesEstadosClientes.belongsTo(Utilizadores, { foreignKey: 'NR_ALTERADO', as: 'NrUtilizadorAlteradoAlteracaoCliente' })
PedidoViagem.hasMany(AlteracoesEstadosClientes, { foreignKey: 'NR_VIAGEM', as: 'VIAGEMALTERACAOCLIENTE' })
Utilizadores.hasMany(AlteracoesEstadosClientes, { foreignKey: 'NR_ALTERADOR', as: 'UTILIZADORALTERADORALTERACAOCLIENTE' })
Utilizadores.hasMany(AlteracoesEstadosClientes, { foreignKey: 'NR_ALTERADO', as: 'UTILIZADORALTERADOALTERACAOCLIENTE' })


const op = Sequelize.Op

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
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.registoPedidoViagem = async (req, res) => {
    const {
        origem, destino, motivo, datahora_ida, datahora_volta, nrcliente, clientes, observacoes, distancia, duracao
    } = req.body
    const { nr_user } = req.decoded

    if(!validateBodyFields(req.body,
        ['origem', 'destino', 'motivo', 'datahora_ida',
            'nrcliente', 'clientes', 'distancia', 'duracao'
        ])){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    await ClientesViagem.findAll({
        attributes: [
            'NR_VIAGEM',
            'MONTANTE',
            'ESTADO_PAGAMENTO'
        ],
        where: {
            NR_CLIENTE: {
                [op.in]: clientes
            },
            ESTADO_CLIENTE: {
                [op.in]: ['PRESENTE', 'FALTOU']
            },
            ESTADO_PAGAMENTO: 'PENDENTE'
        }
    }).then(async (data) => {
        if(data.length !== 0) {
            return res.json({
                success: false,
                message: 'Não é possível guardar a viagem porque 1 ou mais participantes possuem dívidas.'
            })
        } else {
            await sequelize.transaction(async (t) => {

                let dados = []
                let notificacoes = []

                let pedido = await PedidoViagem.create({
                    ORIGEM: origem,
                    DESTINO: destino,
                    PASSAGEIROS: clientes.length,
                    MOTIVO: motivo,
                    DATAHORA_IDA: moment(datahora_ida).format('YYYY-MM-DD HH:mm'),
                    DATAHORA_VOLTA: datahora_volta ? moment(datahora_volta).format('YYYY-MM-DD HH:mm') : null,
                    NR_CLIENTE_PEDIDO: nrcliente,
                    OBSERVACOES: observacoes,
                    DISTANCIA: distancia,
                    DURACAO: duracao,
                    ESTADO: 'PEDIDO',
                    PEDIDA_POR: nr_user
                }, {
                    transaction: t
                })

                for (const cliente of clientes) {
                    dados.push({
                        NR_VIAGEM: pedido.NR_VIAGEM_PEDIDO,
                        NR_CLIENTE: cliente
                    })
                }

                await ClientesViagem.bulkCreate(dados, { transaction: t })

                let localidade = await Localidades.findAll({
                    attributes: [
                        'LOCALIDADE'
                    ],
                    where: {
                        'NR_LOCALIDADE': {
                            [op.in]: [origem, destino]
                        }
                    }
                })

                let volta = datahora_volta === null ? '. ' : ' com volta a ' + datahora_volta + '. '
                let mensagem = 'Viagem de ' +
                    localidade[0].LOCALIDADE +
                    ' para ' + localidade[1].LOCALIDADE +
                    ' marcada para ' + datahora_ida + volta +
                    'Assim que for validada pelo operador irá receber outra notificação.'

                for (const cliente of clientes) {
                    notificacoes.push({
                        NR_UTILIZADOR: cliente,
                        CONTEUDO: mensagem
                    })
                }

                await Notificacoes.bulkCreate(notificacoes, { transaction: t })

                return localidade
            }).then((data) => {
                console.log(JSON.stringify(data))
                return res.json({
                    success: true,
                    message: 'Viagem registada com sucesso.'
                })
            }).catch(() => {
                return res.json({
                    success: false,
                    message: 'Ocorreu um erro ao registar a viagem.'
                })
            })
        }
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
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.editarViagem = async (req, res) => {
    const {
        origem, destino, passageiros, motivo, datahora_ida, datahora_volta, distancia, duracao, custo, comparticipacao, motorista, viatura
    } = req.body.values
    const { nr_viagem } = req.body

    if(!validateBodyFields(req.body.values,
        ['origem', 'destino', 'passageiros', 'motivo', 'datahora_ida',
            'distancia', 'duracao', 'custo', 'comparticipacao',
            'motorista', 'viatura'
        ]) || !nr_viagem){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

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
                    IP: req.ip_address
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({
            success: true
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            success: false
        })
    })
}

viagensController.pedidosViagemMotorista = async (req, res) => {
    const { motorista } = req.body

    if(!validateBodyFields(req.body, ['motorista'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

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
            MOTORISTA: motorista,
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
        }, {
            model: ClientesViagem,
            as: 'VIAGEMCLIENTESVIAGEM',
            attributes: [
                'NR_CLIENTE_VIAGEM'
            ],
            include: {
                model: Utilizadores,
                as: 'ClienteViagem',
                attributes: [
                    'NR_UTILIZADOR',
                    'NOME_UTILIZADOR'
                ]
            }
        }],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch((error) => {
        console.log(error)
        return res.json({
            success: false
        })
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
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}*/
viagensController.historicoViagensUtilizador = async (req, res) => {
    const { nr_utilizador } = req.body

    if(!validateBodyFields(req.body, ['nr_utilizador'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await ClientesViagem.findAll({
        attributes: [
            'MONTANTE',
            'ESTADO_PAGAMENTO'
        ],
        where: {
            NR_CLIENTE: nr_utilizador,
        },
        include: [{
            model: PedidoViagem,
            as: 'NrViagem',
            attributes: [
                'NR_VIAGEM_PEDIDO',
                'PASSAGEIROS',
                'DATAHORA_IDA',
                'DATAHORA_VOLTA',
                'OBSERVACOES',
                'DISTANCIA',
                'ESTADO',
            ],
            order: [
                ['DATAHORA_IDA', 'ASC']
            ],
            ESTADO: {
                [op.or]: ['FALTA', 'CONCLUIDA']
            },
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
            }]
        }],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.historicoViagensMotorista = async (req, res) => {
    const { nr_utilizador } = req.body

    if(!validateBodyFields(req.body, ['nr_utilizador'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

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
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.pedidosViagemCliente = async (req, res) => {
    const { cliente } = req.body

    if(!validateBodyFields(req.body, ['cliente'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await ClientesViagem.findAll({
        attributes: [
            'ESTADO_PAGAMENTO'
        ],
        where: {
            NR_CLIENTE: cliente,
        },
        include: [{
            model: PedidoViagem,
            as: 'NrViagem',
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
            }]
        }],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch((error) => {
        console.log(error)
        return res.json({
            success: false
        })
    })
}
viagensController.verificarDividaCliente = async (req, res) => {
    const { nr_utilizador } = req.body

    if(!validateBodyFields(req.body, ['nr_utilizador'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await ClientesViagem.findAll({
        attributes: [
            [sequelize.fn('sum', sequelize.col('MONTANTE')), 'montante'],
        ],
        where: {
            NR_CLIENTE: nr_utilizador,
            ESTADO_CLIENTE: {
                [op.in]: ['PRESENTE', 'FALTOU']
            },
            ESTADO_PAGAMENTO: 'PENDENTE'
        }
    }).then((data) => {
        if(data.length !== 0) {
            return res.json({
                success: true,
                dividas: true,
                data: data
            })
        } else {
            return res.json({
                success: true,
                dividas: false
            })
        }
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.listaDividas = async (req, res) => {
    ClientesViagem.findAll({
        where: {
            ESTADO_CLIENTE: {
                [op.in]: ['PRESENTE', 'FALTOU']
            },
            ESTADO_PAGAMENTO: {
                [op.in]: ['PENDENTE', 'RECEBIDO']
            },
        },
        include: {
            model: Utilizadores,
            as: 'ClienteViagem',
            attributes: [
                'NOME_UTILIZADOR',
                'N_TELEMOVEL',
                'MORADA_UTILIZADOR',
                'COD_POSTAL',
                'FREGUESIA',
            ],
        }
    }).then((data) => {
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: true,
            message: 'Ocorreu um erro ao obter a lista de dívidas.'
        })
    })
}
viagensController.atualizarEstadoViagem = async (req, res) => {
    const { nr_viagem, estado } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem', 'estado'])){
        return res.status(400).json({
            success: false,
            message: 'Número de viagem e/ou estado em falta.',
        })
    }

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
        return res.json({
            success: true
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.atualizarEstadoViagemCancelada = async (req, res) => {
    const { nr_viagem } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem'])){
        return res.status(400).json({
            success: false,
            message: 'Número de viagem em falta.',
        })
    }

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            PedidoViagem.update({
                ESTADO: 'CANCELADA'
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
                    ESTADO_NOVO: 'CANCELADA',
                    IP: req.ip_address
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({
            success: true,
            message: 'Viagem cancelada com sucesso.'
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao cancelar a viagem.'
        })
    })
}
viagensController.atualizarEstadoPagamentoViagem = async (req, res) => {
    const { nr_viagem, nr_cliente, estado } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem', 'nr_cliente', 'estado'])){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            ClientesViagem.update({
                ESTADO_PAGAMENTO: estado
            }, {
                where: {
                    NR_VIAGEM: nr_viagem,
                    NR_CLIENTE: nr_cliente,
                },
                returning: true,
                plain: true,
                transaction: t,
            }),
        )

        promises.push(
            ClientesViagem.findOne({
                attributes: ['ESTADO_PAGAMENTO'],
                where: {
                    NR_VIAGEM: nr_viagem,
                    NR_CLIENTE: nr_cliente,
                },
            }, {
                transaction: t,
            }).then((data) => {
                AlteracoesEstadosPagamento.create({
                    NR_VIAGEM: nr_viagem,
                    NR_ALTERADOR: req.decoded.nr_user,
                    NR_ALTERADO: nr_cliente,
                    ESTADO_ANTERIOR: data.ESTADO_PAGAMENTO,
                    ESTADO_NOVO: estado,
                    IP: req.ip_address
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({
            success: true,
            message: 'Estado do pagamento atualizado com sucesso.'
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao atualizar o estado do pagamento.'
        })
    })
}
viagensController.atualizarEstadoClienteViagem = async (req, res) => {
    const { nr_viagem, nr_cliente, estado } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem', 'nr_cliente', 'estado'])){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            ClientesViagem.update({
                ESTADO_CLIENTE: estado
            }, {
                where: {
                    NR_VIAGEM: nr_viagem,
                    NR_CLIENTE: nr_cliente,
                },
                returning: true,
                plain: true,
                transaction: t,
            }),
        )

        promises.push(
            ClientesViagem.findOne({
                attributes: ['ESTADO_CLIENTE'],
                where: {
                    NR_VIAGEM: nr_viagem,
                    NR_CLIENTE: nr_cliente,
                },
            }, {
                transaction: t,
            }).then((data) => {
                AlteracoesEstadosClientes.create({
                    NR_VIAGEM: nr_viagem,
                    NR_ALTERADOR: req.decoded.nr_user,
                    NR_ALTERADO: nr_cliente,
                    ESTADO_ANTERIOR: data.ESTADO_CLIENTE,
                    ESTADO_NOVO: estado,
                    IP: req.ip_address
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({
            success: true,
            message: 'Estado atualizado com sucesso.'
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao atualizar o estado.'
        })
    })
}
viagensController.classificacaoViagem = async (req, res) => {
    const { nr_viagem, nr_cliente, classificacao, comentario } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem', 'nr_cliente', 'classificacao'])){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    ClassificacaoViagem.create({
        NR_VIAGEM: nr_viagem,
        NR_CLIENTE: nr_cliente,
        CLASSIFICACAO: classificacao,
        COMENTARIO: comentario,
        IP: req.ip_address
    }).then(() => {
        return res.json({
            success: true
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viagensController.classificacoes = async (req, res) => {
    ClassificacaoViagem.findAll({
        include: [{
            model: Utilizadores,
            as: 'NrCliente',
            attributes: [
                'NOME_UTILIZADOR'
            ]
        }, {
            model: PedidoViagem,
            as: 'Viagem',
            attributes: [
                'DATAHORA_IDA',
                'DATAHORA_VOLTA'
            ],
            include: [{
                model: Localidades,
                as: 'Origem',
                attributes: [
                    'LOCALIDADE',
                ],
            }, {
                model: Localidades,
                as: 'Destino',
                attributes: [
                    'LOCALIDADE',
                ],
            },{
                model: Utilizadores,
                as: 'Motorista',
                attributes: [
                    'NOME_UTILIZADOR',
                ],
            }]
        }]
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            success:false
        })
    })
}
viagensController.classificacoesViagemMotorista = async (req, res) => {
    const { nr_viagem } = req.body

    if(!validateBodyFields(req.body, ['nr_viagem'])){
        return res.status(400).json({
            success: false,
            message: 'Número de viagem em falta.',
        })
    }

    ClassificacaoViagem.findAll({
        attributes: [
            'CLASSIFICACAO',
            'COMENTARIO',
            'createdAt'
        ],
        where: {
            NR_VIAGEM: nr_viagem
        },
        include: {
            model: PedidoViagem,
            as: 'Viagem',
            attributes: [
                'DATAHORA_IDA',
                'DATAHORA_VOLTA'
            ],
            include: [{
                model: Localidades,
                as: 'Origem',
                attributes: [
                    'LOCALIDADE',
                ],
            }, {
                model: Localidades,
                as: 'Destino',
                attributes: [
                    'LOCALIDADE',
                ],
            }]
        }
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success:false
        })
    })
}
viagensController.classificacoesViagensCliente = async (req, res) => {
    const { nr_cliente } = req.body

    if(!validateBodyFields(req.body, ['nr_cliente'])){
        return res.status(400).json({
            success: false,
            message: 'Número de cliente em falta.',
        })
    }

    ClassificacaoViagem.findAll({
        attributes: [
            'CLASSIFICACAO',
            'COMENTARIO',
            'createdAt'
        ],
        where: {
            NR_CLIENTE: nr_cliente
        },
        include: {
            model: PedidoViagem,
            as: 'Viagem',
            attributes: [
                'DATAHORA_IDA',
                'DATAHORA_VOLTA'
            ],
            include: [{
                model: Localidades,
                as: 'Origem',
                attributes: [
                    'LOCALIDADE',
                ],
            }, {
                model: Localidades,
                as: 'Destino',
                attributes: [
                    'LOCALIDADE',
                ],
            }]
        }
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success:false
        })
    })
}

export { viagensController }
