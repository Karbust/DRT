import Sequelize from 'sequelize'
import { sequelize } from '../config/database.js'
import bcrypt from 'bcrypt'
import { Paises } from './Paises.js'

var TiposUtilizadores = sequelize.define('TIPOS_UTILIZADORES',{
    NR_TIPO_UTILIZADOR:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    DESCRICAO: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false,
})

var Utilizadores = sequelize.define('UTILIZADORES', {
    NR_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        initialAutoIncrement: '10000'
    },
    NOME_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DATA_NASCIMENTO: Sequelize.DATEONLY,
    N_CC: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    N_SEGSOCIAL: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
    },
    NIF: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    N_TELEMOVEL: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    N_TELEFONE: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    GENERO: {
        type: Sequelize.ENUM('M', 'F', 'O'),
        allowNull: false,
    },
    MORADA_UTILIZADOR: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    COD_POSTAL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    FREGUESIA: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    NACIONALIDADE: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Paises,
            key: 'NR_PAIS',
        },
    },
    N_CC_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    MORADA_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    CARTA_CONDUCAO_COMPROVATIVO: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    TIPO_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: TiposUtilizadores,
            key: 'NR_TIPO_UTILIZADOR',
        },
    },
    EMAIL: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    LOGIN_USER: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    PASSWORD: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    VALIDADO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    VERIFICADO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    TOKEN: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DATA_ENVIO_MAIL: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    IP_REGISTO: {
        type: Sequelize.INET,
        allowNull: false
    },
    IP_ULTIMO_LOGIN: {
        type: Sequelize.INET,
        allowNull: true
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    paranoid: true,
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            return bcrypt.hash(user.PASSWORD, 10)
                .then(hash => {
                    user.PASSWORD = hash
                })
                .catch(() => {
                    throw new Error()
                })
        },
        beforeUpdate: (user) => {
            console.log(user.dataValues.PASSWORD !== user._previousDataValues.PASSWORD)
            if (user.dataValues.PASSWORD !== user._previousDataValues.PASSWORD) {
                return bcrypt.hash(user.dataValues.PASSWORD, 10)
                    .then(hash => {
                        user.dataValues.PASSWORD = hash
                    })
                    .catch(() => {
                        throw new Error()
                    })
            }
        },
    },
})

var Verificacoes = sequelize.define('VERIFICACOES', {
    NR_VERIFICACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_VERIFICADO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    TOKEN: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DATA_HORA_VERIFICACAO: {
        type: Sequelize.DATE,
        allowNull: true
    },
    VALIDADO: {
        type: Sequelize.ENUM('EMAIL', 'PAINEL'),
        allowNull: false
    },
    NR_VERIFICADOR: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var Validacoes = sequelize.define('VALIDACOES', {
    NR_VALIDACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_VALIDADO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    NR_VALIDADOR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizadores,
            key: 'NR_UTILIZADOR'
        }
    },
    DATA_HORA_VALIDACAO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ESTADO: {
        type: Sequelize.ENUM('APROVADO', 'DESAPROVADO'),
        allowNull: false
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

export { TiposUtilizadores, Utilizadores, Verificacoes, Validacoes }
