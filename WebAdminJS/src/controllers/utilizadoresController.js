import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    TiposUtilizadores, Utilizadores, Verificacoes, Validacoes
} from '../models/Utilizadores.js'
import { Notificacoes } from '../models/Notificacoes.js'
import { sequelize } from '../config/database.js'
import { url, jwt as jwtSecret } from '../config/config.js'
import { password as passwordGen, sendEmail, validateBodyFields } from '../functions.js'
import moment from 'moment'
import NodeCache from 'node-cache'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { dirname } from "path"
import { fileURLToPath } from "url"
import { ClientesViagem } from '../models/Viagens.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

Utilizadores.belongsTo(TiposUtilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'TipoUser' })
TiposUtilizadores.hasMany(Utilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'UTILIZADORTIPOUTILIZADOR' })

Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADO', as: 'Validado' })
Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADOR', as: 'Validador' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADO', as: 'VALIDADOVALIDACOES' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADOR', as: 'VALIDADORVALIDACOES' })

const userController = {}
sequelize.sync()

const op = Sequelize.Op

const cache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120,
})

userController.listaAdministradores = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 1,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de administradores.",
        })
    })
}
userController.listaAdministrativos = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 2,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de administrativos.",
        })
    })
}
userController.ListaAdministradoresOperador = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 3,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de administradores do operador.",
        })
    })
}
userController.listaTelefonistas = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 4,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de telefonistas.",
        })
    })
}
userController.listaMotoristas = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 5,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de motoristas.",
        })
    })
}
userController.listaAdministrativosOperador = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 6,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de administrativos do operador.",
        })
    })
}
userController.listaClientes = async (req, res) => {
    Utilizadores.findAll({
        where: {
            TIPO_UTILIZADOR: 7,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de utilizadores.",
        })
    })
}
userController.listaClientesReduzido = async (req, res) => {
    Utilizadores.findAll({
        attributes: ['NR_UTILIZADOR', 'NOME_UTILIZADOR'],
        where: {
            TIPO_UTILIZADOR: 7,
            VALIDADO: true,
            VERIFICADO: true
        },
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            data: "Ocorreu um erro ao obter a lista de utilizadores.",
        })
    })
}
userController.editarUtilizador = async (req, res) => {
    let {
        telemovel, telefone, morada, codpostal, localidade, email, password
    } = req.body.values
    const { nr_user } = req.body

    if(!validateBodyFields(req.body.values, ['telemovel', 'morada', 'codpostal', 'localidade', 'email']) || !nr_user){
        console.log(req.body)
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    Utilizadores.update({
        N_TELEMOVEL: telemovel,
        N_TELEFONE: telefone || null,
        MORADA_UTILIZADOR: morada,
        COD_POSTAL: codpostal,
        FREGUESIA: localidade,
        EMAIL: email,
        PASSWORD: password
    }, {
        where: {
            NR_UTILIZADOR: nr_user,
        },
        individualHooks: true
    }).then(() => {
        return res.json({
            success: true,
            message: 'Dados atualizados com sucesso.'
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao atualizar os dados.'
        })
    })
}
userController.editarUtilizadorPassword = async (req, res) => {
    let { passwordAntiga, passwordNova } = req.body
    const { nr_user } = req.decoded

    if(!validateBodyFields(req.body, ['passwordAntiga', 'passwordNova']) || !nr_user){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }
    await Utilizadores.findOne({
        attributes: [
            'PASSWORD',
        ],
        where: {
            NR_UTILIZADOR: nr_user,
        },
    }).then((data) => {
        if (!data || !bcrypt.compareSync(passwordAntiga, data.PASSWORD)) {
            return res.json({
                success: false,
                message: 'Password antiga inválida.',
            })
        }

        Utilizadores.update({
            PASSWORD: passwordNova
        }, {
            where: {
                NR_UTILIZADOR: nr_user,
            },
            individualHooks: true
        }).then(() => {
            return res.json({
                success: true,
                message: 'Password alterada com sucesso.'
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Ocorreu um erro ao alterar a password.'
            })
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Utilizador não encontrado'
        })
    })
}
userController.resetUtilizadorPassword = async (req, res) => {
    let { email, login } = req.body

    if(!validateBodyFields(req.body, ['email', 'login'])){
        return res.status(400).json({
            success: false,
            message: 'Email em falta.',
        })
    }

    let password = passwordGen(8)

    Utilizadores.update({
        PASSWORD: password
    }, {
        where: {
            EMAIL: email,
            LOGIN_USER: login,
            TIPO_UTILIZADOR: {
                [op.in]: [5, 7],
            },
        },
        individualHooks: true
    }).then(async () => {
        await sendEmail(email,
            'DRT - Nova Password',
            'Olá<br><br>A sua password é: ' + password)

        return res.json({
            success: true,
            message: 'Password nova enviada por email.'
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao alterar a password.'
        })
    })
}
userController.listarMotoristas = async (req, res) => {
    if (cache.get('motoristas') === undefined) {
        await Utilizadores.findAll({
            attributes: ['NR_UTILIZADOR', 'NOME_UTILIZADOR'],
            where: {
                TIPO_UTILIZADOR: 5,
            },
            order: [
                ['NOME_UTILIZADOR', 'ASC'],
            ],
        }).then((data) => {
            cache.set('motoristas', JSON.stringify(data), 3600)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Ocorreu um erro ao pedir a lista de motoristas.'
            })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('motoristas')),
        })
    }
}

userController.validacaoConta = async (req, res) => {
    let { user, aprovar } = req.body

    if(!validateBodyFields(req.body, ['user'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await sequelize.transaction(async (t) => {
        let { nr_user } = req.decoded

        let promises = []
        if(aprovar) {
            promises.push(
                Utilizadores.update({
                    VALIDADO: true,
                }, {
                    where: {
                        NR_UTILIZADOR: user,
                        VALIDADO: false,
                    },
                    transaction: t,
                }),
            )

            promises.push(
                Validacoes.create({
                    NR_VALIDADO: user,
                    NR_VALIDADOR: nr_user,
                    DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ESTADO: 'APROVADO',
                }, {
                    transaction: t,
                }),
            )
        } else {
            promises.push(Utilizadores.destroy({
                where: {
                    NR_UTILIZADOR: user,
                },
                transaction: t,
            }))

            promises.push(
                Validacoes.create({
                    NR_VALIDADO: user,
                    NR_VALIDADOR: nr_user,
                    DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ESTADO: 'DESAPROVADO'
                }, {
                    transaction: t,
                }),
            )
        }

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
userController.verificarContaLink = async (req, res) => {
    let { token } = req.body

    if(token !== '1' && !validateBodyFields(req.body, ['token'])){
        return res.status(400).json({
            success: false,
            message: 'Token inválida.',
        })
    }

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            Utilizadores.update({
                VERIFICADO: true,
                TOKEN: '1',
            }, {
                where: {
                    TOKEN: token,
                    VERIFICADO: false,
                },
                transaction: t,
            }),
        )

        promises.push(
            Utilizadores.findOne({
                attributes: ['NR_UTILIZADOR'],
                where: {
                    TOKEN: token,
                },
            }, {
                transaction: t,
            }).then((data) => {
                Verificacoes.create({
                    NR_VERIFICADO: data.NR_UTILIZADOR,
                    TOKEN: token,
                    DATA_HORA_VERIFICACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    VALIDADO: 'EMAIL',
                }, {
                    transaction: t,
                })
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({
            success: true,
            message: 'Email verificado com sucesso.'
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro durante a verificação.'
        })
    })
}
userController.verificarConta = async (req, res) => {
    const { user } = req.body

    if(!validateBodyFields(req.body, ['user'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            Utilizadores.update({
                VERIFICADO: true,
            }, {
                where: {
                    NR_UTILIZADOR: user,
                },
                transaction: t,
            }),
        )

        promises.push(
            Verificacoes.create({
                NR_VERIFICADO: req.body.user,
                TOKEN: '1',
                DATA_HORA_VERIFICACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                VALIDADO: 'PAINEL',
                NR_VERIFICADOR: req.decoded.nr_user,
            }, {
                transaction: t,
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
userController.verificarContaEnvioEmail = async (req, res) => {
    const { user, email } = req.body

    if(!validateBodyFields(req.body, ['user', 'email'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador e/ou email em falta.',
        })
    }

    let token = uuidv4()

    await sequelize.transaction(async (t) => {
        await Utilizadores.update({
            TOKEN: token,
            DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                NR_UTILIZADOR: user,
            },
            transaction: t
        })

        let data = await Utilizadores.findOne({
            attributes: [
                'NOME_UTILIZADOR'
            ]
        }, {
            where: {
                NR_UTILIZADOR: user,
            },
            transaction: t
        })

        await sendEmail(email.toString(),
            'Conta criada no DRT - Segunda Via',
            'Olá ' + data.NOME_UTILIZADOR + '<br><br>O seu link de ativação da conta: ' + url + 'Ativacao/' + token)
            .then(() => {
                console.log('Sucesso')
            })
            .catch((err) => {
                console.log(err)
                throw new Error()
            })

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

userController.listaUtilizadoresNaoValidados = async (req, res) => {
    await Utilizadores.findAll({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'DATA_NASCIMENTO',
            'N_CC',
            'N_CC_COMPROVATIVO',
            'N_SEGSOCIAL',
            'NIF',
            'N_TELEMOVEL',
            'N_TELEFONE',
            'GENERO',
            'MORADA_UTILIZADOR',
            'COD_POSTAL',
            'MORADA_COMPROVATIVO',
            'FREGUESIA',
            'NACIONALIDADE',
            'EMAIL',
            'VERIFICADO',
            'DATA_ENVIO_MAIL',
            'createdAt',
        ],
        where: {
            VALIDADO: false,
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}

userController.listaRegistosNaoValidados = async (req, res) => {
    await Utilizadores.findAll({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'FREGUESIA',
            'createdAt',
            'deletedAt',
            [
                sequelize.literal(`(SELECT "NOME_UTILIZADOR" AS "NOME_VALIDADOR" FROM "UTILIZADORES" INNER JOIN "VALIDACOES" ON "NR_UTILIZADOR"="NR_VALIDADOR" GROUP BY "NR_UTILIZADOR", "NOME_UTILIZADOR", "NR_VALIDADOR")`),
                'NOME_VALIDADOR'
            ],
        ],
        where: {
            VALIDADO: false,
            deletedAt: {
                [op.ne]: null
            }
        },
        order: [
            ['createdAt', 'ASC'],
        ],
        include: [{
            model: Validacoes,
            as: 'VALIDADOVALIDACOES',
            attributes: ['NR_VALIDADOR'],
            where: {
                ESTADO: 'DESAPROVADO'
            }
        }],
        paranoid: false
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Não foi possível obter a lista de registos não validados'
        })
    })
}
/*userController.apagarRegistoNaoValidado = async (req, res) => {
    await sequelize.transaction(async (t) => {
        let { user, aprovar } = req.body
        let { nr_user } = req.decoded

        let promises = []

        promises.push(Utilizadores.destroy({
            where: {
                NR_UTILIZADOR: user,
            },
            transaction: t,
        }))

        promises.push(
            Validacoes.create({
                NR_VALIDADO: user,
                NR_VALIDADOR: nr_user,
                DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                ESTADO: 'DESAPROVADO'
            }, {
                transaction: t,
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
}*/

userController.getNotificacoes = async (req, res) => {
    const { nr_user } = req.body

    if(!validateBodyFields(req.body, ['nr_user'])){
        return res.status(400).json({
            success: false,
            message: 'Número de utilizador em falta.',
        })
    }

    await Notificacoes.findAll({
        attributes: [
            'CONTEUDO',
            'createdAt'
        ],
        where: {
            NR_UTILIZADOR: nr_user
        },
        order: [['createdAt', 'DESC']],
        limit: 10
    }).then((data) => {
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: true,
            message: 'Não foi possível obter as notificações.'
        })
    })
}

userController.registar = async (req, res) => {
    let {
        nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, tipo_utilizador
    } = req.body

    if(!req.files){
        return res.status(400).json({
            success: false,
            message: 'Erro ao efetuar o upload dos ficheiros.',
        })
    }

    if(!validateBodyFields(req.body,
        ['nome', 'datanascimento', 'genero', 'ncc', 'nss', 'nif', 'telemovel', 'nacionalidade',
            'morada', 'codpostal', 'localidade', 'email', 'utilizador', 'tipo_utilizador'
        ])){
        return res.status(400).json({
            success: false,
            message: 'Campos em Branco.',
        })
    }

    req.files.files.map((file) => {
        let newName = uuidv4() + '-' + file.originalFilename
        file.newName = newName
        //fs.renameSync(__dirname + '\\..\\..\\' + file.path, 'src\\public\\documentos\\' + newName)
        fs.renameSync(__dirname + '/../../' + file.path, 'src/public/documentos/' + newName)
    })

    let imagens = req.files.files.map((file) => file.newName)
    let password = passwordGen(8)
    let token = uuidv4()

    await Utilizadores.create({
        NOME_UTILIZADOR: nome,
        DATA_NASCIMENTO: moment(datanascimento).format('YYYY-MM-DD'),
        N_CC: ncc,
        N_CC_COMPROVATIVO: imagens.find(imagem => imagem.includes('cartao_cidadao')),
        N_SEGSOCIAL: nss,
        NIF: nif,
        N_TELEMOVEL: telemovel,
        N_TELEFONE: telefone || null,
        GENERO: genero,
        MORADA_UTILIZADOR: morada,
        COD_POSTAL: codpostal,
        MORADA_COMPROVATIVO: imagens.find(imagem => imagem.includes('comprovativo_morada')) || null,
        FREGUESIA: localidade,
        NACIONALIDADE: nacionalidade,
        CARTA_CONDUCAO_COMPROVATIVO: imagens.find(imagem => imagem.includes('carta_conducao')) || null,
        TIPO_UTILIZADOR: tipo_utilizador,
        EMAIL: email,
        LOGIN_USER: utilizador,
        PASSWORD: password,
        VALIDADO: tipo_utilizador === 7,
        VERIFICADO: false,
        TOKEN: token,
        DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss'),
        IP_REGISTO: req.ip_address
    }).then(async (data) => {
        /*await sendEmail(data.EMAIL,
            'Conta criada no DRT',
            'Olá ' + nome + '<br><br>A sua password é: ' + password + '<br><br>O seu link de ativação da conta: ' + url + 'Ativacao/' + token)
*/
        return res.json({
            success: true,
            data: data,
            message: 'Utilizador adicionado com sucesso',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Email ou Utilizador já registado',
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao inserir o utilizador na base de dados.',
        })
    })
}
userController.registarApp = async (req, res) => {
    let {
        nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, password
    } = req.body

    if(req.files === undefined){
        return res.json({
            success: false,
            message: 'Erro ao efetuar o upload dos ficheiros.',
        })
    }

    if(!validateBodyFields(req.body,
        ['nome', 'datanascimento', 'genero', 'ncc', 'nss', 'nif', 'telemovel', 'nacionalidade',
            'morada', 'codpostal', 'localidade', 'email', 'utilizador', 'password'
        ])){
        return res.status(400).json({
            success: false,
            message: 'Campos em Branco.',
        })
    }

    let imagens = req.files.map((file) => file.filename)
    let token = uuidv4()

    await Utilizadores.create({
        NOME_UTILIZADOR: nome,
        DATA_NASCIMENTO: moment(datanascimento).format('YYYY-MM-DD'),
        N_CC: ncc,
        N_CC_COMPROVATIVO: imagens.find(imagem => imagem.includes('cartao_cidadao')),
        N_SEGSOCIAL: nss,
        NIF: nif,
        N_TELEMOVEL: telemovel,
        N_TELEFONE: telefone,
        GENERO: genero,
        MORADA_UTILIZADOR: morada,
        COD_POSTAL: codpostal,
        MORADA_COMPROVATIVO: imagens.find(imagem => imagem.includes('comprovativo_morada')) || null,
        FREGUESIA: localidade,
        NACIONALIDADE: nacionalidade,
        CARTA_CONDUCAO_COMPROVATIVO: imagens.find(imagem => imagem.includes('carta_conducao')) || null,
        TIPO_UTILIZADOR: 7,
        EMAIL: email,
        LOGIN_USER: utilizador,
        PASSWORD: password,
        VALIDADO: false,
        VERIFICADO: false,
        TOKEN: token,
        DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss'),
        IP_REGISTO: req.ip_address
    }).then(async (data) => {
        await sendEmail(data.EMAIL,
            'Conta criada no DRT',
            'Olá ' + nome + '<br><br>O seu link de ativação da conta: ' + url + 'Ativacao/' + token)

        return res.json({
            success: true,
            data: data,
            message: 'Utilizador adicionado com sucesso',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Email ou Utilizador já registado',
        })
    }).catch((error) => {
        console.log(error)
        return res.json({
            success: false,
            message: 'Não foi possível efetuar o registo.',
        })
    })
}

userController.login = async (req, res) => {
    const { username, password } = req.body

    if(!validateBodyFields(req.body, ['username', 'password'])){
        return res.status(400).json({
            success: false,
            message: 'Campos em Branco.',
        })
    }

    await Utilizadores.findOne({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'TIPO_UTILIZADOR',
            'PASSWORD',
            'VALIDADO',
            'VERIFICADO',
        ],
        where: {
            EMAIL: username,
            TIPO_UTILIZADOR: {
                [op.in]: [1, 2, 3, 4, 6],
            },
        },
    }).then((data) => {
        if (!data || !bcrypt.compareSync(password, data.PASSWORD)) {
            return res.json({
                success: false,
                message: 'Dados de autenticação inválidos.',
            })
        }

        if (!data.VALIDADO) {
            return res.json({
                success: false,
                message: 'Conta não validada.',
            })
        }

        if (!data.VERIFICADO) {
            return res.json({
                success: false,
                message: 'Conta não verificada.',
            })
        }

        Utilizadores.update({
            IP_ULTIMO_LOGIN: req.ip_address,
        }, {
            where: {
                NR_UTILIZADOR: data.NR_UTILIZADOR,
            }
        })

        let token
        if (req.body.remember) {
            token = jwt.sign({
                nr_user: data.NR_UTILIZADOR,
                email: username,
                tipo_utilizador: data.TIPO_UTILIZADOR
            }, jwtSecret, {})
        } else {
            token = jwt.sign({
                nr_user: data.NR_UTILIZADOR,
                email: username,
                tipo_utilizador: data.TIPO_UTILIZADOR
            }, jwtSecret, { expiresIn: '1h' })
        }

        return res.json({
            success: true,
            message: 'Autenticação realizada com sucesso!',
            token: token,
            tipoUser: data.TIPO_UTILIZADOR,
            validado: data.VALIDADO,
            verificado: data.VERIFICADO,
            nome: data.NOME_UTILIZADOR
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Erro no processo de autenticação. Tente de novo mais tarde.',
        })
    })
}
userController.loginApp = async (req, res) => {
    const { username, password } = req.body

    if(!validateBodyFields(req.body, ['username', 'password'])){
        return res.status(400).json({
            success: false,
            message: 'Campos em Branco.',
        })
    }

    await Utilizadores.findOne({
        where: {
            EMAIL: username,
            TIPO_UTILIZADOR: {
                [op.in]: [5, 7],
            },
        },
    }).then(async (data) => {
        if (!data || !bcrypt.compareSync(password, data.PASSWORD)) {
            return res.json({
                success: false,
                message: 'Dados de autenticação inválidos.',
            })
        }

        if (!data.VALIDADO) {
            return res.json({
                success: false,
                message: 'Conta não validada.',
            })
        }

        if (!data.VERIFICADO) {
            return res.json({
                success: false,
                message: 'Conta não verificada.',
            })
        }

        Utilizadores.update({
            IP_ULTIMO_LOGIN: req.ip_address,
        }, {
            where: {
                NR_UTILIZADOR: data.NR_UTILIZADOR,
            }
        })

        let dividas = false, montante = 0

        await ClientesViagem.findOne({
            attributes: [
                [sequelize.fn('sum', sequelize.col('MONTANTE')), 'montante'],
            ],
            where: {
                NR_CLIENTE: data.NR_UTILIZADOR,
                ESTADO_CLIENTE: {
                    [op.in]: ['PRESENTE', 'FALTOU']
                },
                ESTADO_PAGAMENTO: 'PENDENTE'
            }
        }).then((data1) => {
            if (data1.length !== 0) {
                dividas = true
                montante = data1.dataValues.montante
            }
        })

        let token
        if (req.body.remember) {
            token = jwt.sign({
                nr_user: data.NR_UTILIZADOR,
                email: username,
                tipo_utilizador: data.TIPO_UTILIZADOR
            }, jwtSecret, {})
        } else {
            token = jwt.sign({
                nr_user: data.NR_UTILIZADOR,
                email: username,
                tipo_utilizador: data.TIPO_UTILIZADOR
            }, jwtSecret, { expiresIn: '1h' })
        }

        return res.json({
            success: true,
            message: 'Autenticação realizada com sucesso!',
            token: token,
            data: {
                nrUser: data.NR_UTILIZADOR,
                tipoUser: data.TIPO_UTILIZADOR,
                nome: data.NOME_UTILIZADOR,
                email: data.EMAIL,
                telemovel: data.N_TELEMOVEL,
                divida: dividas,
                montante: montante
            }
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Erro no processo de autenticação. Tente de novo mais tarde.',
        })
    })
}

userController.verificar_login = async (req, res) => {
    jwt.verify(req.body.token.Authorization.split(' ')[1], jwtSecret, (err, decoded) => {
        if (decoded) {
            res.json({
                success: true,
                message: 'Autenticação válida!',
                data: decoded
            })
        } else {
            res.json({
                success: false,
                message: 'Autenticação não válida!',
            })
        }
    })
}

export { userController }
