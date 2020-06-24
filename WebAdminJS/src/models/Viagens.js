import Sequelize from 'sequelize'
import { sequelize } from '../config/database.js'
import { Localidades } from './Localidades.js'
import { Utilizadores } from './Utilizadores.js'
import { Viaturas } from './Viaturas.js'

var PedidoViagem = sequelize.define('VIAGEM_PEDIDO', {
    NR_VIAGEM_PEDIDO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ORIGEM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Localidades,
            key: 'NR_LOCALIDADE',
        },
    },
    DESTINO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Localidades,
            key: 'NR_LOCALIDADE',
        },
    },
    PASSAGEIROS: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    MOTIVO: {
        type: Sequelize.ENUM('L', 'T', 'SNU'),
        allowNull: false,
    },
    DATAHORA_IDA: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    DATAHORA_VOLTA: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    NR_CLIENTE_PEDIDO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR',
        },
    },
    OBSERVACOES: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    DISTANCIA: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    DURACAO: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    CUSTO: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    COMPARTICIPACAO: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    MOTORISTA: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR',
        },
    },
    VIATURA: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Viaturas,
            key: 'NR_VIATURA',
        },
    },
    ESTADO: {
        type: Sequelize.ENUM('PEDIDO', 'PENDENTE', 'DECORRER', 'FALTA', 'CANCELADA', 'CONCLUIDA'),
        allowNull: false
    },
    PEDIDA_POR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR',
        },
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: true
})

var ClassificacaoViagem = sequelize.define('VIAGEM_CLASSIFICACAO', {
    NR_VIAGEM_CLASSIFICACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NR_VIAGEM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PedidoViagem,
            key: 'NR_VIAGEM_PEDIDO'
        }
    },
    NR_CLIENTE: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    CLASSIFICACAO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    },
    COMENTARIO: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: true
})

var ClientesViagem = sequelize.define('VIAGEM_CLIENTES', {
    NR_CLIENTE_VIAGEM: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NR_VIAGEM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PedidoViagem,
            key: 'NR_VIAGEM_PEDIDO'
        }
    },
    NR_CLIENTE: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var AlteracoesViagem = sequelize.define('VIAGEM_ALTERACOES', {
    NR_ALTERACAO_VIAGEM: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NR_VIAGEM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PedidoViagem,
            key: 'NR_VIAGEM_PEDIDO'
        }
    },
    NR_ALTERADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    ESTADO_ANTERIOR: {
        type: Sequelize.ENUM('PEDIDO', 'PENDENTE', 'DECORRER', 'FALTA', 'CANCELADA', 'CONCLUIDA'),
        allowNull: false
    },
    ESTADO_NOVO: {
        type: Sequelize.ENUM('PEDIDO', 'PENDENTE', 'DECORRER', 'FALTA', 'CANCELADA', 'CONCLUIDA'),
        allowNull: false
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

export { PedidoViagem, ClassificacaoViagem, ClientesViagem, AlteracoesViagem }
